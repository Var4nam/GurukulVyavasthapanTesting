public without sharing class LeaveController {
    
    @AuraEnabled(cacheable=true)
    public static list<sObject> fetchLookupData(string searchKey , string sObjectApiName) {    
        List < sObject > returnList = new List < sObject > ();
        string sWildCardText = '%' + searchKey + '%';
        string sQuery = 'Select Id, Name From ' + sObjectApiName + ' Where Name Like : sWildCardText order by createdDate DESC LIMIT 5';
        for (sObject obj: database.query(sQuery)) {
            returnList.add(obj);
        }
        return returnList;
    }
    
    @AuraEnabled
    public static sObject fetchDefaultRecord(string recordId , string sObjectApiName) {
        string sRecId = recordId;    
        string sQuery = 'Select Id,Name From ' + sObjectApiName + ' Where Id = : sRecId LIMIT 1';
        for (sObject obj: database.query(sQuery)) {
            return obj;
        }
        return null;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<sObject> retriveSearchData(String ObjectName, String fieldName, String value, List<String> selectedRecId) {
        List<sObject> sObjectResultList = new List<sObject>();
        if(selectedRecId == null)
            selectedRecId = new List<String>();
        
        if(String.isNotEmpty(value)) {
            String query = 'Select '+fieldName+' FROM '+ObjectName+' WHERE Name LIKE \'%' + value.trim() + '%\' and ID NOT IN: selectedRecId order by createdDate DESC LIMIT 5';
            for(sObject so : Database.Query(query)) {
                sObjectResultList.add(so);
            }
        }
        return sObjectResultList;
    }
    
    @AuraEnabled
    public static void createLeaveRecords(Leave__c leaves) {
        System.debug('create leave :: '+leaves);
        if(leaves != null){
            Insert leaves;
        }        
    }
    
    @AuraEnabled(cacheable=true)
    public static LeaveWrapper fetchTotalLeave(String teacherId, String status) {
        LeaveWrapper resultWrapper = new LeaveWrapper();
        
        List<Teacher__c> admins = [
            SELECT Id, Name, Role__c
            FROM Teacher__c 
            WHERE Id = :teacherId 
            AND Role__c = 'System administrator'
            LIMIT 1
        ];
        
        if (admins.isEmpty()) {
            resultWrapper.role = '';
            resultWrapper.leaveRecordList = fetchLeaveRecords(teacherId, status);
        } else {
            resultWrapper.role = admins[0].Role__c;
            resultWrapper.leaveRecordList = fetchLeaveRecords(null, status);
        }
        
        return resultWrapper;
    }
    
    private static List<Leave__c> fetchLeaveRecords(String teacherId, String status) {
        if (teacherId != null) {
            return [
                SELECT Id, Name, From_date__c, To_date__c, Status__c, Leave_Days__c,
                To__c, To__r.Name
                FROM Leave__c
                WHERE Status__c = :status
            ];

        } else {
            return [
                SELECT Id, Name, From_date__c, To_date__c, Status__c, Leave_Days__c,
                To__c, To__r.Name
                FROM Leave__c
                WHERE Status__c = :status
            ];

        }
    }
    
    public class LeaveWrapper {
        @AuraEnabled
        public String role { get; set; }
        @AuraEnabled
        public List<Leave__c> leaveRecordList { get; set; }
    }
    
    @AuraEnabled
    public static void updateTotalLeave(String teacherId, String recordId, String statusValue) {
        try {
            Leave__c leaveObj = [
                SELECT Id, To__c, Status__c 
                FROM Leave__c 
                WHERE Id = :recordId 
                AND To__c = :teacherId 
                LIMIT 1
            ];
            
            if (leaveObj != null) {
                leaveObj.Status__c = statusValue;
                UPDATE leaveObj;
            }
        } catch (Exception e) {
            throw new AuraHandledException('An error occurred while updating the record: ' + e.getMessage());
        }
    }
}