package com.teamb.globalipbackend1.service.patent.citations;

import com.teamb.globalipbackend1.dto.citation.*;
import com.teamb.globalipbackend1.external.patentsview.PatentsViewCitationClient;
import com.teamb.globalipbackend1.external.patentsview.dto.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class EnhancedCitationNetworkService {


    private PatentsViewCitationClient citationClient;

    // Constants for depth control
    private static final int MAX_BACKWARD_DEPTH = 1;
    private static final int MAX_FORWARD_DEPTH = 1;
    private static final int MAX_NODES_PER_LEVEL = 50; // Limit nodes to prevent explosion
    private static final int MAX_TOTAL_NODES = 200; // Absolute max for visualization

    /**
     * Fetch multi-level citation network with intelligent depth management
     */
    @Cacheable(value = "citationNetwork", key = "#patentId + '_' + #requestedBackwardDepth + '_' + #requestedForwardDepth")
    public CitationNetworkResponse fetchCitationNetwork(
            String patentId,
            int requestedBackwardDepth,
            int requestedForwardDepth) {

        log.info("At enhanced citation service");
        // Force depth to be 1 to prevent network explosion
        int backwardDepth = Math.min(requestedBackwardDepth, MAX_BACKWARD_DEPTH);
        int forwardDepth = Math.min(requestedForwardDepth, MAX_FORWARD_DEPTH);

        log.info("Fetching citation network for patent: {} (requested backward: {}, forward: {} | actual: {}, {})",
                patentId, requestedBackwardDepth, requestedForwardDepth, backwardDepth, forwardDepth);

        Set<String> visitedPatents = new HashSet<>();
        Map<String, PatentNode> nodeMap = new HashMap<>();
        List<CitationEdge> edges = new ArrayList<>();

        NetworkStats stats = new NetworkStats();

        // Add root patent
        PatentNode rootNode = createPatentNode(patentId, 0, true);
        nodeMap.put(patentId, rootNode);

        // Fetch citations with controlled depth
        try {
            if (backwardDepth > 0) {
                fetchBackwardCitationsControlled(patentId, visitedPatents, nodeMap, edges, stats);
            }

            if (forwardDepth > 0) {
                fetchForwardCitationsControlled(patentId, visitedPatents, nodeMap, edges, stats);
            }
        } catch (Exception e) {
            log.error("Error fetching citation network for patent {}: {}", patentId, e.getMessage());
            // Return partial results
        }

        // Log statistics
        log.info("Citation network complete - Nodes: {}, Edges: {}, Backward: {}, Forward: {}, Errors: {}",
                nodeMap.size(), edges.size(), stats.backwardCount, stats.forwardCount, stats.errorCount);

        // Calculate metrics and clusters
        NetworkMetrics metrics = calculateNetworkMetrics(nodeMap, edges, stats);
        Map<String, TechnologyCluster> clusters = identifyClusters(nodeMap, edges);

        // Calculate node sizes based on citation counts
        assignNodeSizes(nodeMap);

        return CitationNetworkResponse.builder()
                .nodes(new ArrayList<>(nodeMap.values()))
                .edges(edges)
                .metrics(metrics)
                .clusters(clusters)
                .build();
    }

    /**
     * Fetch backward citations with single level only (depth=1)
     */
    private void fetchBackwardCitationsControlled(
            String patentId,
            Set<String> visited,
            Map<String, PatentNode> nodes,
            List<CitationEdge> edges,
            NetworkStats stats) {

        if (visited.contains("B_" + patentId)) {
            return;
        }
        visited.add("B_" + patentId);

        // Check if we're approaching node limit
        if (nodes.size() >= MAX_TOTAL_NODES) {
            log.warn("Reached maximum node limit ({}) for patent {}, skipping further backward citations",
                    MAX_TOTAL_NODES, patentId);
            stats.nodesLimitReached = true;
            return;
        }

        try {
            List<PatentsViewUSPatentCitation> citations =
                    citationClient.getBackwardCitations(patentId);

            if (citations == null || citations.isEmpty()) {
                log.info("No backward citations found for patent: {}", patentId);
                return;
            }

            log.info("Found {} backward citations for patent: {}", citations.size(), patentId);
            stats.backwardCount += citations.size();

            // Limit citations per node to prevent explosion
            int processedCount = 0;
            for (PatentsViewUSPatentCitation citation : citations) {
                if (processedCount >= MAX_NODES_PER_LEVEL) {
                    log.warn("Reached per-level citation limit ({}) for patent {}, truncating",
                            MAX_NODES_PER_LEVEL, patentId);
                    stats.truncated = true;
                    break;
                }

                if (nodes.size() >= MAX_TOTAL_NODES) {
                    log.warn("Reached total node limit, stopping backward citation processing");
                    stats.nodesLimitReached = true;
                    break;
                }

                try {
                    String citedPatentId = citation.getCitationPatentId();

                    if (citedPatentId == null || citedPatentId.isBlank()) {
                        log.warn("Invalid citation patent ID in backward citations for {}", patentId);
                        continue;
                    }

                    // Add edge (from current patent to cited patent)
                    edges.add(CitationEdge.builder()
                            .source(patentId)
                            .target(citedPatentId)
                            .citationType(citation.getCitationCategory())
                            .citationDate(citation.getCitationDate())
                            .weight(1)
                            .build());

                    // Add node if not exists (only 1 level deep)
                    if (!nodes.containsKey(citedPatentId)) {
                        PatentNode node = createPatentNode(citedPatentId, 1, false);
                        nodes.put(citedPatentId, node);
                        processedCount++;
                    }
                } catch (Exception e) {
                    log.error("Error processing backward citation for {}: {}", patentId, e.getMessage());
                    stats.errorCount++;
                }
            }
        } catch (Exception e) {
            log.error("Error fetching backward citations for {}: {}", patentId, e.getMessage());
            stats.errorCount++;
            // Continue processing - don't fail the entire network
        }
    }

    /**
     * Fetch forward citations with single level only (depth=1)
     */
    private void fetchForwardCitationsControlled(
            String patentId,
            Set<String> visited,
            Map<String, PatentNode> nodes,
            List<CitationEdge> edges,
            NetworkStats stats) {

        if (visited.contains("F_" + patentId)) {
            return;
        }
        visited.add("F_" + patentId);

        // Check if we're approaching node limit
        if (nodes.size() >= MAX_TOTAL_NODES) {
            log.warn("Reached maximum node limit ({}) for patent {}, skipping forward citations",
                    MAX_TOTAL_NODES, patentId);
            stats.nodesLimitReached = true;
            return;
        }

        try {
            List<PatentsViewUSPatentCitation> citations =
                    citationClient.getForwardCitations(patentId);

            if (citations == null || citations.isEmpty()) {
                log.info("No forward citations found for patent: {} (patent may be new or not yet cited)",
                        patentId);
                stats.hasNoForwardCitations = true;
                return;
            }

            log.info("Found {} forward citations for patent: {}", citations.size(), patentId);
            stats.forwardCount += citations.size();

            // Limit citations per node to prevent explosion
            int processedCount = 0;
            for (PatentsViewUSPatentCitation citation : citations) {
                if (processedCount >= MAX_NODES_PER_LEVEL) {
                    log.warn("Reached per-level citation limit ({}) for patent {}, truncating",
                            MAX_NODES_PER_LEVEL, patentId);
                    stats.truncated = true;
                    break;
                }

                if (nodes.size() >= MAX_TOTAL_NODES) {
                    log.warn("Reached total node limit, stopping forward citation processing");
                    stats.nodesLimitReached = true;
                    break;
                }

                try {
                    String citingPatentId = citation.getPatentId();

                    if (citingPatentId == null || citingPatentId.isBlank()) {
                        log.warn("Invalid citing patent ID in forward citations for {}", patentId);
                        continue;
                    }

                    // Add edge (from citing patent to current patent)
                    edges.add(CitationEdge.builder()
                            .source(citingPatentId)
                            .target(patentId)
                            .citationType(citation.getCitationCategory())
                            .citationDate(citation.getCitationDate())
                            .weight(1)
                            .build());

                    // Add node if not exists (only 1 level deep)
                    if (!nodes.containsKey(citingPatentId)) {
                        PatentNode node = createPatentNode(citingPatentId, 1, false);
                        nodes.put(citingPatentId, node);
                        processedCount++;
                    }
                } catch (Exception e) {
                    log.error("Error processing forward citation for {}: {}", patentId, e.getMessage());
                    stats.errorCount++;
                }
            }
        } catch (Exception e) {
            log.error("Error fetching forward citations for {}: {}", patentId, e.getMessage());
            stats.errorCount++;
            // Continue processing - don't fail the entire network
        }
    }

    /**
     * Create a patent node with basic info
     */
    private PatentNode createPatentNode(String patentId, int depth, boolean isRoot) {
        // TODO: Fetch actual patent details from PatentsView API
        // For now, create a basic node
        return PatentNode.builder()
                .patentId(patentId)
                .title("Patent " + patentId) // Placeholder
                .depth(depth)
                .backwardCitationCount(0)
                .forwardCitationCount(0)
                .nodeSize(isRoot ? 30 : 15) // Root node larger
                .nodeColor(isRoot ? "#3B82F6" : (depth == 0 ? "#3B82F6" : "#94A3B8"))
                .ipcClasses(new ArrayList<>())
                .cpcClasses(new ArrayList<>())
                .inventors(new ArrayList<>())
                .build();
    }

    /**
     * Calculate network metrics with stats
     */
    private NetworkMetrics calculateNetworkMetrics(
            Map<String, PatentNode> nodes,
            List<CitationEdge> edges,
            NetworkStats stats) {

        NetworkMetrics metrics = new NetworkMetrics();

        metrics.setTotalNodes(nodes.size());
        metrics.setTotalEdges(edges.size());

        // Add warning flags
        if (stats.nodesLimitReached) {
            log.warn("Network was truncated due to node limit");
        }
        if (stats.hasNoForwardCitations) {
            log.info("Patent has no forward citations (may be new or not yet cited)");
        }

        // Calculate citation density
        int maxPossibleEdges = nodes.size() * (nodes.size() - 1);
        if (maxPossibleEdges > 0) {
            metrics.setCitationDensity((double) edges.size() / maxPossibleEdges);
        } else {
            metrics.setCitationDensity(0.0);
        }

        // Calculate citation counts per node
        Map<String, Long> forwardCitationCounts = new HashMap<>();
        Map<String, Long> backwardCitationCounts = new HashMap<>();

        // Count forward citations (how many times each patent is cited)
        edges.forEach(edge -> {
            forwardCitationCounts.merge(edge.getTarget(), 1L, Long::sum);
        });

        // Count backward citations (how many patents each patent cites)
        edges.forEach(edge -> {
            backwardCitationCounts.merge(edge.getSource(), 1L, Long::sum);
        });

        // Update node citation counts
        nodes.values().forEach(node -> {
            node.setForwardCitationCount(
                    forwardCitationCounts.getOrDefault(node.getPatentId(), 0L).intValue()
            );
            node.setBackwardCitationCount(
                    backwardCitationCounts.getOrDefault(node.getPatentId(), 0L).intValue()
            );
        });

        // Calculate average citations (only for patents that have citations)
        double avgCitations = forwardCitationCounts.values().stream()
                .mapToDouble(Long::doubleValue)
                .average()
                .orElse(0.0);
        metrics.setAverageCitationsPerPatent(avgCitations);

        // Find most cited patent
        forwardCitationCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .ifPresent(entry -> {
                    metrics.setMostCitedPatent(entry.getKey());
                    metrics.setMostCitedCount(entry.getValue().intValue());
                });

        // Assignee distribution (will be empty until we fetch patent details)
        Map<String, Integer> assigneeCount = nodes.values().stream()
                .filter(node -> node.getAssignee() != null && !node.getAssignee().isBlank())
                .collect(Collectors.groupingBy(
                        PatentNode::getAssignee,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        metrics.setAssigneeDistribution(assigneeCount);

        // Citations by year
        Map<Integer, Integer> citationsByYear = edges.stream()
                .filter(edge -> edge.getCitationDate() != null)
                .collect(Collectors.groupingBy(
                        edge -> edge.getCitationDate().getYear(),
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        metrics.setCitationsByYear(citationsByYear);

        return metrics;
    }

    /**
     * Identify technology clusters based on IPC classification
     */
    private Map<String, TechnologyCluster> identifyClusters(
            Map<String, PatentNode> nodes,
            List<CitationEdge> edges) {

        Map<String, TechnologyCluster> clusters = new HashMap<>();

        // Filter nodes that have IPC classes
        List<PatentNode> nodesWithIpc = nodes.values().stream()
                .filter(node -> node.getIpcClasses() != null && !node.getIpcClasses().isEmpty())
                .toList();

        if (nodesWithIpc.isEmpty()) {
            log.info("No IPC classification data available for clustering");
            return clusters;
        }

        // Group by primary IPC classification
        Map<String, List<PatentNode>> ipcGroups = nodesWithIpc.stream()
                .collect(Collectors.groupingBy(node -> {
                    String firstIpc = node.getIpcClasses().getFirst();
                    return firstIpc.substring(0, Math.min(4, firstIpc.length()));
                }));

        String[] colors = {"#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"};
        int colorIndex = 0;

        for (Map.Entry<String, List<PatentNode>> entry : ipcGroups.entrySet()) {
            String ipcClass = entry.getKey();
            List<PatentNode> patentList = entry.getValue();

            TechnologyCluster cluster = TechnologyCluster.builder()
                    .clusterId(ipcClass)
                    .clusterName("IPC " + ipcClass)
                    .patentIds(patentList.stream()
                            .map(PatentNode::getPatentId)
                            .collect(Collectors.toList()))
                    .size(patentList.size())
                    .color(colors[colorIndex % colors.length])
                    .build();

            clusters.put(ipcClass, cluster);
            colorIndex++;
        }

        return clusters;
    }

    /**
     * Assign node sizes based on citation counts
     */
    private void assignNodeSizes(Map<String, PatentNode> nodes) {
        if (nodes.isEmpty()) {
            return;
        }

        // Find max citation count
        int maxCitations = nodes.values().stream()
                .mapToInt(node -> node.getForwardCitationCount() + node.getBackwardCitationCount())
                .max()
                .orElse(1);

        if (maxCitations == 0) {
            maxCitations = 1; // Prevent division by zero
        }

        // Assign sizes (15 to 40 based on citation count, root is larger)
        final int maxCitationsFinal = maxCitations;
        nodes.values().forEach(node -> {
            int totalCitations = node.getForwardCitationCount() + node.getBackwardCitationCount();

            // Root node (depth 0) gets special treatment
            if (node.getDepth() == 0) {
                node.setNodeSize(35);
            } else {
                // Scale from 15 to 40
                int size = 15 + (int) (25.0 * totalCitations / maxCitationsFinal);
                node.setNodeSize(Math.max(15, Math.min(40, size)));
            }
        });
    }

    /**
     * Helper class to track network statistics during construction
     */
    private static class NetworkStats {
        int backwardCount = 0;
        int forwardCount = 0;
        int errorCount = 0;
        boolean truncated = false;
        boolean nodesLimitReached = false;
        boolean hasNoForwardCitations = false;
    }
}