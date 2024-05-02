public class ForPreventDuplicacyOnAssignClassHandler {
    public static void PreventDuplicateRecords(List<Assign_Classes__c> newRecords) {
        Set<String> Teachers = new Set<String>();
        Set<String> classNames = new Set<String>();
        Set<String> subjects = new Set<String>();
        
        for (Assign_Classes__c obj : newRecords) {
            Teachers.add(obj.Teacher__c);
            if (obj.Class__c != null) {
                classNames.add(obj.Class__c);
            }
            subjects.add(obj.Subject__c);
        }
        
        List<Assign_Classes__c> existingRecords = [
            SELECT Class__c, Subject__c, Teacher__c
            FROM Assign_Classes__c
            WHERE (Teacher__c IN :Teachers) AND (Class__c IN :classNames) AND (Subject__c IN :subjects)
        ];
        
        Map<String, Set<String>> existingRecordsMap = new Map<String, Set<String>>();
        for (Assign_Classes__c existingRecord : existingRecords) {
            String key = existingRecord.Teacher__c + '_' + existingRecord.Class__c + '_' + existingRecord.Subject__c;
            if (!existingRecordsMap.containsKey(key)) {
                existingRecordsMap.put(key, new Set<String>());
            }
            existingRecordsMap.get(key).add(existingRecord.Id);
        }
        
        for (Assign_Classes__c obj : newRecords) {
            String key = obj.Teacher__c + '_' + obj.Class__c + '_' + obj.Subject__c;
            if (existingRecordsMap.containsKey(key) && existingRecordsMap.get(key).size() > 0) {
                obj.addError('A record with the same Name, Class, and Subject Code already exists.');
            }
        }
    }
    
    public static void PreventDuplicateRecords(Map<Id, Assign_Classes__c> newRecordsMap, Map<Id, Assign_Classes__c> oldRecordsMap) {
        List<Assign_Classes__c> newRecords = new List<Assign_Classes__c>(newRecordsMap.values());
        PreventDuplicateRecords(newRecords);
    }
}