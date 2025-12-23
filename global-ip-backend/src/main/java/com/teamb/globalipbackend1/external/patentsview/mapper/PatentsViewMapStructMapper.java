package com.teamb.globalipbackend1.external.patentsview.mapper;

import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewAssignee;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewInventor;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewResponseDocument;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PatentsViewMapStructMapper {

    @Mapping(source = "patentId", target = "publicationNumber")
    @Mapping(source = "patentTitle", target = "title")
    @Mapping(source = "patentDate", target = "publicationDate")
    @Mapping(target = "jurisdiction", constant = "US")
    @Mapping(source = "patentsViewAssignees", target = "assignees", qualifiedByName = "mapAssignees")
    @Mapping(source = "patentsViewInventors", target = "inventors", qualifiedByName = "mapInventors")
    PatentDocument toPatentDocument(PatentsViewResponseDocument source);

    List<PatentDocument> toPatentDocuments(List<PatentsViewResponseDocument> sources);

    @Named("mapAssignees")
    default List<String> mapAssignees(List<PatentsViewAssignee> assignees) {
        if (assignees == null) return List.of();

        return assignees.stream()
                .map(a -> a.getAssigneeOrganisation() != null
                        ? a.getAssigneeOrganisation()
                        : combineNames(a.getAssigneeIndividualFirstName(), a.getAssigneeIndividualLastName()))
                .collect(Collectors.toList());
    }

    @Named("mapInventors")
    default List<String> mapInventors(List<PatentsViewInventor> inventors) {
        if (inventors == null) return List.of();

        return inventors.stream()
                .map(i -> combineNames(i.getInventorFirstName(), i.getInventorLastName()))
                .filter(name -> !name.isEmpty())
                .collect(Collectors.toList());
    }

    default String combineNames(String firstName, String lastName) {
        String first = firstName != null ? firstName : "";
        String last = lastName != null ? lastName : "";
        return (first + " " + last).trim();
    }
}