package com.StudentPortalSpring.StudentPortalSpring.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.StudentPortalSpring.StudentPortalSpring.model.Module;

@Repository
public interface ModuleRepo extends MongoRepository<Module, Long> {
}
