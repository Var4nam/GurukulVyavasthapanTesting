@isTest
private class AttendanceMonthlySchedulerTest {
/*
    @isTest
    static void testScheduler() {
        
        Account SchoolObj = DataFactory.createAccountRecord(true);
        Class__c classObj = DataFactory.createClassRecord(SchoolObj.Id, true);
        Student__c testStudent = DataFactory.createStudentRecord('Test Student',classObj.Id, SchoolObj.Id, true);
        Teacher__c testTeacher = DataFactory.createTeacherRecord(SchoolObj.Id, true);
        
        AttendanceMonthlyScheduler scheduler = new AttendanceMonthlyScheduler();
        Test.startTest();
        scheduler.execute(null);
        Test.stopTest();
       	
        List<Attendance__c> attendanceStudentList = [SELECT Id FROM Attendance__c WHERE Student__c = :testStudent.Id];
        List<Attendance__c> attendanceTeacherList = [SELECT Id FROM Attendance__c WHERE Teacher__c = :testTeacher.Id];
        Attendance__c testStudentAttendance = new Attendance__c(
            Name = 'Prem',
            Class__c = classObj.Id
        );
        Attendance__c testTeacherAttendance = new Attendance__c(
            Name = 'Teacher',
            Class__c = classObj.Id
        );
        System.assertEquals(2, attendanceStudentList.size(), 'Attendance record should be created');
        System.assertEquals(2, attendanceTeacherList.size(), 'Attendance record should be created');
    }
    */
}