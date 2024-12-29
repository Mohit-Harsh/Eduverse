package com.StudentPortalSpring.StudentPortalSpring.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
public class Module
{
    @Id
    private Long mid;
    private String name;
    private Object topics;
}
