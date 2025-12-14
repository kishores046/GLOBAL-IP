package com.teamb.globalipbackend1.util.id;


import com.teamb.globalipbackend1.auth.entity.RoleRequest;
import com.teamb.globalipbackend1.model.Role;
import com.teamb.globalipbackend1.model.User;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;

public class PrefixIdGenerator implements IdentifierGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {

        // Decide prefix based on entity
        String prefix = switch (object) {

            case User ignored -> "USR";
            case Role ignored -> "RL";
            case RoleRequest ignored->"RR";
            default -> throw new IllegalStateException(
                    "Prefix not defined for entity: " + object.getClass().getSimpleName()
            );
        };

        // Decide ID field name
        String idFieldName = switch (object) {
            case User ignored -> "userId";
            case Role ignored -> "roleId";
            case RoleRequest ignored->"id";
            default -> "id";
        };

        String entityName = object.getClass().getSimpleName();
        String hql = "SELECT MAX(e." + idFieldName + ") FROM " + entityName + " e";

        var query = session.createSelectionQuery(hql, Object.class);

        String lastId = query.uniqueResultOptional()
                .map(String::valueOf)
                .orElse(null);




        long nextNum = 1;

        if (lastId != null && !lastId.isBlank()) {
            if (!lastId.startsWith(prefix)) {
                throw new IllegalStateException("Invalid ID in DB: " + lastId +
                        " (expected prefix: " + prefix + ")");
            }

            // Safely extract the number part based on prefix length
            String numberPart = lastId.substring(prefix.length());

            try {
                nextNum = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                throw new IllegalStateException(
                        "ID is corrupted in DB: " + lastId + " — numeric part invalid"
                );
            }
        }

        // Return formatted ID
        return prefix + String.format("%04d", nextNum);
    }
}
