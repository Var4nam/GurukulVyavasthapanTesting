public class ForPreventDuplicacyOnClassHandler {
    public static void PreventDuplicateRecords(List<Class__c> newRecords) {
        Set<String> names = new Set<String>();
        Set<String> sectionNames = new Set<String>();
        Set<String> schoolNames = new Set<String>();

        for (Class__c obj : newRecords) {
            names.add(obj.Name);
            if (obj.Section__c != null) {
                sectionNames.add(obj.Section__c);
            }
            schoolNames.add(obj.School__c);
        }

        List<Class__c> existingRecords = [
            SELECT Id, Name, Section__c, School__c
            FROM Class__c
            WHERE (Name IN :names) AND (Section__c IN :sectionNames) AND (School__c IN :schoolNames)
        ];

        Map<String, Set<String>> existingRecordsMap = new Map<String, Set<String>>();
        for (Class__c existingRecord : existingRecords) {
            String key = existingRecord.Name + '_' + existingRecord.Section__c + '_' + existingRecord.School__c;
            if (!existingRecordsMap.containsKey(key)) {
                existingRecordsMap.put(key, new Set<String>());
            }
            existingRecordsMap.get(key).add(existingRecord.Id);
        }

        for (Class__c obj : newRecords) {
            String key = obj.Name + '_' + obj.Section__c + '_' + obj.School__c;
            if (existingRecordsMap.containsKey(key) && existingRecordsMap.get(key).size() > 0) {
                obj.addError('A record with the same Name, Section and School already exists.');
            }
        }
    }

    public static void PreventDuplicateRecords(Map<Id, Class__c> newRecordsMap, Map<Id, Class__c> oldRecordsMap) {
        List<Class__c> newRecords = new List<Class__c>(newRecordsMap.values());
        PreventDuplicateRecords(newRecords);
    }
}