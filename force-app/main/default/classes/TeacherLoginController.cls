public without sharing class TeacherLoginController {

    /*@AuraEnabled
    public static String validateLoginPage(String username, String password) {

        List<Teacher__c> teachers = [
            SELECT Id, User_Name__c, Password__c FROM Teacher__c 
            WHERE User_Name__c = :username
            AND Password__c = :password
            LIMIT 1
        ];

        List<Admin__c> admins = [
            SELECT Id, User_Name__c, Password__c FROM Admin__c 
            WHERE User_Name__c = :username
            AND Password__c = :password
            LIMIT 1
        ];

        Blob iv = Blob.valueOf('Example of IV123');
        system.debug(iv);
        blob key = EncodingUtil.base64Decode('dkreh4/IszOt8EpHR+01NNvRT7qSIvqZKWN9Gp6ZdL0=');
        //System.debug('encrypted key is login>>>> ' + EncodingUtil.base64Encode(key));
        Blob data;
        if(!teachers.isEmpty()) {
            data = Blob.valueOf(teachers[0].id);
        } else if(!admins.isEmpty()) {
            data = Blob.valueOf(admins[0].id);
        }
        Blob encrypted = Crypto.encrypt('AES256', key, iv, data);
        System.debug(EncodingUtil.base64Encode(encrypted));
        return EncodingUtil.base64Encode(encrypted);
    }

    @AuraEnabled
    public static String decryptedData(String teacherId){
        Blob iv = Blob.valueOf('Example of IV123');
        blob key = EncodingUtil.base64Decode('dkreh4/IszOt8EpHR+01NNvRT7qSIvqZKWN9Gp6ZdL0=');
        String decryptedString;
        
        Blob decryptedData = EncodingUtil.base64Decode(teacherId);
        Blob decrypted2 = Crypto.decrypt('AES256', key, iv, decryptedData);
        decryptedString = decrypted2.toString();
        
        return decryptedString;
    }

    @AuraEnabled(cacheable=true)
    public static String getRecord(String id){
        List<Teacher__c> teacherRecords = [
            SELECT Id, Name, Profile__c 
            FROM Teacher__c
            WHERE Id =: id LIMIT 1
        ];

        List<Admin__c> adminRecords = [
            SELECT Id, Name, Profile__c 
            FROM Admin__c
            WHERE Id =: id LIMIT 1
        ];
        
        if (!teacherRecords.isEmpty()) {
            return teacherRecords[0].Profile__c;
        } else if(!adminRecords.isEmpty()){
            return adminRecords[0].Profile__c;
        } else {
            return null;
        }
    }*/
}