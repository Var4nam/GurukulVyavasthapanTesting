/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-29-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class AssignClassImportController {

    @AuraEnabled
    public static List<Assign_Classes__c> saveFile(String base64Data) {
        try{
            List<Assign_Classes__c> lstCCToInsert = new List<Assign_Classes__c>();
            list<String> lstCSVLines = base64Data.substringAfter('\n').split('\n');
            
            for(Integer i = 0; i < lstCSVLines.size(); i++) {
                Assign_Classes__c assignCls = new Assign_Classes__c();
                
                if (!String.isBlank(lstCSVLines[i])) {
                    List<String> csvRowData = lstCSVLines[i].split(',');
                    
                    String className = csvRowData.size() > 0 ? csvRowData[0].trim() : ' ';
                    Id classId = getClassIdByName(className);
                    if (classId != null) {
                        assignCls.Class__c = classId;
                    } else {
                        continue;
                    }
                    
                    String subjectName = csvRowData.size() > 1 ? csvRowData[1] : ' ';
                    Id subjectId = getSubjectIdByName(subjectName);
                    if (subjectId != null) {
                        assignCls.Subject__c = subjectId;
                    } else {
                        continue;
                    }
                    
                    String teacherName = csvRowData.size() > 2 ? csvRowData[2].trim() : ' ';
                    Id teacherId = getTeacherIdByName(teacherName);
                    if (teacherId != null) {
                        assignCls.Teacher__c = teacherId;
                    } 
                    else {
                        continue;
                    }
                    
                    lstCCToInsert.add(assignCls);
                    System.debug('asdfghjk'+lstCCToInsert);
                }
            }
            try {
                if(!lstCCToInsert.isEmpty()) {
                    insert lstCCToInsert;
                    return lstCCToInsert;
                } else {
                    return null;
                }    
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
    public static Id getClassIdByName(String className) {
        try {
            List<Class__c> classes = [SELECT Id , Name FROM Class__c WHERE Name = :className WITH SECURITY_ENFORCED];
            if (!classes.isEmpty()) {
                return classes[0].Id;
            }
            else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
    
    @AuraEnabled
    public static Id getSubjectIdByName(String subjectName) {
        try {
            Subject__c subjects = [SELECT Id, Name FROM Subject__c WHERE Name =: subjectName WITH SECURITY_ENFORCED LIMIT 1];
            if (subjects != null) {
                return subjects.Id;
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
    
    @AuraEnabled
    public static Id getTeacherIdByName(String teacherName) {
        try {
            Teacher__c teacher = [SELECT Id FROM Teacher__c WHERE Name =: teacherName WITH SECURITY_ENFORCED LIMIT 1];
            if (teacher != null) {
                return teacher.Id;
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        } 
    }

    @AuraEnabled
    public static void saveRecords(String recordsToUpdate) {
        try {
             List<Assign_Classes__c> lstAsgClass = new  List<Assign_Classes__c>();
             List<AssignObjWrp> lstAssignObjWrp = new List<AssignObjWrp>();
             
            if(String.isNotBlank(recordsToUpdate)) {
                lstAssignObjWrp = (List<AssignObjWrp>)JSON.deserialize(JSON.serialize(recordsToUpdate), AssignObjWrp.class);
                for(AssignObjWrp AssignWrp : lstAssignObjWrp) {
                    Assign_Classes__c objAsg = new Assign_Classes__c();
                    if(String.isNotBlank(AssignWrp.classVal)) {
                        objAsg.Class__c = AssignWrp.classVal;
                    }
                    if(String.isNotBlank(AssignWrp.subject)) {
                        objAsg.Subject__c = AssignWrp.subject;
                    }
                    if(String.isNotBlank(AssignWrp.teacher)) {
                        objAsg.Teacher__c = AssignWrp.teacher;
                    }
                    if(String.isNotBlank(AssignWrp.Id)) {
                        objAsg.Id = AssignWrp.Id;
                    }
                    lstAsgClass.add(objAsg);
                }
            }
            
            if(!lstAsgClass.isEmpty()) {
                database.update(lstAsgClass, false);
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class AssignObjWrp{
        @AuraEnabled public string classVal;
        @AuraEnabled public string subject;
        @AuraEnabled public string teacher;
        @AuraEnabled public string Id;
    }
}