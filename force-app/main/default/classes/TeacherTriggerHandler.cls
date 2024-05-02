public class TeacherTriggerHandler {

    public static void createAttendanceForNewTeachers(List<Teacher__c> teacherList) {
        List<Attendance__c> attendanceListToInsert = new List<Attendance__c>();
        if(!teacherList.isEmpty()) {
            for(Teacher__c tea : teacherList) {
        		Id teacherRecordTypeId = Schema.SObjectType.Attendance__c.getRecordTypeInfosByName().get('Teacher').getRecordTypeId();
                attendanceListToInsert.add(new Attendance__c(Name = tea.Name, Teacher__c = tea.Id, RecordTypeId = teacherRecordTypeId));
            }
        }
        if(!attendanceListToInsert.isEmpty()) {
            insert attendanceListToInsert;
        }
    }
}