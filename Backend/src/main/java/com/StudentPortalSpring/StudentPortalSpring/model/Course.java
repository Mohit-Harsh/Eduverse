package com.StudentPortalSpring.StudentPortalSpring.model;

import com.fasterxml.uuid.Generators;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document
@Data
@AllArgsConstructor
public class Course
{
    @Id
    private UUID cid;
    private String title;
    private Integer topics;
    private Integer resources;
    private List<UUID> midList;

    public Course()
    {
        this.cid = Generators.timeBasedGenerator().generate();
    }
}
