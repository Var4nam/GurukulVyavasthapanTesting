public class JSONForMarksTriggerHandler {
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> createSubjectJson(List<Exam__c> exams){
		Set<Id> setOfExamId = new Set<Id>();
        Map<Id, List<Object>> mapOfStudentIdMarks = new Map<Id, List<Object>>();
        for(Exam__c exm : exams) {
            if(exm.Store_Student_Marks_Data__c != null) {
                setOfExamId.add(exm.Id);
            }
        }
        
        return null;
    }
}