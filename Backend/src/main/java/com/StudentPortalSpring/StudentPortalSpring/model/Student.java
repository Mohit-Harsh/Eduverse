package com.StudentPortalSpring.StudentPortalSpring.model;

import com.fasterxml.uuid.Generators;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Document(collection = "Student")
@AllArgsConstructor

public class Student
{
    @Id
    private UUID sid;

    private String name;

    private String email;

    private String university;

    private List<UUID> cidList;

    public Student()
    {
        this.sid = Generators.timeBasedGenerator().generate();
        this.cidList = new ArrayList<>();
    }


    public UUID getSid() {
        return sid;
    }

    public void setSid(UUID sid) {
        this.sid = sid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public List<UUID> getCidList() {
        return cidList;
    }

    public void setCidList(List<UUID> cidList) {
        this.cidList = cidList;
    }
}
