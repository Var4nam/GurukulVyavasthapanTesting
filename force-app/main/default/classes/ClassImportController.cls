public with sharing class ClassImportController {

    @AuraEnabled
    public static List<Class__c> saveFile(String base64Data) {
        try{
            List<Class__c> lstCCToInsert = new List<Class__c>();
            list<String> lstCSVLines = base64Data.substringAfter('\n').split('\n');
            
            for(Integer i = 0; i < lstCSVLines.size(); i++) {
                Class__c cls = new Class__c();
                
                if (!String.isBlank(lstCSVLines[i])) {
                    List<String> csvRowData = lstCSVLines[i].split(',');
                    cls.Name = csvRowData.size() > 0 ? csvRowData[0] : ' ';
                    cls.Room_Number__c = Integer.valueOf(csvRowData.size() > 1 ? csvRowData[1] : ' ');
                    cls.Section__c = csvRowData.size() > 2 ? csvRowData[2] : ' ';
                    String schoolName = csvRowData.size() > 3 ? csvRowData[3].trim() : ' ';
                    Id schoolId = getSchoolIdByName(schoolName);
                    if (schoolId != null) {
                        cls.School__c = schoolId;
                        System.debug('schoolId....'+ schoolId);
                    }
                    
                    lstCCToInsert.add(cls);
                    System.debug('asdfghjk'+lstCCToInsert);
                }
            }
            try{
                if(Schema.sObjectType.Class__c.isCreateable()) {
                    insert lstCCToInsert;
                }
                return lstCCToInsert;
            }
            catch(DmlException e) {
                throw new AuraHandledException('An error occurred while processing the file: ' + e.getMessage());
            }
        }   
        catch(DmlException e) {
            throw new AuraHandledException('An error occurred while processing the file: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static Id getSchoolIdByName(String schoolName) {
        Account account = [SELECT Id FROM Account WHERE Name =: schoolName WITH SECURITY_ENFORCED LIMIT 1];        
        if (account != null) {
            return account.Id;
        } else {
            return null;
        }
    }	
}