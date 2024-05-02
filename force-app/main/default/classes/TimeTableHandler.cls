public class TimeTableHandler {
    public static void handleInsertOrUpdate(List<TimeTable__c> timeTableList) {
        List<Assign_Classes__c> assignClassListToUpdate = new List<Assign_Classes__c>();
        for (TimeTable__c timeTable : timeTableList) {
            Assign_Classes__c assignClass = [SELECT Id, Name, Class__c, Subject__c, Teacher__c FROM Assign_Classes__c WHERE class__c =: timeTable.Class__c AND Subject__c =: timeTable.Subject__c AND Teacher__c =: timeTable.Teacher__c];
            if (assignClass == null) {
                assignClass = new Assign_Classes__c();
                assignClass.Class__c = timeTable.Class__c;
                assignClass.Subject__c = timeTable.Subject__c;
                assignClass.Teacher__c = timeTable.Teacher__c;
                assignClassListToUpdate.add(assignClass);
            } else {
                assignClass.Class__c = timeTable.Class__c;
                assignClass.Subject__c = timeTable.Subject__c;
                assignClass.Teacher__c = timeTable.Teacher__c;
                assignClassListToUpdate.add(assignClass);
            }
        }
        if (!assignClassListToUpdate.isEmpty()) {
            update assignClassListToUpdate;
        }
    }

    public static void handleDelete(List<TimeTable__c> deletedTimeTableList) {
        List<Assign_Classes__c> assignClassListToDelete = new List<Assign_Classes__c>();
        for (TimeTable__c deletedTimeTable : deletedTimeTableList) {
            Assign_Classes__c assignClass = [SELECT Id FROM Assign_Classes__c WHERE Class__c =: deletedTimeTable.Class__c AND Subject__c =: deletedTimeTable.Subject__c AND Teacher__c =: deletedTimeTable.Teacher__c];
            if (assignClass != null) {
                assignClassListToDelete.add(assignClass);
            }
        }
        if (!assignClassListToDelete.isEmpty()) {
            delete assignClassListToDelete;
        }
    }
}