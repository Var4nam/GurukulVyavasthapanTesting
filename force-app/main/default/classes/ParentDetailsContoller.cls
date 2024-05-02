public class ParentDetailsContoller {
    
    @AuraEnabled
    public static String decryptedData(String parentId){
        Blob iv = Blob.valueOf('Example of IV123');
        blob key = EncodingUtil.base64Decode('dkreh4/IszOt8EpHR+01NNvRT7qSIvqZKWN9Gp6ZdL0=');
        String decryptedString;
        
        Blob decryptedData = EncodingUtil.base64Decode(parentId);
        Blob decrypted2 = Crypto.decrypt('AES256', key, iv, decryptedData);
        decryptedString = decrypted2.toString();
        
        return decryptedString;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Parent_Guardian__c> getParentGuardianRecords(String parentId){
        return [
            SELECT Id, Name, Relationship_to_Student__c, Student__c, Contact_Information__c 
            FROM Parent_Guardian__c
            WHERE Id =: parentId
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static String getStudentRecord(String studentId){
        List<Student__c> existingRecords = [
            SELECT Id, Name 
            FROM Student__c
            WHERE Id =: studentId LIMIT 1
        ];
        
        if (existingRecords.isEmpty()) {
            return null;
        } else {
            return existingRecords[0].Name;
        }
    }
}