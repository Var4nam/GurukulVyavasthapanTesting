public class ForPreventDuplicacyOnSubjectHandler {
    /*public static void PreventDuplicateRecords(List<Subject__c> newRecords) {
        Set<String> names = new Set<String>();
        Set<String> classNames = new Set<String>();
        Set<String> subjectCodes = new Set<String>();

        for (Subject__c obj : newRecords) {
            names.add(obj.Name);
            if (obj.Class__c != null) {
                classNames.add(obj.Class__c);
            }
            subjectCodes.add(obj.Subject_Code__c);
        }

        List<Subject__c> existingRecords = [
            SELECT Id, Name, Class__c, Subject_Code__c
            FROM Subject__c
            WHERE (Name IN :names) AND (Class__c IN :classNames) AND (Subject_Code__c IN :subjectCodes)
        ];

        Map<String, Set<String>> existingRecordsMap = new Map<String, Set<String>>();
        for (Subject__c existingRecord : existingRecords) {
            String key = existingRecord.Name + '_' + existingRecord.Class__c + '_' + existingRecord.Subject_Code__c;
            if (!existingRecordsMap.containsKey(key)) {
                existingRecordsMap.put(key, new Set<String>());
            }
            existingRecordsMap.get(key).add(existingRecord.Id);
        }

        for (Subject__c obj : newRecords) {
            String key = obj.Name + '_' + obj.Class__c + '_' + obj.Subject_Code__c;
            if (existingRecordsMap.containsKey(key) && existingRecordsMap.get(key).size() > 0) {
                obj.addError('A record with the same Name, Class, and Subject Code already exists.');
            }
        }
    }

    public static void PreventDuplicateRecords(Map<Id, Subject__c> newRecordsMap, Map<Id, Subject__c> oldRecordsMap) {
        List<Subject__c> newRecords = new List<Subject__c>(newRecordsMap.values());
        PreventDuplicateRecords(newRecords);
    }*/
}