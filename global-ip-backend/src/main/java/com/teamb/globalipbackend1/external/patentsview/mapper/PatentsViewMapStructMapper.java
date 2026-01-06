package com.teamb.globalipbackend1.external.patentsview.mapper;

import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewAssignee;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewCpcCurrent;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewIpcClass;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewInventor;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewResponseDocument;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import org.mapstruct.*;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface PatentsViewMapStructMapper {


    @Mapping(source = "patentId", target = "publicationNumber")
    @Mapping(source = "patentTitle", target = "title")
    @Mapping(source = "patentAbstract", target = "abstractText")
    @Mapping(target = "source", constant = "PATENTSVIEW")

    // Dates
    @Mapping(source = "patentEarliestApplicationDate", target = "filingDate")
    @Mapping(source = "patentDate", target = "grantDate")

    // Jurisdiction
    @Mapping(target = "jurisdiction", constant = "US")

    // Parties
    @Mapping(source = "patentsViewAssignees", target = "assignees", qualifiedByName = "mapAssignees")
    @Mapping(source = "patentsViewInventors", target = "inventors", qualifiedByName = "mapInventors")

    // Classification
    @Mapping(source = "patentsViewCpcCurrents", target = "cpcClasses", qualifiedByName = "mapCpcClasses")
    @Mapping(source = "patentsViewIpcCurrent", target = "ipcClasses", qualifiedByName = "mapIpcClasses")

    // Analytics
    @Mapping(source = "wipoKind", target = "wipoKind")
    @Mapping(source = "patentNumTimesCitedByUsPatents", target = "timesCited")
    @Mapping(source = "patentNumTotalDocumentsCited", target = "totalCitations")
    PatentDocument toPatentDocument(PatentsViewResponseDocument source);

    List<PatentDocument> toPatentDocuments(List<PatentsViewResponseDocument> sources);

    @Named("mapAssignees")
    default List<String> mapAssignees(List<PatentsViewAssignee> assignees) {
        if (assignees == null || assignees.isEmpty()) return List.of();

        return assignees.stream()
                .map(a -> a.getAssigneeOrganisation() != null
                        ? a.getAssigneeOrganisation()
                        : combineNames(a.getAssigneeIndividualFirstName(), a.getAssigneeIndividualLastName()))
                .filter(name -> name != null && !name.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }

    @Named("mapInventors")
    default List<String> mapInventors(List<PatentsViewInventor> inventors) {
        if (inventors == null || inventors.isEmpty()) return List.of();

        return inventors.stream()
                .map(i -> combineNames(i.getInventorFirstName(), i.getInventorLastName()))
                .filter(name -> !name.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    @Named("mapCpcClasses")
    default List<String> mapCpcClasses(List<PatentsViewCpcCurrent> cpcCurrents) {
        if (cpcCurrents == null || cpcCurrents.isEmpty()) return List.of();

        return cpcCurrents.stream()
                .map(cpc -> {
                    String subclass = cpc.getCpcSubclass();
                    String group = cpc.getCpcGroup();

                    if (subclass != null && group != null) {
                        return subclass + group;
                    } else if (subclass != null) {
                        return subclass;
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .filter(code -> !code.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }

    @Named("mapIpcClasses")
    default List<String> mapIpcClasses(List<PatentsViewIpcClass> ipcCurrents) {
        if (ipcCurrents == null || ipcCurrents.isEmpty()) return List.of();

        return ipcCurrents.stream()
                .map(PatentsViewIpcClass::getFullIpcCode)
                .filter(Objects::nonNull)
                .filter(code -> !code.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }

    default String combineNames(String firstName, String lastName) {
        String first = firstName != null ? firstName.trim() : "";
        String last = lastName != null ? lastName.trim() : "";
        return (first + " " + last).trim();
    }
}