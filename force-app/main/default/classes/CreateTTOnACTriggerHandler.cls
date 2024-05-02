public class CreateTTOnACTriggerHandler {
    public static void createOrUpdateAssignClassRecord(List<TimeTable__c> newList, Map<Id, TimeTable__c> oldMap) {
        List<Assign_Classes__c> acToInsert = new List<Assign_Classes__c>();
        List<Assign_Classes__c> acToUpdate = new List<Assign_Classes__c>();
        Map<Id, Assign_Classes__c> existingAcMap = new Map<Id, Assign_Classes__c>();
        
        if (oldMap != null) {
            List<Id> ttIds = new List<Id>(oldMap.keySet());
            for (Assign_Classes__c ac : [SELECT Id, TimeTable__c FROM Assign_Classes__c WHERE TimeTable__c IN :ttIds]) {
                existingAcMap.put(ac.TimeTable__c, ac);
            }
        }
        
        for (TimeTable__c ttRec : newList) {
            Assign_Classes__c acRec = existingAcMap.get(ttRec.Id);
            
            if (acRec == null) {
                acRec = new Assign_Classes__c();
                acRec.TimeTable__c = ttRec.Id;
                acToInsert.add(acRec);
            } else {
                acToUpdate.add(acRec);
            }
            
            acRec.Class__c = ttRec.Class__c;
            acRec.Subject__c = ttRec.Subject__c;
            acRec.Teacher__c = ttRec.Teacher__c;
        }
        
        if (!acToInsert.isEmpty()) {
            insert acToInsert;
        }
        if (!acToUpdate.isEmpty()) {
            update acToUpdate;
        }
    }
    public static void deleteRelatedAssignClassRecords(List<TimeTable__c> oldList) {
        List<Id> ttIds = new List<Id>();
        for (TimeTable__c tt : oldList) {
            ttIds.add(tt.Id);
        }
        
        List<Assign_Classes__c> relatedAssignClasses = [
            SELECT Id FROM Assign_Classes__c WHERE TimeTable__c IN :ttIds
        ];
        
        if (!relatedAssignClasses.isEmpty()) {
            delete relatedAssignClasses;
        }
    }
}