public with sharing class AttendanceMonthlyScheduler implements Schedulable {
    
    public void execute(SchedulableContext sc) {
        List<Attendance__c> attendanceListToInsert = new List<Attendance__c>();
        Id teacherRecordTypeId = Schema.SObjectType.Attendance__c.getRecordTypeInfosByName().get('Teacher').getRecordTypeId();
        Id studentRecordTypeId = Schema.SObjectType.Attendance__c.getRecordTypeInfosByName().get('Student').getRecordTypeId();
        Id staffRecordTypeId = Schema.SObjectType.Attendance__c.getRecordTypeInfosByName().get('staff').getRecordTypeId();
        List<Student__c> studentList = [SELECT Id, Class__c FROM Student__c WITH SECURITY_ENFORCED];
        if(!studentList.isEmpty()) {
            for(Student__c stu : studentList) {
                attendanceListToInsert.add(new Attendance__c(Student__c = stu.Id, Class__c = stu.Class__c, Date__c = System.today(), RecordTypeId = studentRecordTypeId));
            }
        }
        List<Teacher__c> teacherList = [SELECT Id FROM Teacher__c WITH SECURITY_ENFORCED];
        if(!teacherList.isEmpty()) {
            for(Teacher__c teach : teacherList) {
                attendanceListToInsert.add(new Attendance__c(Teacher__c = teach.Id, Date__c = System.today(), RecordTypeId = teacherRecordTypeId));
            }
        }
        List<Staff__c> staffList = [SELECT Id FROM Staff__c WITH SECURITY_ENFORCED];
        if(!teacherList.isEmpty()) {
            for(Staff__c staff : staffList) {
                attendanceListToInsert.add(new Attendance__c(Staff__c = staff.Id, Date__c = System.today(), RecordTypeId = staffRecordTypeId));
            }
        }
        if(Schema.sObjectType.Attendance__c.isCreateable()) {
            insert attendanceListToInsert;
        }
    }
}