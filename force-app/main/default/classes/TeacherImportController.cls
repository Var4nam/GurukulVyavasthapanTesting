public with sharing class TeacherImportController {
    @AuraEnabled
    public static List<Teacher__c> saveFile(String base64Data) {
        try{
            List<Teacher__c> lstCCToInsert = new List<Teacher__c>();
            list<String> lstCSVLines = base64Data.substringAfter('\n').split('\n');
            system.debug('lstCSVLines '+lstCSVLines);
            for(Integer i = 0; i < lstCSVLines.size(); i++) {
                Teacher__c tea = new Teacher__c();
                
                if (!String.isBlank(lstCSVLines[i])) {
                    List<String> csvRowData = lstCSVLines[i].split(',');
                    tea.First_Name__c = csvRowData.size() > 0 ? csvRowData[0] : ' ';
                    tea.Last_Name__c = csvRowData.size() > 1 ? csvRowData[1] : ' ';
                    String Gender = csvRowData.size() > 2 ? csvRowData[2].trim() : '';
                    Schema.DescribeFieldResult fieldResults = Teacher__c.Gender__c.getDescribe();
                    if (fieldResults.getType() == Schema.DisplayType.PICKLIST) {
                        List<Schema.PicklistEntry> picklistValues = fieldResults.getPicklistValues();
                        for(Schema.PicklistEntry plEntry : picklistValues) {
                            if(plEntry.getValue().equalsIgnoreCase(Gender)) {
                                tea.Gender__c = Gender;
                                break;
                            }
                        }
                    }else {
                        System.debug('Gender not found for: ' + Gender);
                        continue;
                    }
                    tea.Contact_Information__c = csvRowData.size() > 3 ? csvRowData[3] : ' ';
                    tea.Specialization__c = csvRowData.size() > 4 ? csvRowData[4] : ' ';
                    String SchoolName = csvRowData.size() > 5 ? csvRowData[5] : ' ';
                    Id schoolId = getSchoolIdByName(SchoolName);
                    if (schoolId != null) {
                        tea.School__c = schoolId;
                        System.debug('schoolId....'+ schoolId);
                    } else {
                        System.debug('School ID not found for: ' + SchoolName);
                        continue;
                    }
                    tea.Enrollment_Number__c = csvRowData.size() > 6 ? csvRowData[6] : ' ';
                    String joiningDateStr = csvRowData.size() > 7 ? csvRowData[7].trim() : null;
                    if (String.isNotBlank(joiningDateStr)) {
                        tea.Joining_Date__c = Date.valueOf(joiningDateStr);
                    } else {
                        tea.Joining_Date__c = null;
                    }
                    
                    /*String ResultName = csvRowData.size() > 8 ? csvRowData[8].trim() : null; 
                    if (ResultName != null) {
                        Id resultId = getResultIdByName(ResultName);
                        if (resultId != null) {
                            tea.Result__c = resultId;
                            System.debug('resultId....'+ resultId);
                        } else {
                            System.debug('resultId not found for: ' + ResultName);
                            continue;
                        }
                    } else {
                        System.debug('Result name is empty or not provided.');
                        continue;
                    }*/
                    
                    
                    String AssignedClassName = csvRowData.size() > 9 ? csvRowData[9] : ' '; 
                    Id assignedClassId = getAssignedClassIdByName(AssignedClassName);
                    if (assignedClassId != null) {
                        tea.Assign_Class__c = assignedClassId;
                        System.debug('assignedClassId....'+ assignedClassId);
                    } else {
                        System.debug('assignedClassId not found for: ' + AssignedClassName);
                        continue;
                    }
                    tea.Father_Name__c = csvRowData.size() > 10 ? csvRowData[10] : ' ';
                    tea.Mother_Name__c = csvRowData.size() > 11 ? csvRowData[11] : ' ';
                    tea.Parent_Contact_Information__c = csvRowData.size() > 12 ? csvRowData[12] : ' ';
                    tea.Address1__c = csvRowData.size() > 13 ? csvRowData[13] : ' ';
                    tea.Address2__c = csvRowData.size() > 14 ? csvRowData[14] : ' ';
                    tea.Landmark__c = csvRowData.size() > 15 ? csvRowData[15] : ' ';
                    tea.Locality__c = csvRowData.size() > 16 ? csvRowData[16] : ' ';
                    tea.Country__c = csvRowData.size() > 17 ? csvRowData[17] : ' ';
                    tea.State__c = csvRowData.size() > 18 ? csvRowData[18] : ' ';
                    tea.City__c = csvRowData.size() > 19 ? csvRowData[19] : ' ';
                    String BloodGroup = csvRowData.size() > 20 ? csvRowData[20].trim() : '';
                    Schema.DescribeFieldResult fieldResult = Teacher__c.Blood_Group__c.getDescribe();
                    if (fieldResult.getType() == Schema.DisplayType.PICKLIST) {
                        List<Schema.PicklistEntry> picklistValues = fieldResult.getPicklistValues();
                        for(Schema.PicklistEntry plEntry : picklistValues) {
                            if(plEntry.getValue().equalsIgnoreCase(BloodGroup)) {
                                tea.Blood_Group__c = BloodGroup;
                                break;
                            }
                        }
                    }else {
                        System.debug('BloodGroup not found for: ' + BloodGroup);
                        continue;
                    }
                    String PostalCodeStr = csvRowData.size() > 21 ? csvRowData[21].trim() : ' ';
                    tea.Postal_Code__c = String.isNotBlank(postalCodeStr) ? Integer.valueOf(postalCodeStr) : 0;
                    
                    String Role = csvRowData.size() > 22 ? csvRowData[22].trim() : '';
                    Schema.DescribeFieldResult fieldRes = Teacher__c.Role__c.getDescribe();
                    if (fieldResults.getType() == Schema.DisplayType.PICKLIST) {
                        List<Schema.PicklistEntry> picklistValues = fieldResults.getPicklistValues();
                        for(Schema.PicklistEntry plEntry : picklistValues) {
                            if(plEntry.getValue().equalsIgnoreCase(Role)) {
                                tea.Role__c = Role;
                                break;
                            }
                        }
                    }else {
                        System.debug('Role not found for: ' + Role);
                        continue;
                    }
                    tea.Email__c = csvRowData.size() > 23 ? csvRowData[23] : ' ';
                    
                }
                lstCCToInsert.add(tea);
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
    public static Id getSchoolIdByName(String schoolName) {
        try {
            List<Account> schools = [SELECT Id FROM Account WHERE Name = :schoolName LIMIT 1];
            
            if (!schools.isEmpty()) {
                return schools[0].Id;
            }
            
        } catch (Exception e) {
            System.debug('Error occurred while querying School records: ' + e.getMessage());
        }
        
        return null;
    }
    
    @AuraEnabled
    public static Id getResultIdByName(String resultName) {
        try {
            List<Result__c> results = [SELECT Id FROM Result__c WHERE Name = :resultName LIMIT 1];
            
            if (!results.isEmpty()) {
                return results[0].Id;
            }
        } catch (Exception e) {
            System.debug('Error occurred while querying Result records: ' + e.getMessage());
        }
        
        return null;
    }
    
    @AuraEnabled
    public static Id getAssignedClassIdByName(String assignedClassName) {
        try {
            List<Assign_Classes__c> assignedClasses = [SELECT Id, class__r.Name FROM Assign_Classes__c WHERE class__r.Name = :assignedClassName LIMIT 1];
            
            if (!assignedClasses.isEmpty()) {
                return assignedClasses[0].Id;
            }
        } catch (Exception e) {
            System.debug('Error occurred while querying Assign Classes records: ' + e.getMessage());
        }
        
        return null;
    }
}