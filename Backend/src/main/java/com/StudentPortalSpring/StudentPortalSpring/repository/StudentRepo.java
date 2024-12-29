package com.StudentPortalSpring.StudentPortalSpring.repository;

import com.StudentPortalSpring.StudentPortalSpring.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StudentRepo extends MongoRepository<Student, UUID> {
}
