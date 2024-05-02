public class SubjectImportController {
    @AuraEnabled
    public static List<Subject__c> saveFile(String base64Data) {
        List<Subject__c> subjectsToInsert = new List<Subject__c>();
        
        List<String> csvRows = base64Data.split('\n');
        //Map<String, Id> classNameToIdMap = new Map<String, Id>();
        
        //for (String row : csvRows) {
            //String[] fields = row.split(',');
            //if (fields.size() == 3 && fields[0] != 'Name') {
                //classNameToIdMap.put(fields[1], null);
            //}
        //}
        
        //for (Class__c cls : [SELECT Id, Name FROM Class__c WHERE Name IN :classNameToIdMap.keySet()]) {
            //classNameToIdMap.put(cls.Name, cls.Id);
        //}
        
        for (String row : csvRows) {
            String[] fields = row.split(',');
            if (fields.size() == 3 && fields[0] != 'Name') {
                String studentName = fields[0];
                //String className = fields[1];
                String subjectCode = fields[1];
                
                //if (classNameToIdMap.containsKey(className)) {
                    //Id classId = classNameToIdMap.get(className);
                    
                    Subject__c subject = new Subject__c(
                        Name = studentName,
                        //Class__c = classId,
                        Subject_Code__c = subjectCode
                    );
                    subjectsToInsert.add(subject);
                //}
            }
        }
        
        if (!subjectsToInsert.isEmpty()) {
            insert subjectsToInsert;
        }
        
        return subjectsToInsert;
    }
}