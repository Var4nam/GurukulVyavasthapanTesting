public with sharing class AttendanceSchedulerForTeacher implements Schedulable {
    public void execute(SchedulableContext sc) {
        Date dt = System.today();
        Integer month = dt.Month();
        Integer year = dt.Year();
        String currentMonthYear = 'month' +' '+'year';
        List<Attendance__c> attendanceListForTeachers = [SELECT Id, Sign_In_Time__c, Sign_Out_Time__c FROM Attendance__c WHERE RecordTypeID = '012DG000000oSyx' OR RecordTypeID = '012DG000000oT5yYAE' OR Name =: currentMonthYear WITH SECURITY_ENFORCED];
        if(!attendanceListForTeachers.isEmpty()) {
            for(Attendance__c att : attendanceListForTeachers) {
                att.Sign_In_Time__c = null;
                att.Sign_Out_Time__c = null;
            }
            if (Schema.sObjectType.Attendance__c.isUpdateable()) {
                update attendanceListForTeachers;
            }
        }
    }
}