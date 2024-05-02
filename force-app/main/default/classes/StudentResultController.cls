public class StudentResultController {
    public List<Subject> subjects { get; set; }
    public String schoolName { get; set; }
    public String schoolAddress { get; set; }
    public String schoolEmail { get; set; }
    public String schoolPhone { get; set; }
    public String studentName { get; set; }
    public String studentId{ get; set; }
    public String studentFatherName { get; set; }
    public string enrollNumber{ get; set; }
    public Decimal rollNumber{ get; set; }
    public string DOB{ get; set; }
    public String classSec{ get; set; }
    
    public StudentResultController() {
        
        
        Account acc = [SELECT Id, Website, Phone, BillingStreet, BillingCity, BillingState,
                       BillingPostalCode, BillingCountry, BillingStateCode, BillingCountryCode, BillingLatitude, 
                       BillingLongitude, BillingGeocodeAccuracy,  BillingAddress, Name 
                       FROM Account LIMIT 1];
        
        System.debug(acc);
        
        schoolAddress = acc.BillingAddress.getStreet() + ', ' + 
            acc.BillingAddress.getCity() + ', ' + 
            acc.BillingAddress.getState() + ', ' + 
            acc.BillingAddress.getPostalCode() + ', ' + 
            acc.BillingAddress.getCountry();
        
        System.debug(schoolAddress);
        
        schoolName = acc.Name;
        schoolEmail = acc.Website;
        schoolPhone = acc.Phone;
        
        Exam__c examObj  = [SELECT Id,Student__c, Store_Student_Marks_Data__c FROM Exam__c LIMIT 1];
        System.debug(examObj.Store_Student_Marks_Data__c);
        List<SubjectWrapper> subjectWrappers = (List<SubjectWrapper>) JSON.deserialize(examObj.Store_Student_Marks_Data__c, List<SubjectWrapper>.class);
        System.debug(subjectWrappers);
        studentId = examObj.Student__c ;
        if(studentId != ''){
            getStudentData(studentId);
        }
        subjects = new List<Subject>();
        
        for (SubjectWrapper wrapper : subjectWrappers) {
            subjects.add(new Subject(wrapper.SUBJECTNAME, wrapper.FIRSTTEST, wrapper.SECONDTEST, wrapper.THIRDTEST, wrapper.HALF, wrapper.FINALTEST));
        }
    }
    
    public void getStudentData(String stuId)
    {
        Student__c stuData =  [SELECT Id, Name, Roll_Number__c, Class__r.section__c , Father_Name__c, Enrollment_Number__c, Date_of_Birth__c FROM Student__c WHERE ID = :stuId];
        enrollNumber = stuData.Enrollment_Number__c;
        rollNumber = stuData.Roll_Number__c;
        DateTime dateTimeDOB = DateTime.newInstance(stuData.Date_of_Birth__c.year(), stuData.Date_of_Birth__c.month(), stuData.Date_of_Birth__c.day());
        DOB = dateTimeDOB.format('dd/MM/yyyy');
        studentFatherName = stuData.Father_Name__c;
        studentName = stuData.Name;
        classSec = stuData.Class__r.section__c;
    }    
    
    public class Subject {
        public String Name { get; set; }
        public String First_Test { get; set; }
        public String Second_Test { get; set; }
        public String Third_Test { get; set; }
        public String Half_Yearly { get; set; }
        public String Final_Test { get; set; }
        public String Total { get; set; }
        
        public Subject(String name, String th, String ss, String th_ss, String pr, String ft) {
            this.Name = name;
            this.First_Test = getFirstTestMarks(th);
            this.Second_Test = getFirstTestMarks(ss);
            this.Third_Test = getFirstTestMarks(th_ss);
            this.Half_Yearly = getFirstTestMarks(pr);
            this.Final_Test = getFirstTestMarks(ft);
        }
        
        private String getFirstTestMarks(String firstTestMarks){
            if(firstTestMarks != null && firstTestMarks.contains('/')){
                return firstTestMarks.split('/')[0].trim();
            }else{
                return firstTestMarks;
            }
        }
    }
    
    private class SubjectWrapper {
        public id STUDENTID { get; set; }
        public String FIRSTTEST { get; set; }
        public String SUBJECTNAME { get; set; }
        public String SECONDTEST { get; set; }
        public String THIRDTEST { get; set; }
        public String FORTHTEST { get; set; }
        public String FIFTHTEST { get; set; }
        public String HALF { get; set; }
        public String FINALTEST { get; set; }
        public String TOTALMARKS { get; set; }
        public String PERCENTAGE { get; set; }
    }
}