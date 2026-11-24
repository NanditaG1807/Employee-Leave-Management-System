
package com.settribe.employee_leave.repository;

import com.settribe.employee_leave.entity.LeaveRequest;
import com.settribe.employee_leave.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository
        extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByUserId(Long userId);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    List<LeaveRequest> findByLeaveType(String leaveType);

    long countByStatus(LeaveStatus status);

    long countByUserId(Long userId);
}
