
package com.settribe.employee_leave.service;

import com.settribe.employee_leave.dto.LeaveRequestDto;
import com.settribe.employee_leave.entity.LeaveRequest;
import com.settribe.employee_leave.entity.LeaveStatus;
import com.settribe.employee_leave.entity.User;
import com.settribe.employee_leave.repository.LeaveRepository;
import com.settribe.employee_leave.entity.Role;
import com.settribe.employee_leave.repository.UserRepository;
import java.util.Map;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;


    public LeaveService(
            LeaveRepository leaveRepository,
            UserRepository userRepository) {

        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
    }

    // GET - Employee Leaves
    public List<LeaveRequest> getMyLeaves(User user) {
        return leaveRepository.findByUserId(user.getId());
    }

    // POST - Apply Leave
    public LeaveRequest applyLeave(LeaveRequestDto dto, User user) {

        if (dto.getFromDate().isAfter(dto.getToDate())) {
            throw new IllegalArgumentException(
                    "From date cannot be after To date"
            );
        }

        LeaveRequest leave = new LeaveRequest();

        leave.setUser(user);
        leave.setLeaveType(dto.getLeaveType());
        leave.setFromDate(dto.getFromDate());
        leave.setToDate(dto.getToDate());
        leave.setReason(dto.getReason());
        leave.setStatus(LeaveStatus.PENDING);
        leave.setCreatedAt(java.time.LocalDateTime.now());

        return leaveRepository.save(leave);
    }


    public LeaveRequest updateLeave(
            Long id, LeaveRequestDto dto, User user) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave request not found"));

        // Check ownership
        if (!leave.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You cannot update another employee's leave");
        }

        // Only PENDING leave can be updated
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave can be updated");
        }

        if (dto.getFromDate().isAfter(dto.getToDate())) {
            throw new IllegalArgumentException(
                    "From date cannot be after To date");
        }

        leave.setLeaveType(dto.getLeaveType());
        leave.setFromDate(dto.getFromDate());
        leave.setToDate(dto.getToDate());
        leave.setReason(dto.getReason());

        return leaveRepository.save(leave);
    }


    public void deleteLeave(Long id, User user) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave request not found"));

        // Check whether leave belongs to logged-in employee
        if (!leave.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You cannot delete another employee's leave");
        }

        // Only PENDING leave can be deleted
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave can be deleted");
        }

        leaveRepository.delete(leave);
    }

    // ADMIN - Get All Employee Leaves
    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }



    // ADMIN - Approve or Reject Leave
    public LeaveRequest updateLeaveStatus(
            Long id, LeaveStatus newStatus) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave not found"));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave can be approved or rejected");
        }

        if (newStatus != LeaveStatus.APPROVED &&
                newStatus != LeaveStatus.REJECTED) {
            throw new IllegalArgumentException(
                    "Invalid leave status");
        }

        leave.setStatus(newStatus);

        return leaveRepository.save(leave);
    }
    // ADMIN - Dashboard Statistics
    public Map<String, Long> getDashboardStats() {

        return Map.of(
                "totalEmployees",
                userRepository.countByRole(Role.EMPLOYEE),

                "totalLeaves",
                leaveRepository.count(),

                "pendingLeaves",
                leaveRepository.countByStatus(LeaveStatus.PENDING),

                "approvedLeaves",
                leaveRepository.countByStatus(LeaveStatus.APPROVED),

                "rejectedLeaves",
                leaveRepository.countByStatus(LeaveStatus.REJECTED)
        );
    }
}
