global class ExamYearlyScheduler implements Schedulable {

    global void execute(SchedulableContext sc) {
        List<Exam__c> examListToInsert = new List<Exam__c>();
        Set<Id> setOfClassId = new Set<Id>();
        Map<Id, Id> mapOfStudentAndClassId = new Map<Id, Id>();
        Map<Id, Id> mapOfClassAndAssignClassId = new Map<Id, Id>();
        Map<Id, Id> mapOfStudentAndAssignClassId = new Map<Id, Id>();
        for(Student__c stu : [SELECT Id, Name, Class__c FROM Student__c]) {
            if(stu.Class__c != null) {
                mapOfStudentAndClassId.put(stu.Id, stu.Class__c);
            }
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
                    examListToInsert.add(new Exam__c(Assign_Class__c = mapOfStudentAndAssignClassId.get(ids), Student__c = ids, Name = 'exam'));
                }
                if(!examListToInsert.isEmpty()) {
                    insert examListToInsert;
                } 
            }   
        }
    }
}