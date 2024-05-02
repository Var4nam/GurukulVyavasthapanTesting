public class FeeReceiptController {
    
    public List<FeeWrapper> feeReceipts { get; set; }
    public String serialNumber { get; set; }
    public String month { get; set; }
    public Date feeDate { get; set; }
    public Decimal admissionFee { get; set; }
    public Decimal tutionFee { get; set; }
    public Decimal amountOf { get; set; }
    public String duration { get; set; }
    public String studentId { get; set; }
    public Decimal paidAmount { get; set; }
    public Decimal examinationFee { get; set; }
    public String dueDate { get; set; }
    public String feeType { get; set; }
    public Decimal dueAmount { get; set; }
    public String paymentStatus { get; set; }
    public String selectedMonthInWrapper { get; set; }
    
    
    public FeeReceiptController(){
        Date currentDate = System.today();
        selectedMonthInWrapper = String.valueOf(currentDate.month());
        System.debug('selectedMonthInWrapper:::>>>>'+selectedMonthInWrapper);
        
        Fee_Management__c feeManage = [SELECT Id, Student__c, Store_Fee_Details__c FROM Fee_Management__c LIMIT 1];
        List<FeeWrapper> feeWrappers = (List<FeeWrapper>) JSON.deserialize(feeManage.Store_Fee_Details__c, List<FeeWrapper>.class);
        System.debug(feeWrappers);
        
        for(FeeWrapper wrapper : feeWrappers) {
            Date myDate = wrapper.Dt;
            Integer month = myDate.month();
            if(month == Integer.valueOf(selectedMonthInWrapper)){
                serialNumber = wrapper.SN;
                feeDate = wrapper.Dt;
                admissionFee = wrapper.AdnFee;
                tutionFee = wrapper.tfee;
                amountOf = wrapper.Amt;
                duration = wrapper.duration;
                studentId = wrapper.StId;
                paidAmount = wrapper.PaidAmt;
                examinationFee = wrapper.ExnFee;
                dueDate = wrapper.DueDate;
                feeType = wrapper.FeeType;
                dueAmount = wrapper.DueAmt;
                paymentStatus = wrapper.PmtStatus;
                selectedMonthInWrapper = wrapper.month;
            }
        }
    }
    
    public String getStudentName(String stId){
        Student__c student = [SELECT Id, Name FROM Student__c WHERE ID =: stId];
        return student != null ? student.Name : '';
    }
    
    public String formatDate(Date inputDate){
        if(inputDate != null){
            System.debug('inputDate:::>>>>'+inputDate);
            return String.valueOf(inputDate.day()) + '/' + String.valueOf(inputDate.month() + 1) + '/' + String.valueOf(inputDate.year());
            
        }else{
            return '';
        }
    }
    
    private class FeeWrapper{
        public String StName { get; set; }
        public Id StId { get; set; }
        public Date Dt { get; set; }
        public Decimal AdnFee { get; set; }
        public String ExtActFee { get; set; }
        public Decimal tfee { get; set; }
        public Decimal Amt { get; set; }
        public String duration { get; set; }
        public Decimal PaidAmt { get; set; }
        public Decimal ExnFee { get; set; }
        public String DueDate { get; set; }
        public String FeeType { get; set; }
        public Decimal DueAmt { get; set; }
        public String PmtStatus { get; set; }
        public String SN { get; set; }
        public String Name { get; set; }
        public String month { get; set; }
    }
}