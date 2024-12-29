package com.StudentPortalSpring.StudentPortalSpring.controller;

import com.StudentPortalSpring.StudentPortalSpring.DTO.StudentDTO;
import com.StudentPortalSpring.StudentPortalSpring.model.Student;
import com.StudentPortalSpring.StudentPortalSpring.repository.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/student")
public class StudentController
{
    @Autowired
    private StudentRepo repo;

    @PostMapping("/create")
    public Student createStudent(@RequestBody StudentDTO request)
    {
        Student st = new Student();
        st.setName(request.getName());
        st.setEmail(request.getEmail());
        st.setUniversity(request.getUniversity());
        return repo.save(st);
    }

    @GetMapping("/{id}")
    public Optional<Student> getStudentById(@PathVariable UUID id)
    {
        return repo.findById(id);
    }

}
