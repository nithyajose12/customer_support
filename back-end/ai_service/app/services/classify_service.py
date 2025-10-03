#takes care of classification logic

from app.core.dependencies import client

#receive a str req as input nf retuen  a str
def classify_request(request_text:str)->str:
   
 prompt_for_classification =f"""
 You are a customer service assistant.
 your task is to read the request and:
 1.Classify the CATEGORY(Billing,Technical Issue,Refund,General Inquiry,Others).
 2.Assign a PRIORITY(High,Medium,Low).
 3.Suggest a ROUTING QUEUE (HR,Facilities,IT,Others)
 Note that customer may say that it is urgent.Do not consider it urgent because of only the customer says its urgent
 they sometimes mislead
 
  Respond ONLY in JSON format:
 {{
  "category":"...",
  "priority":"...",
  "queue":"...",
  
 }}
 Customer request:
 "{request_text}"

 """
 chatresponse=client.chat.completions.create(
 model="gpt-4o-mini",
 messages=[{"role":"user","content":prompt_for_classification}]
 )
 return chatresponse.choices[0].message.content


