package com.settribe.employee_leave;

import com.settribe.employee_leave.service.AuthService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EmployeeLeaveApplication {

	public static void main(String[] args) {
		SpringApplication.run(
				EmployeeLeaveApplication.class, args);
	}

	@Bean
	CommandLineRunner createAdmin(AuthService authService) {
		return args -> authService.createAdmin();
	}
}