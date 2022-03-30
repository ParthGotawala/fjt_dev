�
ID:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Email Service\EmailModel.cs
	namespace 	
FJT
 
. 
ServiceUtility 
. 
Email_Service *
{ 
public		 

class		 

EmailModel		 
{

 
public 
string  
mailSendProviderType *
{+ ,
get- 0
;0 1
set2 5
;5 6
}7 8
public 
string 
From 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
To 
{ 
get 
; 
set  #
;# $
}% &
public 
string 
CC 
{ 
get 
; 
set  #
;# $
}% &
public 
string 
BCC 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 
Subject 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
Body 
{ 
get  
;  !
set" %
;% &
}' (
public 
List 
< 
string 
> 
Attachments '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} �
KD:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Email Service\EmailService.cs
	namespace 	
FJT
 
. 
ServiceUtility 
{ 
public 

class 
EmailService 
{ 
IModel 
channel 
= 
null 
; 
public 
static 
IConnection !

connection" ,
=- .
null/ 3
;3 4
string 
DirectivesTopic 
=   
ConfigurationManager! 5
.5 6
AppSettings6 A
[A B
$strB T
]T U
.U V
ToStringV ^
(^ _
)_ `
;` a
string 
rabbitMqURI 
=  
ConfigurationManager 1
.1 2
AppSettings2 =
[= >
$str> K
]K L
.L M
ToStringM U
(U V
)V W
;W X
public 
void !
commonSendEmailDetail )
() *

EmailModel* 4
	emailData5 >
)> ?
{ 	
ConnectionFactory 
factory %
=& '
new( +
ConnectionFactory, =
(= >
)> ?
;? @
factory 
. $
AutomaticRecoveryEnabled ,
=- .
true/ 3
;3 4
factory 
. 
Uri 
= 
new 
Uri !
(! "
rabbitMqURI" -
)- .
;. /
factory 
. 
UserName 
=  
ConfigurationManager 3
.3 4
AppSettings4 ?
[? @
$str@ R
]R S
;S T
factory 
. 
Password 
=  
ConfigurationManager 3
.3 4
AppSettings4 ?
[? @
$str@ R
]R S
;S T
factory 
. 
HostName 
=  
ConfigurationManager 3
.3 4
AppSettings4 ?
[? @
$str@ S
]S T
;T U
factory 
. 
VirtualHost 
=  ! 
ConfigurationManager" 6
.6 7
AppSettings7 B
[B C
$strC ]
]] ^
;^ _

connection   
=   
factory    
.    !
CreateConnection  ! 1
(  1 2
)  2 3
;  3 4
channel!! 
=!! 

connection!!  
.!!  !
CreateModel!!! ,
(!!, -
)!!- .
;!!. /
	emailData"" 
.""  
mailSendProviderType"" *
=""+ ,
$str""- 6
;""6 7
string## 
	jsonified## 
=## 
JsonConvert## *
.##* +
SerializeObject##+ :
(##: ;
	emailData##; D
)##D E
;##E F
var$$ 
body$$ 
=$$ 
Encoding$$ 
.$$  
UTF8$$  $
.$$$ %
GetBytes$$% -
($$- .
	jsonified$$. 7
)$$7 8
;$$8 9
var%% 

properties%% 
=%% 
channel%% $
.%%$ %!
CreateBasicProperties%%% :
(%%: ;
)%%; <
;%%< =
channel&& 
.&& 
BasicPublish&&  
(&&  !
string&&! '
.&&' (
Empty&&( -
,&&- .
DirectivesTopic&&/ >
,&&> ?

properties&&@ J
,&&J K
body&&L P
)&&P Q
;&&Q R
}'' 	
}(( 
})) �
MD:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Email Service\ResponseResult.cs
	namespace 	
FJT
 
. 
ServiceUtility 
. 
Email_Service *
{ 
public		 

class		 
ResponseResult		 
{

 
public 
string 
status 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
errors 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
userMessage !
{" #
get$ '
;' (
set) ,
;, -
}. /
} 
} ��
8D:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Program.cs
	namespace 	
FJT
 
. 
ServiceUtility 
{ 
class 	
Program
 
{ 
static 
string 
_adminEmailID #
=$ %#
WebConfigurationManager& =
.= >
AppSettings> I
[I J
$strJ X
]X Y
.Y Z
ToStringZ b
(b c
)c d
;d e
static 
bool 

isLocalEnv 
=  
bool! %
.% &
Parse& +
(+ ,#
WebConfigurationManager, C
.C D
AppSettingsD O
[O P
$strP d
]d e
.e f
ToStringf n
(n o
)o p
)p q
;q r
static 
int 
_sleepTimeInSec "
=# $
int% (
.( )
Parse) .
(. /#
WebConfigurationManager/ F
.F G
AppSettingsG R
[R S
$strS c
]c d
)d e
;e f
static 
int 
	_tryCount 
= 
int "
." #
Parse# (
(( )#
WebConfigurationManager) @
.@ A
AppSettingsA L
[L M
$strM W
]W X
)X Y
;Y Z
public 
static 
class 
Globals #
{ 	
public 
static 
string  
_systemDetails! /
=0 1#
WebConfigurationManager2 I
.I J
AppSettingsJ U
[U V
$strV e
]e f
.f g
ToStringg o
(o p
)p q
;q r
public 
static 
string  
_baseUrl! )
=* +#
WebConfigurationManager, C
.C D
AppSettingsD O
[O P
$strP \
]\ ]
.] ^
ToString^ f
(f g
)g h
;h i
public 
static 
string  
_apiUrl! (
=) *#
WebConfigurationManager+ B
.B C
AppSettingsC N
[N O
$strO W
]W X
.X Y
ToStringY a
(a b
)b c
;c d
public   
static   
string    
_reportingUrl  ! .
=  / 0#
WebConfigurationManager  1 H
.  H I
AppSettings  I T
[  T U
$str  U c
]  c d
.  d e
ToString  e m
(  m n
)  n o
;  o p
public!! 
static!! 
string!!  
_reportDesignerUrl!!! 3
=!!4 5#
WebConfigurationManager!!6 M
.!!M N
AppSettings!!N Y
[!!Y Z
$str!!Z m
]!!m n
.!!n o
ToString!!o w
(!!w x
)!!x y
;!!y z
public"" 
static"" 
string""  
_reportViewerUrl""! 1
=""2 3#
WebConfigurationManager""4 K
.""K L
AppSettings""L W
[""W X
$str""X i
]""i j
.""j k
ToString""k s
(""s t
)""t u
;""u v
public## 
static## 
string##  
_identityUrl##! -
=##. /#
WebConfigurationManager##0 G
.##G H
AppSettings##H S
[##S T
$str##T a
]##a b
.##b c
ToString##c k
(##k l
)##l m
;##m n
public$$ 
static$$ 
string$$  
_enterpriseUrl$$! /
=$$0 1#
WebConfigurationManager$$2 I
.$$I J
AppSettings$$J U
[$$U V
$str$$V k
]$$k l
.$$l m
ToString$$m u
($$u v
)$$v w
;$$w x
public%% 
static%% 
string%%  
_mySQLServiceName%%! 2
=%%3 4#
WebConfigurationManager%%5 L
.%%L M
AppSettings%%M X
[%%X Y
$str%%Y k
]%%k l
.%%l m
ToString%%m u
(%%u v
)%%v w
;%%w x
public&& 
static&& 
string&&   
_mySQLDevServiceName&&! 5
=&&6 7#
WebConfigurationManager&&8 O
.&&O P
AppSettings&&P [
[&&[ \
$str&&\ q
]&&q r
.&&r s
ToString&&s {
(&&{ |
)&&| }
;&&} ~
public'' 
static'' 
string''  
_mongoDBServiceName''! 4
=''5 6#
WebConfigurationManager''7 N
.''N O
AppSettings''O Z
[''Z [
$str''[ o
]''o p
.''p q
ToString''q y
(''y z
)''z {
;''{ |
public(( 
static(( 
string((   
_rabbitMQServiceName((! 5
=((6 7#
WebConfigurationManager((8 O
.((O P
AppSettings((P [
[(([ \
$str((\ q
]((q r
.((r s
ToString((s {
((({ |
)((| }
;((} ~
public)) 
static)) 
string))  %
_elasticSearchServiceName))! :
=)); <#
WebConfigurationManager))= T
.))T U
AppSettings))U `
[))` a
$str))a {
])){ |
.))| }
ToString	))} �
(
))� �
)
))� �
;
))� �
public** 
static** 
string**  "
_q2CPricingServiceName**! 7
=**8 9#
WebConfigurationManager**: Q
.**Q R
AppSettings**R ]
[**] ^
$str**^ u
]**u v
.**v w
ToString**w 
(	** �
)
**� �
;
**� �
public++ 
static++ 
string++   
_q2CEmailServiceName++! 5
=++6 7#
WebConfigurationManager++8 O
.++O P
AppSettings++P [
[++[ \
$str++\ q
]++q r
.++r s
ToString++s {
(++{ |
)++| }
;++} ~
public,, 
static,, 
string,,  '
_q2CSearchEngineServiceName,,! <
=,,= >#
WebConfigurationManager,,? V
.,,V W
AppSettings,,W b
[,,b c
$str,,c 
]	,, �
.
,,� �
ToString
,,� �
(
,,� �
)
,,� �
;
,,� �
public-- 
static-- 
string--   
_powerShellScriptExe--! 5
=--6 7#
WebConfigurationManager--8 O
.--O P
AppSettings--P [
[--[ \
$str--\ q
]--q r
.--r s
ToString--s {
(--{ |
)--| }
;--} ~
public.. 
static.. 
string..  %
_powerShellScriptFilePath..! :
=..; <#
WebConfigurationManager..= T
...T U
AppSettings..U `
[..` a
$str..a {
]..{ |
...| }
ToString	..} �
(
..� �
)
..� �
;
..� �
public00 
static00 
string00  
[00  !
]00! " 
_primaryServiceNames00# 7
=008 9
{00: ;
_mySQLServiceName00< M
,00M N 
_mySQLDevServiceName00O c
,00c d
_mongoDBServiceName00e x
,00x y!
_rabbitMQServiceName	00z �
,
00� �'
_elasticSearchServiceName
00� �
}
00� �
;
00� �
public11 
static11 
string11  
[11  !
]11! ""
_secondaryServiceNames11# 9
=11: ;
{11< ="
_q2CPricingServiceName11> T
,11T U 
_q2CEmailServiceName11V j
,11j k(
_q2CSearchEngineServiceName	11l �
}
11� �
;
11� �
public22 
static22 
bool22 
IsAPIProjectRunning22 2
,222 3
IsUIProjectRunning224 F
,22F G%
IsReportingProjectRunning22H a
,22a b+
IsReportDesignerProjectRunning	22c �
,
22� �*
IsReportViewerProjectRunning
22� �
,
22� �,
IsIdentityServerProjectRunning
22� �
,
22� �1
#IsEnterpriseSearchAPIProjectRunning
22� �
=
22� �
false
22� �
;
22� �
public33 
static33 
bool33 !
IsMySQLServiceRunning33 4
,334 5$
IsMySQLDevServiceRunning336 N
,33N O#
IsMongoDBServiceRunning33P g
,33g h%
IsRabbitMQServiceRunning	33i �
,
33� �%
IsElasticServiceRunning
33� �
=
33� �
false
33� �
;
33� �
public44 
static44 
bool44 ,
 IsEnterpriseSearchServiceRunning44 ?
,44? @!
IsEmailServiceRunning44A V
,44V W#
IsPricingServiceRunning44X o
=44p q
false44r w
;44w x
public55 
static55 
string55  
	_bodyText55! *
,55* +
_errorStackTrace55, <
=55= >
$str55? A
;55A B
}66 	
static77 
async77 
Task77 
Main77 
(77 
string77 %
[77% &
]77& '
args77( ,
)77, -
{88 	
if99 
(99 

isLocalEnv99 
)99 
{:: 
ServicePointManager;; #
.;;# $/
#ServerCertificateValidationCallback;;$ G
=;;H I
delegate;;J R
{;;S T
return;;U [
true;;\ `
;;;` a
};;b c
;;;c d
}<< 
try== 
{>> 
ifAA 
(AA 
GlobalsAA 
.AA  
_primaryServiceNamesAA 0
.AA0 1
LengthAA1 7
>AA8 9
$numAA: ;
)AA; <
{BB 
foreachCC 
(CC 
stringCC #
serviceCC$ +
inCC, .
GlobalsCC/ 6
.CC6 7 
_primaryServiceNamesCC7 K
)CCK L
{DD 
ifEE 
(EE 
!EE 
stringEE #
.EE# $
IsNullOrEmptyEE$ 1
(EE1 2
serviceEE2 9
)EE9 :
)EE: ;
CheckServiceStatusFF .
(FF. /
serviceFF/ 6
)FF6 7
;FF7 8
}GG 
}HH 
CheckAllAPIStatusJJ !
(JJ! "
)JJ" #
;JJ# $
ConsoleLL 
.LL 
	WriteLineLL !
(LL! "
$strLL" 8
)LL8 9
;LL9 :
}MM 
catchNN 
(NN 
	ExceptionNN 
exNN 
)NN  
{OO 
GlobalsPP 
.PP 
_errorStackTracePP (
+=PP) +
stringPP, 2
.PP2 3
FormatPP3 9
(PP9 :
$strPP: Q
,PPQ R
exPPS U
.PPU V
MessagePPV ]
,PP] ^
exPP_ a
.PPa b

StackTracePPb l
)PPl m
;PPm n
SaveErrorLogQQ 
(QQ 
exQQ 
)QQ  
;QQ  !
}RR 
finallySS 
{TT 
ifWW 
(WW 
GlobalsWW 
.WW "
_secondaryServiceNamesWW 2
.WW2 3
LengthWW3 9
>WW: ;
$numWW< =
)WW= >
{XX 
foreachYY 
(YY 
stringYY #
serviceYY$ +
inYY, .
GlobalsYY/ 6
.YY6 7"
_secondaryServiceNamesYY7 M
)YYM N
{ZZ 
if[[ 
([[ 
![[ 
string[[ #
.[[# $
IsNullOrEmpty[[$ 1
([[1 2
service[[2 9
)[[9 :
)[[: ;
CheckServiceStatus\\ .
(\\. /
service\\/ 6
)\\6 7
;\\7 8
}]] 
}^^ 
try__ 
{`` 
intaa 
countaa 
=aa 
$numaa  !
;aa! "
boolbb 
runningStatusbb &
=bb' (
Globalsbb) 0
.bb0 1
IsUIProjectRunningbb1 C
&&bbD F
GlobalsbbG N
.bbN O
IsAPIProjectRunningbbO b
&&bbc e
Globalscc 
.cc  %
IsReportingProjectRunningcc  9
&&cc: <
Globalscc= D
.ccD E*
IsReportDesignerProjectRunningccE c
&&ccd f
Globalsdd 
.dd  (
IsReportViewerProjectRunningdd  <
&&dd= ?
Globalsdd@ G
.ddG H*
IsIdentityServerProjectRunningddH f
&&ddg i
Globalsee 
.ee  /
#IsEnterpriseSearchAPIProjectRunningee  C
&&eeD F
GlobalseeG N
.eeN O!
IsMySQLServiceRunningeeO d
&&eee g
Globalsff 
.ff  $
IsMySQLDevServiceRunningff  8
&&ff9 ;
Globalsgg 
.gg  #
IsMongoDBServiceRunninggg  7
&&gg8 :
Globalsgg; B
.ggB C$
IsRabbitMQServiceRunningggC [
&&gg\ ^
Globalshh 
.hh  #
IsElasticServiceRunninghh  7
&&hh8 :
Globalshh; B
.hhB C!
IsEmailServiceRunninghhC X
&&hhY [
Globalsii 
.ii  #
IsPricingServiceRunningii  7
&&ii8 :
Globalsii; B
.iiB C,
 IsEnterpriseSearchServiceRunningiiC c
;iic d
ifjj 
(jj 
!jj 
runningStatusjj &
)jj& '
{kk 
tryll 
{mm 
StartAllApplicationnn /
(nn/ 0
)nn0 1
;nn1 2
ifoo 
(oo  
countoo  %
<=oo& (
	_tryCountoo) 2
)oo2 3
{pp 
Threadqq  &
.qq& '
Sleepqq' ,
(qq, -
_sleepTimeInSecqq- <
*qq= >
$numqq? C
)qqC D
;qqD E
countrr  %
++rr% '
;rr' (
CheckAllAPIStatusss  1
(ss1 2
)ss2 3
;ss3 4
}tt 
	EmailSentuu %
(uu% &
falseuu& +
,uu+ ,
stringuu- 3
.uu3 4
Emptyuu4 9
)uu9 :
;uu: ;
}vv 
catchww 
(ww 
	Exceptionww (
exww) +
)ww+ ,
{xx 
Globalsyy #
.yy# $
_errorStackTraceyy$ 4
+=yy5 7
stringyy8 >
.yy> ?
Formatyy? E
(yyE F
$stryyF ]
,yy] ^
exyy_ a
.yya b
Messageyyb i
,yyi j
exyyk m
.yym n

StackTraceyyn x
)yyx y
;yyy z
SaveErrorLogzz (
(zz( )
exzz) +
)zz+ ,
;zz, -
}{{ 
}|| 
}}} 
catch~~ 
(~~ 
	Exception~~  
ex~~! #
)~~# $
{ 
Globals
�� 
.
�� 
_errorStackTrace
�� ,
+=
��- /
string
��0 6
.
��6 7
Format
��7 =
(
��= >
$str
��> U
,
��U V
ex
��W Y
.
��Y Z
Message
��Z a
,
��a b
ex
��c e
.
��e f

StackTrace
��f p
)
��p q
;
��q r
SaveErrorLog
��  
(
��  !
ex
��! #
)
��# $
;
��$ %
}
�� 
}
�� 
}
�� 	
public
�� 
static
�� 
async
�� 
Task
��  
<
��  !
ResponseResult
��! /
>
��/ 0
checkAPIStatus
��1 ?
(
��? @
string
��@ F
url
��G J
,
��J K
string
��L R
APIPath
��S Z
)
��Z [
{
�� 	
Console
�� 
.
�� 
	WriteLine
�� 
(
�� 
$str
�� <
+
��= >
url
��? B
)
��B C
;
��C D
ResponseResult
�� 
resposeResult
�� (
=
��) *
new
��+ .
ResponseResult
��/ =
(
��= >
)
��> ?
{
��@ A
status
��B H
=
��I J
$str
��K S
}
��T U
;
��U V
try
�� 
{
�� 

HttpClient
�� 
client
�� !
=
��" #
new
��$ '

HttpClient
��( 2
(
��2 3
)
��3 4
;
��4 5
client
�� 
.
�� 
BaseAddress
�� "
=
��# $
new
��% (
Uri
��) ,
(
��, -
url
��- 0
)
��0 1
;
��1 2
var
�� 
responseTask
��  
=
��! "
client
��# )
.
��) *
GetAsync
��* 2
(
��2 3
APIPath
��3 :
)
��: ;
;
��; <
responseTask
�� 
.
�� 
Wait
�� !
(
��! "
)
��" #
;
��# $
var
�� 
result
�� 
=
�� 
responseTask
�� )
.
��) *
Result
��* 0
;
��0 1
if
�� 
(
�� 
result
�� 
.
�� !
IsSuccessStatusCode
�� .
)
��. /
{
�� 
resposeResult
�� !
=
��" #
new
��$ '
ResponseResult
��( 6
(
��6 7
)
��7 8
{
��9 :
status
��; A
=
��B C
$str
��D M
}
��N O
;
��O P
}
�� $
CheckApplicationStatus
�� &
(
��& '
url
��' *
,
��* +
resposeResult
��, 9
)
��9 :
;
��: ;
return
�� 
resposeResult
�� $
;
��$ %
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
Globals
�� 
.
�� 
_errorStackTrace
�� (
+=
��) +
string
��, 2
.
��2 3
Format
��3 9
(
��9 :
$str
��: Q
,
��Q R
ex
��S U
.
��U V
Message
��V ]
,
��] ^
ex
��_ a
.
��a b

StackTrace
��b l
)
��l m
;
��m n
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
return
�� 
resposeResult
�� $
;
��$ %
}
�� 
}
�� 	
public
�� 
static
�� 
void
�� $
CheckApplicationStatus
�� 1
(
��1 2
string
��2 8
url
��9 <
,
��< =
ResponseResult
��> L
resposneResult
��M [
)
��[ \
{
�� 	
if
�� 
(
�� 
url
�� 
==
�� 
Globals
�� 
.
�� 
_baseUrl
�� '
)
��' (
{
�� 
Globals
�� 
.
��  
IsUIProjectRunning
�� *
=
��+ ,!
SetAPIRunningStatus
��- @
(
��@ A
$str
��A I
,
��I J
resposneResult
��K Y
)
��Y Z
;
��Z [
}
�� 
else
�� 
if
�� 
(
�� 
url
�� 
==
�� 
Globals
�� #
.
��# $
_apiUrl
��$ +
)
��+ ,
{
�� 
Globals
�� 
.
�� !
IsAPIProjectRunning
�� +
=
��, -!
SetAPIRunningStatus
��. A
(
��A B
$str
��B K
,
��K L
resposneResult
��M [
)
��[ \
;
��\ ]
}
�� 
else
�� 
if
�� 
(
�� 
url
�� 
==
�� 
Globals
�� #
.
��# $
_reportingUrl
��$ 1
)
��1 2
{
�� 
Globals
�� 
.
�� '
IsReportingProjectRunning
�� 1
=
��2 3!
SetAPIRunningStatus
��4 G
(
��G H
$str
��H W
,
��W X
resposneResult
��Y g
)
��g h
;
��h i
}
�� 
else
�� 
if
�� 
(
�� 
url
�� 
==
�� 
Globals
�� #
.
��# $ 
_reportDesignerUrl
��$ 6
)
��6 7
{
�� 
Globals
�� 
.
�� ,
IsReportDesignerProjectRunning
�� 6
=
��7 8!
SetAPIRunningStatus
��9 L
(
��L M
$str
��M b
,
��b c
resposneResult
��d r
)
��r s
;
��s t
}
�� 
else
�� 
if
�� 
(
�� 
url
�� 
==
�� 
Globals
�� #
.
��# $
_reportViewerUrl
��$ 4
)
��4 5
{
�� 
Globals
�� 
.
�� *
IsReportViewerProjectRunning
�� 4
=
��5 6!
SetAPIRunningStatus
��7 J
(
��J K
$str
��K ^
,
��^ _
resposneResult
��` n
)
��n o
;
��o p
}
�� 
else
�� 
if
�� 
(
�� 
url
�� 
==
�� 
Globals
�� #
.
��# $
_identityUrl
��$ 0
)
��0 1
{
�� 
Globals
�� 
.
�� ,
IsIdentityServerProjectRunning
�� 6
=
��7 8!
SetAPIRunningStatus
��9 L
(
��L M
$str
��M b
,
��b c
resposneResult
��d r
)
��r s
;
��s t
}
�� 
else
�� 
if
�� 
(
�� 
url
�� 
==
�� 
Globals
�� #
.
��# $
_enterpriseUrl
��$ 2
)
��2 3
{
�� 
Globals
�� 
.
�� 1
#IsEnterpriseSearchAPIProjectRunning
�� ;
=
��< =!
SetAPIRunningStatus
��> Q
(
��Q R
$str
��R i
,
��i j
resposneResult
��k y
)
��y z
;
��z {
}
�� 
}
�� 	
public
�� 
static
�� 
bool
�� !
SetAPIRunningStatus
�� .
(
��. /
string
��/ 5
name
��6 :
,
��: ;
ResponseResult
��< J
resposneResult
��K Y
)
��Y Z
{
�� 	
if
�� 
(
�� 
resposneResult
�� 
!=
�� !
null
��" &
&&
��' )
resposneResult
��* 8
.
��8 9
status
��9 ?
!=
��@ B
null
��C G
&&
��H J
resposneResult
��K Y
.
��Y Z
status
��Z `
==
��a c
$str
��d m
)
��m n
{
�� 
Globals
�� 
.
�� 
	_bodyText
�� !
+=
��" $
SetBodyText
��% 0
(
��0 1
name
��1 5
,
��5 6
true
��7 ;
)
��; <
;
��< =
return
�� 
true
�� 
;
�� 
}
�� 
Globals
�� 
.
�� 
	_bodyText
�� 
+=
��  
SetBodyText
��! ,
(
��, -
name
��- 1
,
��1 2
false
��3 8
)
��8 9
;
��9 :
return
�� 
false
�� 
;
�� 
}
�� 	
public
�� 
static
�� 
string
�� 
SetBodyText
�� (
(
��( )
string
��) /
ProjectName
��0 ;
,
��; <
bool
��= A
RunningStatus
��B O
)
��O P
{
�� 	
if
�� 
(
�� 
!
�� 
string
�� 
.
�� 
IsNullOrEmpty
�� %
(
��% &
ProjectName
��& 1
)
��1 2
)
��2 3
{
�� 
string
�� 

statusText
�� !
=
��" #
RunningStatus
��$ 1
?
��2 3
$str
��4 8
:
��9 :
$str
��; A
;
��A B
string
�� 
statusColor
�� "
=
��# $
RunningStatus
��% 2
?
��3 4
$str
��5 >
:
��? @
$str
��A J
;
��J K
return
�� 
$str
�� 1
+
��1 2
statusColor
��3 >
.
��> ?
ToString
��? G
(
��G H
)
��H I
+
��J K
$str��L �
+��� �
ProjectName��� �
+��� �
$str��� �
+��� �

statusText��� �
+��� �
$str��� �
+��� �
DateTime��� �
.��� �
UtcNow��� �
.��� �
ToString��� �
(��� �
$str��� �
)��� �
+��� �
$str��� �
;��� �
}
�� 
return
�� 
$str
�� 
;
�� 
}
�� 	
public
�� 
static
�� 
void
�� !
StartAllApplication
�� .
(
��. /
)
��/ 0
{
�� 	
try
�� 
{
�� 
var
�� 
ps1File
�� 
=
�� 
Globals
�� %
.
��% &'
_powerShellScriptFilePath
��& ?
;
��? @
var
�� 
	startInfo
�� 
=
�� 
new
��  #
ProcessStartInfo
��$ 4
(
��4 5
)
��5 6
{
�� 
FileName
�� 
=
�� 
Globals
�� &
.
��& '"
_powerShellScriptExe
��' ;
,
��; <
	Arguments
�� 
=
�� 
$"
��  "
$str
��" S
{
��S T
ps1File
��T [
}
��[ \
$str
��\ ^
"
��^ _
,
��_ `
UseShellExecute
�� #
=
��$ %
false
��& +
}
�� 
;
�� 
Process
�� 
.
�� 
Start
�� 
(
�� 
	startInfo
�� '
)
��' (
;
��( )
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
Globals
�� 
.
�� 
_errorStackTrace
�� (
+=
��) +
string
��, 2
.
��2 3
Format
��3 9
(
��9 :
$str
��: Q
,
��Q R
ex
��S U
.
��U V
Message
��V ]
,
��] ^
ex
��_ a
.
��a b

StackTrace
��b l
)
��l m
;
��m n
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
async
�� 
void
��  
CheckAllAPIStatus
��! 2
(
��2 3
)
��3 4
{
��5 6
string
�� 

testUIPath
�� 
=
�� 
$str
��  "
;
��" #
var
�� &
checkUIProjectStatusTask
�� (
=
��) *
Task
��+ /
.
��/ 0
Factory
��0 7
.
��7 8
StartNew
��8 @
(
��@ A
(
��A B
)
��B C
=>
��D F
checkAPIStatus
��G U
(
��U V
Globals
��V ]
.
��] ^
_baseUrl
��^ f
,
��f g

testUIPath
��h r
)
��r s
)
��s t
;
��t u
string
�� 
testAPIPath
�� 
=
��  
$str
��! %
;
��% &
var
�� '
checkAPIProjectStatusTask
�� )
=
��* +
Task
��, 0
.
��0 1
Factory
��1 8
.
��8 9
StartNew
��9 A
(
��A B
(
��B C
)
��C D
=>
��E G
checkAPIStatus
��H V
(
��V W
Globals
��W ^
.
��^ _
_apiUrl
��_ f
,
��f g
testAPIPath
��h s
+
��t u
$str��v �
)��� �
)��� �
;��� �
string
�� 
testReportingPath
�� $
=
��% &
$str
��' /
;
��/ 0
var
�� -
checkReportingProjectStatusTask
�� /
=
��0 1
Task
��2 6
.
��6 7
Factory
��7 >
.
��> ?
StartNew
��? G
(
��G H
(
��H I
)
��I J
=>
��K M
checkAPIStatus
��N \
(
��\ ]
Globals
��] d
.
��d e
_reportingUrl
��e r
,
��r s 
testReportingPath��t �
)��� �
)��� �
;��� �
string
�� $
testReportDesignerPath
�� )
=
��* +
$str
��, H
;
��H I
var
�� 2
$checkReportDesignerProjectStatusTask
�� 4
=
��5 6
Task
��7 ;
.
��; <
Factory
��< C
.
��C D
StartNew
��D L
(
��L M
(
��M N
)
��N O
=>
��P R
checkAPIStatus
��S a
(
��a b
Globals
��b i
.
��i j 
_reportDesignerUrl
��j |
,
��| }%
testReportDesignerPath��~ �
)��� �
)��� �
;��� �
string
�� "
testReportViewerPath
�� '
=
��( )
$str
��* F
;
��F G
var
�� 0
"checkReportViewerProjectStatusTask
�� 2
=
��3 4
Task
��5 9
.
��9 :
Factory
��: A
.
��A B
StartNew
��B J
(
��J K
(
��K L
)
��L M
=>
��N P
checkAPIStatus
��Q _
(
��_ `
Globals
��` g
.
��g h
_reportViewerUrl
��h x
,
��x y#
testReportViewerPath��z �
)��� �
)��� �
;��� �
string
�� $
testIdentityServerPath
�� )
=
��* +
$str
��, N
;
��N O
var
�� 2
$checkIdentityServerProjectStatusTask
�� 4
=
��5 6
Task
��7 ;
.
��; <
Factory
��< C
.
��C D
StartNew
��D L
(
��L M
(
��M N
)
��N O
=>
��P R
checkAPIStatus
��S a
(
��a b
Globals
��b i
.
��i j
_identityUrl
��j v
,
��v w%
testIdentityServerPath��x �
)��� �
)��� �
;��� �
string
�� )
testEnterpriseSearchAPIPath
�� .
=
��/ 0
$str
��1 9
;
��9 :
var
�� 8
*checkEnterpriseServiceAPIProjectStatusTask
�� :
=
��; <
Task
��= A
.
��A B
Factory
��B I
.
��I J
StartNew
��J R
(
��R S
(
��S T
)
��T U
=>
��V X
checkAPIStatus
��Y g
(
��g h
Globals
��h o
.
��o p
_enterpriseUrl
��p ~
,
��~ +
testEnterpriseSearchAPIPath��� �
)��� �
)��� �
;��� �
await
�� 
Task
�� 
.
�� 
WhenAll
�� 
(
�� &
checkUIProjectStatusTask
�� 7
,
��7 8'
checkAPIProjectStatusTask
��9 R
,
��R S-
checkReportingProjectStatusTask
��T s
,
��s t2
$checkReportDesignerProjectStatusTask
�� 4
,
��4 50
"checkReportViewerProjectStatusTask
��6 X
,
��X Y2
$checkIdentityServerProjectStatusTask
��Z ~
,
��~ 8
*checkEnterpriseServiceAPIProjectStatusTask
�� :
)
��: ;
;
��; <
}
�� 	
public
�� 
static
�� 
void
��  
CheckServiceStatus
�� -
(
��- .
string
��. 4
name
��5 9
)
��9 :
{
�� 	
Console
�� 
.
�� 
	WriteLine
�� 
(
�� 
$str
�� @
+
��A B
name
��C G
)
��G H
;
��H I
ServiceController
�� 
sc
��  
=
��! "
new
��# &
ServiceController
��' 8
(
��8 9
name
��9 =
)
��= >
;
��> ?
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� 
.
��  
_mySQLServiceName
��  1
)
��1 2
{
�� 
Globals
�� 
.
�� #
IsMySQLServiceRunning
�� -
=
��. /
SetRunningStatus
��0 @
(
��@ A
sc
��A C
,
��C D
name
��E I
)
��I J
;
��J K
}
�� 
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� 
.
��  "
_mySQLDevServiceName
��  4
)
��4 5
{
�� 
Globals
�� 
.
�� &
IsMySQLDevServiceRunning
�� 0
=
��1 2
SetRunningStatus
��3 C
(
��C D
sc
��D F
,
��F G
name
��H L
)
��L M
;
��M N
}
�� 
else
�� 
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� $
.
��$ %!
_mongoDBServiceName
��% 8
)
��8 9
{
�� 
Globals
�� 
.
�� %
IsMongoDBServiceRunning
�� /
=
��0 1
SetRunningStatus
��2 B
(
��B C
sc
��C E
,
��E F
name
��G K
)
��K L
;
��L M
}
�� 
else
�� 
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� $
.
��$ %"
_rabbitMQServiceName
��% 9
)
��9 :
{
�� 
Globals
�� 
.
�� &
IsRabbitMQServiceRunning
�� 0
=
��1 2
SetRunningStatus
��3 C
(
��C D
sc
��D F
,
��F G
name
��H L
)
��L M
;
��M N
}
�� 
else
�� 
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� $
.
��$ %'
_elasticSearchServiceName
��% >
)
��> ?
{
�� 
Globals
�� 
.
�� %
IsElasticServiceRunning
�� /
=
��0 1
SetRunningStatus
��2 B
(
��B C
sc
��C E
,
��E F
name
��G K
)
��K L
;
��L M
}
�� 
else
�� 
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� $
.
��$ %$
_q2CPricingServiceName
��% ;
)
��; <
{
�� 
Globals
�� 
.
�� %
IsPricingServiceRunning
�� /
=
��0 1
SetRunningStatus
��2 B
(
��B C
sc
��C E
,
��E F
name
��G K
)
��K L
;
��L M
}
�� 
else
�� 
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� $
.
��$ %"
_q2CEmailServiceName
��% 9
)
��9 :
{
�� 
Globals
�� 
.
�� #
IsEmailServiceRunning
�� -
=
��. /
SetRunningStatus
��0 @
(
��@ A
sc
��A C
,
��C D
name
��E I
)
��I J
;
��J K
}
�� 
else
�� 
if
�� 
(
�� 
name
�� 
==
�� 
Globals
�� $
.
��$ %)
_q2CSearchEngineServiceName
��% @
)
��@ A
{
�� 
Globals
�� 
.
�� .
 IsEnterpriseSearchServiceRunning
�� 8
=
��9 :
SetRunningStatus
��; K
(
��K L
sc
��L N
,
��N O
name
��P T
)
��T U
;
��U V
}
�� 
}
�� 	
public
�� 
static
�� 
bool
�� 
SetRunningStatus
�� +
(
��+ ,
ServiceController
��, =
sc
��> @
,
��@ A
string
��B H
name
��I M
)
��M N
{
�� 	
try
�� 
{
�� 
int
�� 
count
�� 
=
�� 
$num
�� 
;
�� 
if
�� 
(
�� 
sc
�� 
.
�� 
Status
�� 
==
��  %
ServiceControllerStatus
��! 8
.
��8 9
Stopped
��9 @
)
��@ A
{
�� 
StartService
��  
(
��  !
sc
��! #
)
��# $
;
��$ %
if
�� 
(
�� 
count
�� 
<=
��  
	_tryCount
��! *
)
��* +
{
�� 
Thread
�� 
.
�� 
Sleep
�� $
(
��$ %
_sleepTimeInSec
��% 4
*
��5 6
$num
��7 ;
)
��; <
;
��< =
count
�� 
++
�� 
;
��  
ServiceController
�� )
sc_retry
��* 2
=
��3 4
new
��5 8
ServiceController
��9 J
(
��J K
name
��K O
)
��O P
;
��P Q
SetRunningStatus
�� (
(
��( )
sc_retry
��) 1
,
��1 2
name
��3 7
)
��7 8
;
��8 9
}
�� 
Globals
�� 
.
�� 
	_bodyText
�� %
+=
��& (
SetBodyText
��) 4
(
��4 5
name
��5 9
,
��9 :
false
��; @
)
��@ A
;
��A B
return
�� 
false
��  
;
��  !
}
�� 
Globals
�� 
.
�� 
	_bodyText
�� !
+=
��" $
SetBodyText
��% 0
(
��0 1
name
��1 5
,
��5 6
true
��7 ;
)
��; <
;
��< =
return
�� 
true
�� 
;
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
Globals
�� 
.
�� 
	_bodyText
�� !
+=
��" $
SetBodyText
��% 0
(
��0 1
name
��1 5
,
��5 6
false
��7 <
)
��< =
;
��= >
Globals
�� 
.
�� 
_errorStackTrace
�� (
+=
��) +
string
��, 2
.
��2 3
Format
��3 9
(
��9 :
$str
��: Q
,
��Q R
ex
��S U
.
��U V
Message
��V ]
,
��] ^
ex
��_ a
.
��a b

StackTrace
��b l
)
��l m
;
��m n
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
return
�� 
false
�� 
;
�� 
}
�� 
}
�� 	
public
�� 
static
�� 
void
�� 
StartService
�� '
(
��' (
ServiceController
��( 9
sc
��: <
)
��< =
{
�� 	
sc
�� 
.
�� 
Start
�� 
(
�� 
)
�� 
;
�� 
}
�� 	
public
�� 
static
�� 
void
�� 
	EmailSent
�� $
(
��$ %
bool
��% )
isError
��* 1
,
��1 2
string
��3 9
Message
��: A
)
��A B
{
�� 	
string
�� 

_ipAddress
�� 
=
�� 
GetLocalIPAddress
��  1
(
��1 2
)
��2 3
;
��3 4
string
�� 
_systemName
�� 
=
��  
Environment
��! ,
.
��, -
MachineName
��- 8
;
��8 9
string
�� 
_subject
�� 
=
�� 
string
�� $
.
��$ %
Empty
��% *
;
��* +
string
�� 
_body
�� 
=
�� 
string
�� !
.
��! "
Empty
��" '
;
��' (
_subject
�� 
=
�� 
$str
�� 7
;
��7 8
string
�� 
currentDate
�� 
=
��  
DateTime
��! )
.
��) *
UtcNow
��* 0
.
��0 1
ToString
��1 9
(
��9 :
$str
��: L
)
��L M
;
��M N
string
�� 
bodyCSSClass
�� 
=
��  !
$str
��" +
;
��+ ,
_body
�� 
=
�� 
string
�� 
.
�� 
Format
�� !
(
��! "
$str��" �
,��� �
bodyCSSClass��� �
,��� �
Globals��� �
.��� �
_systemDetails��� �
,��� �
_systemName��� �
,��� �

_ipAddress��� �
,��� �
currentDate��� �
)��� �
;��� �
_body
�� 
+=
�� 
$str
�� f
;
��f g
_body
�� 
+=
�� 
$str�� �
+��� �
Globals��� �
.��� �
	_bodyText��� �
+��� �
$str��� �
;��� �
if
�� 
(
�� 
!
�� 
string
�� 
.
�� 
IsNullOrEmpty
�� %
(
��% &
Globals
��& -
.
��- .
_errorStackTrace
��. >
)
��> ?
)
��? @
{
�� 
_body
�� 
=
�� 
_body
�� 
+
�� 
$str
��  7
+
��8 9
Globals
��: A
.
��A B
_errorStackTrace
��B R
;
��R S
}
�� 
try
�� 
{
�� 

EmailModel
�� 

emailModel
�� %
=
��& '
new
��( +

EmailModel
��, 6
(
��6 7
)
��7 8
{
�� 
To
�� 
=
�� 
_adminEmailID
�� &
,
��& '
Subject
�� 
=
�� 
string
�� $
.
��$ %
Format
��% +
(
��+ ,
_subject
��, 4
,
��4 5
Globals
��6 =
.
��= >
_systemDetails
��> L
)
��L M
,
��M N
Body
�� 
=
�� 
_body
��  
}
�� 
;
�� 
EmailService
�� 
emailService
�� )
=
��* +
new
��, /
EmailService
��0 <
(
��< =
)
��= >
;
��> ?
emailService
�� 
.
�� #
commonSendEmailDetail
�� 2
(
��2 3

emailModel
��3 =
)
��= >
;
��> ?
Environment
�� 
.
�� 
Exit
��  
(
��  !
$num
��! "
)
��" #
;
��# $
}
�� 
catch
�� 
(
�� 
	Exception
�� 
ex
�� 
)
��  
{
�� 
SaveErrorLog
�� 
(
�� 
ex
�� 
)
��  
;
��  !
}
�� 
}
�� 	
public
�� 
static
�� 
string
�� 
GetLocalIPAddress
�� .
(
��. /
)
��/ 0
{
�� 	
var
�� 
host
�� 
=
�� 
Dns
�� 
.
�� 
GetHostEntry
�� '
(
��' (
Dns
��( +
.
��+ ,
GetHostName
��, 7
(
��7 8
)
��8 9
)
��9 :
;
��: ;
foreach
�� 
(
�� 
var
�� 
ip
�� 
in
�� 
host
�� #
.
��# $
AddressList
��$ /
)
��/ 0
{
�� 
if
�� 
(
�� 
ip
�� 
.
�� 
AddressFamily
�� $
==
��% '
AddressFamily
��( 5
.
��5 6
InterNetwork
��6 B
)
��B C
{
�� 
return
�� 
ip
�� 
.
�� 
ToString
�� &
(
��& '
)
��' (
;
��( )
}
�� 
}
�� 
throw
�� 
new
�� 
	Exception
�� 
(
��  
$str
��  Y
)
��Y Z
;
��Z [
}
�� 	
public
�� 
static
�� 
bool
�� 
ValidateJSON
�� '
(
��' (
string
��( .
response
��/ 7
)
��7 8
{
�� 	
try
�� 
{
�� 
JToken
�� 
.
�� 
Parse
�� 
(
�� 
response
�� %
)
��% &
;
��& '
return
�� 
true
�� 
;
�� 
}
�� 
catch
�� 
(
�� !
JsonReaderException
�� &
ex
��' )
)
��) *
{
�� 
return
�� 
false
�� 
;
�� 
}
�� 
}
�� 	
public
�� 
static
�� 
void
�� 
SaveErrorLog
�� '
(
��' (
	Exception
��( 1
ex
��2 4
)
��4 5
{
�� 	
try
�� 
{
�� 
string
�� 
_ErrorLogFilePath
�� (
=
��) *%
WebConfigurationManager
��+ B
.
��B C
AppSettings
��C N
[
��N O
$str
��O a
]
��a b
.
��b c
ToString
��c k
(
��k l
)
��l m
;
��m n
string
�� 

strLogText
�� !
=
��" #
ex
��$ &
.
��& '
Message
��' .
.
��. /
ToString
��/ 7
(
��7 8
)
��8 9
;
��9 :
if
�� 
(
�� 
ex
�� 
.
�� 

StackTrace
�� !
!=
��" $
null
��% )
)
��) *
{
�� 

strLogText
�� 
=
��  

strLogText
��! +
+
��, -
$str
��. 0
+
��1 2
ex
��3 5
.
��5 6

StackTrace
��6 @
.
��@ A
ToString
��A I
(
��I J
)
��J K
;
��K L
}
�� 
StreamWriter
�� 
log
��  
;
��  !
if
�� 
(
�� 
!
�� 
File
�� 
.
�� 
Exists
��  
(
��  !
_ErrorLogFilePath
��! 2
)
��2 3
)
��3 4
{
�� 
log
�� 
=
�� 
new
�� 
StreamWriter
�� *
(
��* +
_ErrorLogFilePath
��+ <
)
��< =
;
��= >
}
�� 
else
�� 
{
�� 
log
�� 
=
�� 
File
�� 
.
�� 

AppendText
�� )
(
��) *
_ErrorLogFilePath
��* ;
)
��; <
;
��< =
}
�� 
log
�� 
.
�� 
	WriteLine
�� 
(
�� 
DateTime
�� &
.
��& '
Now
��' *
)
��* +
;
��+ ,
log
�� 
.
�� 
	WriteLine
�� 
(
�� 

strLogText
�� (
)
��( )
;
��) *
log
�� 
.
�� 
	WriteLine
�� 
(
�� 
)
�� 
;
��  
log
�� 
.
�� 
Close
�� 
(
�� 
)
�� 
;
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
)
�� 
{
�� 
}
�� 
}
�� 	
}
�� 
}�� �
HD:\Development\FJT\FJT-DEV\FJT.ServiceUtility\Properties\AssemblyInfo.cs
[ 
assembly 	
:	 

AssemblyTitle 
( 
$str -
)- .
]. /
[		 
assembly		 	
:			 

AssemblyDescription		 
(		 
$str		 !
)		! "
]		" #
[

 
assembly

 	
:

	 
!
AssemblyConfiguration

  
(

  !
$str

! #
)

# $
]

$ %
[ 
assembly 	
:	 

AssemblyCompany 
( 
$str 
) 
] 
[ 
assembly 	
:	 

AssemblyProduct 
( 
$str /
)/ 0
]0 1
[ 
assembly 	
:	 

AssemblyCopyright 
( 
$str 0
)0 1
]1 2
[ 
assembly 	
:	 

AssemblyTrademark 
( 
$str 
)  
]  !
[ 
assembly 	
:	 

AssemblyCulture 
( 
$str 
) 
] 
[ 
assembly 	
:	 


ComVisible 
( 
false 
) 
] 
[ 
assembly 	
:	 

Guid 
( 
$str 6
)6 7
]7 8
[## 
assembly## 	
:##	 

AssemblyVersion## 
(## 
$str## $
)##$ %
]##% &
[$$ 
assembly$$ 	
:$$	 

AssemblyFileVersion$$ 
($$ 
$str$$ (
)$$( )
]$$) *