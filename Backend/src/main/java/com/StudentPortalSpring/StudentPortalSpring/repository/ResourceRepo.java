package com.StudentPortalSpring.StudentPortalSpring.repository;

import com.StudentPortalSpring.StudentPortalSpring.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepo extends MongoRepository<Resource,Long> {
}
