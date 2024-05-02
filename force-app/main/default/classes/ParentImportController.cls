public class ParentImportController {
    @AuraEnabled
    public static List<Parent_Guardian__c> saveFile(String base64Data) {
        try{
            List<Parent_Guardian__c> lstCCToInsert = new List<Parent_Guardian__c>();
            list<String> lstCSVLines = base64Data.substringAfter('\n').split('\n');
            
            for(Integer i = 0; i < lstCSVLines.size(); i++) {
                Parent_Guardian__c prt = new Parent_Guardian__c();
                
                if (!String.isBlank(lstCSVLines[i])) {
                    List<String> csvRowData = lstCSVLines[i].split(',');
                    prt.Name = csvRowData.size() > 0 ? csvRowData[0] : ' ';
                    prt.Contact_Information__c = csvRowData.size() > 1 ? csvRowData[1] : ' ';
                    prt.Relationship_to_Student__c = csvRowData.size() > 2 ? csvRowData[2] : ' ';
                    String studentName = csvRowData.size() > 3 ? csvRowData[3].trim() : ' ';
                    Id studentId = getStudentIdByName(studentName);
                    if (studentId != null) {
                        prt.student__c = studentId;
                        System.debug('studentId....'+ studentId);
                    } 
                    
                    lstCCToInsert.add(prt);
                    System.debug('asdfghjk'+lstCCToInsert);
                }
            }
            try{
                insert lstCCToInsert;
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
    public static Id getStudentIdByName(String studentName) {
        System.debug(studentName);
        List<student__c> student = [SELECT Id FROM Student__c WHERE Name =: studentName LIMIT 1];
        System.debug('student--' + student);
        
        
        if (student.size() > 0) {
            return student[0].Id;
        } else {
            return null;
        }
    }	
}