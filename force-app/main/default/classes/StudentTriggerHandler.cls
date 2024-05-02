public class StudentTriggerHandler {

    public static void createAttendanceAndExamForNewStudents(List<Student__c> studentList) {
        
        List<Exam__c> examListToInsert = new List<Exam__c>();
        Set<Id> setOfClassId = new Set<Id>();
        Map<Id, Id> mapOfStudentAndClassId = new Map<Id, Id>();
        Map<Id, Id> mapOfClassAndAssignClassId = new Map<Id, Id>();
        Map<Id, Id> mapOfStudentAndAssignClassId = new Map<Id, Id>();
        Map<Id, List<Subject__c>> mapOfStudentIdAndSubjectList = new Map<Id, List<Subject__c>>(); 
        List<Attendance__c> attendanceListToInsert = new List<Attendance__c>();
        if(!studentList.isEmpty()) {
            for(Student__c stu : studentList) {
                if(stu.Class__c != null) {
                    mapOfStudentAndClassId.put(stu.Id, stu.Class__c);
                    if(stu.IsActive__c) {
                        Id studentRecordTypeId = Schema.SObjectType.Attendance__c.getRecordTypeInfosByName().get('Student').getRecordTypeId();
                    	attendanceListToInsert.add(new Attendance__c(Name = stu.Name, Student__c = stu.Id, Class__c = stu.Class__c, RecordTypeId = studentRecordTypeId));
                    }
                }
            }
        }
					
        			
        List<Subject__c> subjectList = [SELECT Id, Name, Class__c FROM Subject__c WHERE Class__c IN :mapOfStudentAndClassId.values()];
        
        for(Subject__c subject : subjectList) {
            Id classId = subject.Class__c;
            
            Id studentId = null;
            for (Id stuId : mapOfStudentAndClassId.keySet()) {
                if (mapOfStudentAndClassId.get(stuId) == classId) {
                    studentId = stuId;
                    break;
                }
            }
            
            if (!mapOfStudentIdAndSubjectList.containsKey(studentId)) {
                mapOfStudentIdAndSubjectList.put(studentId, new List<Subject__c>());
            }
            
            List<Subject__c> studentSubjects = mapOfStudentIdAndSubjectList.get(studentId);
            studentSubjects.add(subject);
            mapOfStudentIdAndSubjectList.put(studentId, studentSubjects);
        }

                    
        if(!mapOfStudentAndClassId.isEmpty()) {
        	List<Assign_Classes__c> assignClassList = [SELECT Id, Class__c FROM Assign_Classes__c WHERE Class__c IN: mapOfStudentAndClassId.values()];
            if(!assignClassList.isEmpty()){
                for(Assign_Classes__c ac : assignClassList) {
                    mapOfClassAndAssignClassId.put(ac.Class__c, ac.Id);
                }
            }
            if(!mapOfClassAndAssignClassId.isEmpty()) {
                for(Id ids : mapOfStudentAndClassId.keySet()) {
                    if(mapOfClassAndAssignClassId.containsKey(mapOfStudentAndClassId.get(ids))) {
                        mapOfStudentAndAssignClassId.put(ids, mapOfClassAndAssignClassId.get(mapOfStudentAndClassId.get(ids)));
                    }
                }
            }

            if(!mapOfStudentAndAssignClassId.isEmpty()) {
                for(Id ids : mapOfStudentAndAssignClassId.keySet()) {
                    //String key = '[{"key":\"'+ids+'\","value":';
                    //String ending = '}]';
                    List<String> listOfValues = new List<String>();
                    Exam__c exm = new Exam__c();
                    exm.Student__c = ids;	
                    exm.Name = 'exam';
                    exm.Assign_Class__c = mapOfStudentAndAssignClassId.get(ids);
                    
                    if (mapOfStudentIdAndSubjectList.containsKey(ids)) {
                        for (Subject__c subject : mapOfStudentIdAndSubjectList.get(ids)) {
                            String subjectJSON = '{"SUBJECTNAME":"' + subject.Name + '","STUDENTID": "'+ids+'","FIRSTTEST":"0","SECONDTEST":"0","THIRDTEST":"0","FORTHTEST":"0","FIFTHTEST":"0","HALF":"0","FINAL":"0","TOTALMARKS":"0","PERCENTAGE":"0%"}';
                            listOfValues.add(subjectJSON);
                        }
                        
                        String jsonValue = '[' + String.join(listOfValues, ',') + ']';
                        //String finalJson = '[{"key":"' + ids + '","value":' + jsonValue + '}]';
                    	exm.Store_Student_Marks_Data__c = jsonValue;
                        System.debug(' ---- > ' + jsonValue);
                    }
                    
                    examListToInsert.add(exm);
                }
                System.debug('examListToInsert :::: '+examListToInsert);
                if(!examListToInsert.isEmpty()) {
                    insert examListToInsert;
                } 
            } 
        }
        
        if(!attendanceListToInsert.isEmpty()) {
            insert attendanceListToInsert;
        }
    } 
    
    public static void createFeeForNewStudents(List<Student__c> studentList) {
        List<Fee_Management__c> feeListToInsert = new List<Fee_Management__c>();
        Map<Id, String> mapOfStudentIdAndName = new Map<Id, String>();
        for(Student__c stu : studentList) {
            if(stu.Class__c != null) {
                mapOfStudentIdAndName.put(stu.Id, stu.Name);
            }
        }
        if(!mapOfStudentIdAndName.isEmpty()) {
            for(Id ids : mapOfStudentIdAndName.keySet()) {
                Fee_Management__c fee = new Fee_Management__c();
                fee.Name = 'fee';
                fee.Student__c = ids;
                fee.Student_Name__c = mapOfStudentIdAndName.get(ids);
                feeListToInsert.add(fee);
            }
            if(!feeListToInsert.isEmpty()) {
                insert feeListToInsert;
            }
        }
    }
    
    public static void updateAttendanceAndExamForStudents(List<Student__c> studentList, Map<Id, Student__c> studentIdAndStudentMap) {
        List<Attendance__c> attendanceListToInsert = new List<Attendance__c>();
        if(!studentList.isEmpty()) {
            for(Student__c stu : studentList) {
                if(stu.Class__c != null && studentIdAndStudentMap.get(stu.Id).Class__c != null && stu.Class__c != studentIdAndStudentMap.get(stu.Id).Class__c != null) {
                	if(stu.IsActive__c) {
                        Id studentRecordTypeId = Schema.SObjectType.Attendance__c.getRecordTypeInfosByName().get('Student').getRecordTypeId();
                    	attendanceListToInsert.add(new Attendance__c(Name = stu.Name, Student__c = stu.Id, Class__c = stu.Class__c, RecordTypeId = studentRecordTypeId));
                    }
                }
            }
        }
        
        if(!attendanceListToInsert.isEmpty()) {
            insert attendanceListToInsert;
        }
    }
}