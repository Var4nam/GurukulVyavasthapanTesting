public class StaffDetailsController {

    @AuraEnabled
    public static String decryptedData(String staffId){
        Blob iv = Blob.valueOf('Example of IV123');
        blob key = EncodingUtil.base64Decode('dkreh4/IszOt8EpHR+01NNvRT7qSIvqZKWN9Gp6ZdL0=');
        String decryptedString;
        
        Blob decryptedData = EncodingUtil.base64Decode(staffId);
        Blob decrypted2 = Crypto.decrypt('AES256', key, iv, decryptedData);
        decryptedString = decrypted2.toString();
        
        return decryptedString;
    }
    
    @AuraEnabled(cacheable=true)
    public static String getStaffRecord(String staffId){
        List<Staff__c> existingRecords = [
            SELECT Id, Name 
            FROM Staff__c
            WHERE Id =: staffId LIMIT 1
        ];
        
        if (existingRecords.isEmpty()) {
            return null;
        } else {
            return existingRecords[0].Name;
        }
    }
}