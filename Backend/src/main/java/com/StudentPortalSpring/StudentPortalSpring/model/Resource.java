package com.StudentPortalSpring.StudentPortalSpring.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document
@Data
@AllArgsConstructor
public class Resource
{
    @Id
    private Long rid;
    private String title;
    private String description;
    private LocalDate date;
    private String link;

    public Resource()
    {
        this.date = LocalDate.now();
    }

}
