public class PaperTriggerHandler {

    public static void countOutofAndUpdateExam(List<Paper__c> paperList) {
        Map<Id, Decimal> mapOfAssignClassIdAndTotalOutof = new Map<Id, Decimal>();
        Map<Id, Decimal> mapOfAssignClassIdAndOutof = new Map<Id, Decimal>();
        List<Exam__c> listToUpdateExam = new List<Exam__c>();
        for(Paper__c pr : paperList) {
            if(pr.Assign_Class__c != null && pr.Out_of__c != null) {
                mapOfAssignClassIdAndOutof.put(pr.Assign_Class__c, pr.Out_of__c);
            }
        }
        if(!mapOfAssignClassIdAndOutof.isEmpty()) {
            for(AggregateResult ar : [SELECT SUM(Out_of__c) totalOutof, Assign_Class__c FROM Paper__c WHERE Assign_Class__c IN: mapOfAssignClassIdAndOutof.keySet() GROUP by Assign_Class__c]) {
                System.debug('ar ::: '+ar);
                Id assignClassId = (Id)ar.get('Assign_Class__c');
                Decimal totalSum = (Decimal)ar.get('totalOutof');
                System.debug('totalSum ::: '+totalSum);
                mapOfAssignClassIdAndTotalOutof.put(assignClassId, totalSum);
            }
        }
        System.debug('mapOfAssignClassIdAndTotalOutof :::: '+mapOfAssignClassIdAndTotalOutof);
        for(Exam__c exm : [SELECT Id, Total_Outof_Marks__c, Assign_Class__c FROM Exam__c WHERE Assign_Class__c IN: mapOfAssignClassIdAndTotalOutof.keySet()]) {
            System.debug('exm ::: '+exm);
            listToUpdateExam.add(new Exam__c(Id = exm.Id, Total_Outof_Marks__c = mapOfAssignClassIdAndTotalOutof.get(exm.Assign_Class__c)));
        }
        System.debug('listToUpdateExam ::: '+listToUpdateExam);
        if(!listToUpdateExam.isEmpty()) {
            update listToUpdateExam;
        }
    }
}