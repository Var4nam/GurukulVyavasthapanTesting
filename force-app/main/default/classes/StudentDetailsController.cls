public without sharing class StudentDetailsController {

    @AuraEnabled
    public static String decryptedData(String studentId){
        Blob iv = Blob.valueOf('Example of IV123');
        blob key = EncodingUtil.base64Decode('dkreh4/IszOt8EpHR+01NNvRT7qSIvqZKWN9Gp6ZdL0=');
        String decryptedString;
        if(studentId != null) {
            Blob decryptedData = EncodingUtil.base64Decode(studentId);
            Blob decrypted2 = Crypto.decrypt('AES256', key, iv, decryptedData);
        	decryptedString = decrypted2.toString();
        }
        return decryptedString;
    }
    
    @AuraEnabled(cacheable=true)
    public static String getStudentRecord(String studentId){
        List<Student__c> existingRecords = new List<Student__c>();
        if(studentId != null) {
            existingRecords = [
                SELECT Id, Name 
                FROM Student__c
                WHERE Id =: studentId LIMIT 1
            ];
        }
        if (existingRecords.isEmpty()) {
            return null;
        } else {
            return existingRecords[0].Name;
        }
    }
}