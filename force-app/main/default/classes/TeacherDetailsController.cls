public without sharing class TeacherDetailsController {

    @AuraEnabled
    public static String decryptedData(String teacherId){
        Blob iv = Blob.valueOf('Example of IV123');
        blob key = EncodingUtil.base64Decode('dkreh4/IszOt8EpHR+01NNvRT7qSIvqZKWN9Gp6ZdL0=');
        String decryptedString;
        if(teacherId != '') {
            Blob decryptedData = EncodingUtil.base64Decode(teacherId);
            Blob decrypted2 = Crypto.decrypt('AES256', key, iv, decryptedData);
            decryptedString = decrypted2.toString();
        }
        
        return decryptedString;
    }
    
    @AuraEnabled(cacheable=true)
    public static String getTeacherRecord(String teacherId){
        List<Teacher__c> existingRecords = [
            SELECT Id, Name 
            FROM Teacher__c
            WHERE Id =: teacherId LIMIT 1
        ];
        
        if (existingRecords.isEmpty()) {
            return null;
        } else {
            return existingRecords[0].Name;
        }
    }
}