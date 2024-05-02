public class StudentImportController {
    @AuraEnabled
    public static List<Student__c> saveFile(String base64Data) {
        try{
            List<Student__c> lstCCToInsert = new List<Student__c>();
            list<String> lstCSVLines = base64Data.substringAfter('\n').split('\n');

            for(Integer i = 0; i < lstCSVLines.size(); i++) {
                Student__c stu = new Student__c();

                if (!String.isBlank(lstCSVLines[i])) {
                    List<String> csvRowData = lstCSVLines[i].split(',');
                    stu.First_Name__c = csvRowData.size() > 0 ? csvRowData[0] : ' ';
                    stu.Last_Name__c = csvRowData.size() > 1 ? csvRowData[1] : ' ';
                    String Gender = csvRowData.size() > 2 ? csvRowData[2] : '';
                    Schema.DescribeFieldResult fieldResults = Student__c.Gender__c.getDescribe();
                    if (fieldResults.getType() == Schema.DisplayType.PICKLIST) {
                        List<Schema.PicklistEntry> picklistValues = fieldResults.getPicklistValues();
                        for(Schema.PicklistEntry plEntry : picklistValues) {
                            if(plEntry.getValue().equalsIgnoreCase(Gender)) {
                                system.debug('Gender>>'+ Gender);
                                stu.Blood_Group__c = Gender;
                                break;
                            }
                        }
                    }else {
                        System.debug('Gender not found for: ' + Gender);
                        continue;
                    }
                    stu.Contact_Information__c = csvRowData.size() > 3 ? csvRowData[3] : ' ';
                    stu.Date_of_Birth__c = Date.ValueOf(csvRowData.size() > 4 ? csvRowData[4] : ' '); 
                    String bloodGroup = csvRowData.size() > 5 ? csvRowData[5] : '';
                    Schema.DescribeFieldResult fieldResult = Student__c.Blood_Group__c.getDescribe();
                    if (fieldResult.getType() == Schema.DisplayType.PICKLIST) {
                        List<Schema.PicklistEntry> picklistValues = fieldResult.getPicklistValues();
                        for(Schema.PicklistEntry plEntry : picklistValues) {
                            if(plEntry.getValue().equalsIgnoreCase(bloodGroup)) {
                                system.debug('bloodGroup>>'+ bloodGroup);
                                stu.Blood_Group__c = bloodGroup;
                                break;
                            }
                        }
                    }else {
                        System.debug('bloodGroup not found for: ' + bloodGroup);
                        continue;
                    }
                    String schoolName = csvRowData.size() > 6 ? csvRowData[6] : ' '; 
                    Id schoolId = getSchoolIdByName(schoolName);
                    if (schoolId != null) {
                        stu.School__c = schoolId;
                        System.debug('schoolId....'+ schoolId);
                    } else {
                        System.debug('schoolName not found for: ' + schoolName);
                        continue;
                    }
                    stu.Enrollment_Date__c = Date.ValueOf(csvRowData.size() > 7 ? csvRowData[7] : ' ');
                    stu.Enrollment_Number__c = csvRowData.size() > 8 ? csvRowData[8] : ' '; 
                    stu.Roll_Number__c = Integer.ValueOf(csvRowData.size() > 9 ? csvRowData[9] : ' ');
                    String className = csvRowData.size() > 10 ? csvRowData[10] : ' '; 
                    Id classId = getClassIdByName(className);
                    if (classId != null) {
                        stu.Class__c = classId;
                        System.debug('classId....'+ classId);
                    } else {
                        System.debug('className not found for: ' + className);
                        continue;
                    }
                    String resultName = csvRowData.size() > 11 ? csvRowData[11] : ' '; 
                    Id resultId = getResultIdByName(resultName);
                    if (resultId != null) {
                        stu.Result__c = resultId;
                        System.debug('resultId....'+ resultId);
                    } else {
                        System.debug('resultName not found for: ' + resultName);
                        continue;
                    }
                    stu.Grade_Level__c = csvRowData.size() > 12 ? csvRowData[12] : ' ';
                    stu.Father_Name__c = csvRowData.size() > 13 ? csvRowData[13] : ' ';
                    stu.Mother_Name__c = csvRowData.size() > 14 ? csvRowData[14] : ' ';
                    stu.Parent_Contact_Information__c = csvRowData.size() > 15 ? csvRowData[15] : ' ';
                    stu.Guardian_Name__c = csvRowData.size() > 16 ? csvRowData[16] : ' ';
                    stu.Relationship__c = csvRowData.size() > 17 ? csvRowData[17] : ' ';
                    String sibling1Name = csvRowData.size() > 18 ? csvRowData[18] : ' '; 
                    if (String.isNotBlank(sibling1Name)) {
                        Id sibling1Id = getSibling1IdByName(sibling1Name);
                        if (sibling1Id != null) {
                            stu.Sibling1__c = sibling1Id;
                            System.debug('sibling1Id....'+ sibling1Id);
                        } else {
                            System.debug('sibling1Name not found for: ' + sibling1Name);
                            continue;
                        }
                    }
                    String sibling2Name = csvRowData.size() > 19 ? csvRowData[19] : ' '; 
                    if (String.isNotBlank(sibling2Name)) {
                        Id sibling2Id = getSibling2IdByName(sibling2Name);
                        if (sibling2Id != null) {
                            stu.Sibling2__c = sibling2Id;
                            System.debug('sibling2Id....'+ sibling2Id);
                        } else {
                            System.debug('sibling2Name not found for: ' + sibling2Name);
                            continue;
                        }
                    }
                    stu.Country__c = csvRowData.size() > 20 ? csvRowData[20] : ' ';
                    stu.State__c = csvRowData.size() > 21 ? csvRowData[21] : ' ';
                    stu.City__c = csvRowData.size() > 22 ? csvRowData[22] : ' ';
                    stu.Postal_code__c = Integer.valueOf(csvRowData.size() > 23 ? csvRowData[23] : ' ');
                    stu.Locality__c = csvRowData.size() > 24 ? csvRowData[24] : ' ';
                    stu.Address_line_1__c = csvRowData.size() > 25 ? csvRowData[25] : ' ';
                    stu.Address_line_2__c = csvRowData.size() > 26 ? csvRowData[26] : ' ';
                    String LandMark = csvRowData.size() > 27 ? csvRowData[27].trim() : ' ';
                    stu.Land_Mark__c = String.isNotBlank(LandMark) ? LandMark : ' ';
                    lstCCToInsert.add(stu);
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
    public static Id getClassIdByName(String className) {
        try {
            List<Class__c> classes = [SELECT Id FROM Class__c WHERE Name = :className LIMIT 1];

            if (!classes.isEmpty()) {
                return classes[0].Id;
            }
        } catch (Exception e) {
            System.debug('Error occurred while querying Result records: ' + e.getMessage());
        }

        return null;
    }
    @AuraEnabled
    public static Id getSibling1IdByName(String sibling1Name) {
        try {
            List<Student__c> sibling1 = [SELECT Id FROM Student__c WHERE Name = :sibling1Name LIMIT 1];

            if (!sibling1.isEmpty()) {
                return sibling1[0].Id;
            }
        } catch (Exception e) {
            System.debug('Error occurred while querying Result records: ' + e.getMessage());
        }

        return null;
    }
    @AuraEnabled
    public static Id getSibling2IdByName(String sibling2Name) {
        try {
            List<Student__c> sibling2 = [SELECT Id FROM Student__c WHERE Name = :sibling2Name LIMIT 1];

            if (!sibling2.isEmpty()) {
                return sibling2[0].Id;
            }
        } catch (Exception e) {
            System.debug('Error occurred while querying Result records: ' + e.getMessage());
        }

        return null;
    }
}