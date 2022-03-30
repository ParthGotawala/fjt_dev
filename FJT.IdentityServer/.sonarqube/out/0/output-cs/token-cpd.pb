�
ND:\Development\FJT\FJT-DEV\FJT.IdentityServer\Appsettings\ConnectionStrings.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Appsettings (
{ 
public 

class 
ConnectionStrings "
{		 
public

 
string

 
DefaultConnection

 '
{

( )
get

* -
;

- .
set

/ 2
;

2 3
}

4 5
} 
} �
JD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Appsettings\MongoDBConfig.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Appsettings (
{ 
public 

class 
MongoDBConfig 
{		 
public

 
string

 #
MongoDBConnectionString

 -
{

. /
get

0 3
;

3 4
set

5 8
;

8 9
}

: ;
public 
string 
DBName 
{ 
get "
;" #
set$ '
;' (
}) *
public 
MongoCollections 
MongoCollections  0
{1 2
get3 6
;6 7
set8 ;
;; <
}= >
} 
public 

class 
MongoCollections !
{ 
public 
string (
DynamicMessageCollectionName 2
{3 4
get5 8
;8 9
set: =
;= >
}? @
} 
} �
ED:\Development\FJT\FJT-DEV\FJT.IdentityServer\Appsettings\PageURLs.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Appsettings (
{ 
public 

class 
PageURLs 
{		 
public

 
string

 
UIURL

 
{

 
get

 !
;

! "
set

# &
;

& '
}

( )
public 
string 
IdentityServerURL '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
ApiURL 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
ReportDesignerURL '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
ReportViewerURL %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} �	
JD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Appsettings\QueueSettings.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Appsettings (
{ 
public 

class 
QueueSettings 
{		 
public

 
string

 
HostName

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
string 
VirtualHost !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
UserName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
Password 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
	QueueName 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
URI 
{ 
get 
;  
set! $
;$ %
}& '
} 
} �
GD:\Development\FJT\FJT-DEV\FJT.IdentityServer\App_Start\WebApiConfig.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
	App_Start &
{ 
public 

static 
class 
WebApiConfig $
{		 
public

 
static

 
void

 
Register

 #
(

# $
HttpConfiguration

$ 5
config

6 <
)

< =
{ 	
config 
. "
MapHttpAttributeRoutes )
() *
)* +
;+ ,
config 
. 
Routes 
. 
MapHttpRoute &
(& '
name 
: 
$str "
," #
routeTemplate 
: 
$str 6
,6 7
defaults 
: 
new 
{ 
id  "
=# $
RouteParameter% 3
.3 4
Optional4 <
}= >
) 
; 
} 	
} 
} �
?D:\Development\FJT\FJT-DEV\FJT.IdentityServer\ClientConstant.cs
	namespace 	
FJT
 
. 
IdentityServer 
{ 
public		 

class		 
ClientConstant		 
{

 
public 
const 
string 
Q2CAPISecret (
=) *
$str+ Q
;Q R
public 
enum 
	APIScopes 
{ 	
[ 
Display 
( 
Name 
= 
$str 1
)1 2
]2 3
IdentityServerAPI 
, 
[ 
Display 
( 
Name 
= 
$str +
)+ ,
], -
Q2CFrontEnd 
, 
[ 
Display 
( 
Name 
= 
$str 1
)1 2
]2 3
Q2CReportDesigner 
, 
[ 
Display 
( 
Name 
= 
$str /
)/ 0
]0 1
Q2CReportViewer 
} 	
public 
enum 
APIResource 
{ 	
[ 
Display 
( 
Name 
= 
$str %
)% &
]& '
Q2CAPI 
, 
[ 
Display 
( 
Name 
= 
$str 1
)1 2
]2 3
IdentityServerAPI 
}   	
public!! 
enum!! 

Q2CClients!! 
{"" 	
[## 
Display## 
(## 
Name## 
=## 
$str## $
)##$ %
]##% &
Q2CUI$$ 
,$$ 
[%% 
Display%% 
(%% 
Name%% 
=%% 
$str%% 1
)%%1 2
]%%2 3
Q2CReportDesigner&& 
,&& 
['' 
Display'' 
('' 
Name'' 
='' 
$str'' /
)''/ 0
]''0 1
Q2CReportViewer(( 
})) 	
}** 
}++ ��
PD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Controllers\AgreementController.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Controllers (
{ 
[ 
	Authorize 
( !
AuthenticationSchemes $
=% &
JwtBearerDefaults' 8
.8 9 
AuthenticationScheme9 M
)M N
]N O
[ 
Route 

(
 
$str &
)& '
]' (
public 

class 
AgreementController $
:% &

Controller' 1
{ 
private 
readonly !
IFJTIdentityDbContext ."
_iFJTIdentityDbContext/ E
;E F
private 
readonly $
IHttpsResponseRepository 1%
_iHttpsResponseRepository2 K
;K L
private 
readonly 
IDbRepository &
_iDbRepository' 5
;5 6
private   
readonly   
PageURLs   !
	_pageURLs  " +
;  + ,
private!! 
readonly!! 
ILogger!!  
<!!  !
AgreementController!!! 4
>!!4 5
_logger!!6 =
;!!= >
private"" 
readonly"" "
IDynamicMessageService"" /"
_dynamicMessageService""0 F
;""F G
private## 
readonly## "
ITextAngularValueForDB## /"
_textAngularValueForDB##0 F
;##F G
public%% 
AgreementController%% "
(%%" #
IDbRepository&& 
iDbRepository&& '
,&&' (!
IFJTIdentityDbContext'' !!
iFJTIdentityDbContext''" 7
,''7 8$
IHttpsResponseRepository(( $$
iHttpsResponseRepository((% =
,((= >
IOptions)) 
<)) 
PageURLs)) 
>)) 
pageURLs)) '
,))' (
ILogger** 
<** 
AgreementController** '
>**' (
logger**) /
,**/ 0"
IDynamicMessageService++ "!
dynamicMessageService++# 8
,++8 9"
ITextAngularValueForDB,, #!
textAngularValueForDB,,$ 9
),,9 :
{-- 	
_iDbRepository.. 
=.. 
iDbRepository.. *
;..* +"
_iFJTIdentityDbContext// "
=//# $!
iFJTIdentityDbContext//% :
;//: ;%
_iHttpsResponseRepository00 %
=00& '$
iHttpsResponseRepository00( @
;00@ A
	_pageURLs11 
=11 
pageURLs11  
.11  !
Value11! &
;11& '
_logger22 
=22 
logger22 
;22 "
_dynamicMessageService33 "
=33# $!
dynamicMessageService33% :
;33: ;"
_textAngularValueForDB44 "
=44# $!
textAngularValueForDB44% :
;44: ;
}55 	
[<< 	
HttpPost<<	 
]<< 
public== 
async== 
Task== 
<== 
IActionResult== '
>==' (
GetAgreementList==) 9
(==9 :
[==: ;
FromBody==; C
]==C D#
RequestSprocParameterVM==E \#
requestSprocParameterVM==] t
)==t u
{>> 	
if@@ 
(@@ #
requestSprocParameterVM@@ '
==@@( *
null@@+ /
)@@/ 0
{AA 
varBB 
invalidParameterMSGBB '
=BB( )
awaitBB* /"
_dynamicMessageServiceBB0 F
.BBF G
GetBBG J
(BBJ K
INVALID_PARAMETERBBK \
)BB\ ]
;BB] ^
returnCC %
_iHttpsResponseRepositoryCC 0
.CC0 1
ReturnResultCC1 =
(CC= >
APIStatusCodeCC> K
.CCK L
ERRORCCL Q
,CCQ R
APIStateCCS [
.CC[ \
FAILEDCC\ b
,CCb c
nullCCd h
,CCh i
newCCj m
UserMessageCCn y
(CCy z
)CCz {
{CC| }
messageContent	CC~ �
=
CC� �
new
CC� �
MessageContent
CC� �
{
CC� �
messageType
CC� �
=
CC� �!
invalidParameterMSG
CC� �
.
CC� �
messageType
CC� �
,
CC� �
messageCode
CC� �
=
CC� �!
invalidParameterMSG
CC� �
.
CC� �
messageCode
CC� �
,
CC� �
message
CC� �
=
CC� �!
invalidParameterMSG
CC� �
.
CC� �
message
CC� �
}
CC� �
}
CC� �
)
CC� �
;
CC� �
}DD 
tryEE 
{FF 
intGG 
pageGG 
=GG #
requestSprocParameterVMGG 2
.GG2 3
PageGG3 7
==GG8 :
$numGG; <
?GG= >
$numGG? @
:GGA B#
requestSprocParameterVMGGC Z
.GGZ [
PageGG[ _
;GG_ `
intHH 
limitHH 
=HH #
requestSprocParameterVMHH 3
.HH3 4
pageSizeHH4 <
==HH= ?
$numHH@ A
?HHB C
$numHHD F
:HHG H#
requestSprocParameterVMHHI `
.HH` a
pageSizeHHa i
;HHi j
stringII 
orderByII 
=II  
stringII! '
.II' (
EmptyII( -
;II- .
stringJJ 
whereClauseJJ "
=JJ# $
$strJJ% ,
;JJ, -
ListKK 
<KK 
AgreementListVMKK $
>KK$ %
agreementListsKK& 4
=KK5 6
newKK7 :
ListKK; ?
<KK? @
AgreementListVMKK@ O
>KKO P
(KKP Q
)KKQ R
;KKR S
ifMM 
(MM #
requestSprocParameterVMMM +
.MM+ ,
SortColumnsMM, 7
.MM7 8
CountMM8 =
>MM> ?
$numMM@ A
)MMA B
{NN 
orderByOO 
+=OO 
OrderByOO &
.OO& '
GenerateOrderByOO' 6
(OO6 7#
requestSprocParameterVMOO7 N
.OON O
SortColumnsOOO Z
)OOZ [
;OO[ \
}PP 
ifQQ 
(QQ #
requestSprocParameterVMQQ +
.QQ+ ,
SearchColumnsQQ, 9
.QQ9 :
CountQQ: ?
>QQ@ A
$numQQB C
)QQC D
{RR 
whereClauseSS 
+=SS  "
WhereClauseSS# .
.SS. /
GenerateWhereClauseSS/ B
(SSB C#
requestSprocParameterVMSSC Z
.SSZ [
SearchColumnsSS[ h
)SSh i
;SSi j
}TT 
MySqlParameterVV 
[VV 
]VV  

parametersVV! +
=VV, -
newVV. 1
MySqlParameterVV2 @
[VV@ A
]VVA B
{VVC D
newWW 
MySqlParameterWW &
(WW& '
$strWW' 4
,WW4 5
pageWW6 :
)WW: ;
,WW; <
newXX 
MySqlParameterXX &
(XX& '
$strXX' 8
,XX8 9
limitXX: ?
)XX? @
,XX@ A
newYY 
MySqlParameterYY &
(YY& '
$strYY' 2
,YY2 3
orderByYY4 ;
)YY; <
,YY< =
newZZ 
MySqlParameterZZ &
(ZZ& '
$strZZ' 6
,ZZ6 7
whereClauseZZ7 B
)ZZB C
,ZZC D
new[[ 
MySqlParameter[[ &
([[& '
$str[[' 7
,[[7 8#
requestSprocParameterVM[[9 P
.[[P Q
templateType[[Q ]
)[[] ^
,[[^ _
new\\ 
MySqlParameter\\ &
(\\& '
$str\\' 1
,\\1 2#
requestSprocParameterVM\\3 J
.\\J K
userID\\K Q
)\\Q R
}]] 
;]]  
AgreementListDetails^^ $ 
agreementListDetails^^% 9
=^^: ;
await^^< A
_iDbRepository^^B P
.^^P Q
AgreementListAsync^^Q c
(^^c d
$str	^^d �
,
^^� �

parameters
^^� �
)
^^� �
;
^^� �
var`` 
agreementListData`` %
=``& '
new``( +
AgreementListData``, =
(``= >
)``> ?
{aa 
TemplateListbb  
=bb! " 
agreementListDetailsbb# 7
.bb7 8
agreementListVMsbb8 H
.bbH I
ToListbbI O
(bbO P
)bbP Q
,bbQ R
Countcc 
=cc  
agreementListDetailscc 0
.cc0 1
	SpCountVMcc1 :
.cc: ;
Selectcc; A
(ccA B
xccB C
=>ccD F
xccG H
.ccH I
TotalRecordccI T
)ccT U
.ccU V
FirstOrDefaultccV d
(ccd e
)cce f
}dd 
;dd 
returnff %
_iHttpsResponseRepositoryff 0
.ff0 1
ReturnResultff1 =
(ff= >
APIStatusCodeff> K
.ffK L
SUCCESSffL S
,ffS T
APIStateffU ]
.ff] ^
SUCCESSff^ e
,ffe f
agreementListDataffg x
,ffx y
nullffz ~
)ff~ 
;	ff �
}gg 
catchhh 
(hh 
	Exceptionhh 
ehh 
)hh 
{ii 
_loggerjj 
.jj 
LogErrorjj  
(jj  !
ejj! "
.jj" #
ToStringjj# +
(jj+ ,
)jj, -
)jj- .
;jj. /
returnkk 
awaitkk %
_iHttpsResponseRepositorykk 6
.kk6 7#
ReturnExceptionResponsekk7 N
(kkN O
ekkO P
)kkP Q
;kkQ R
}ll 
}mm 	
[tt 	
HttpGettt	 
]tt 
publicuu 
asyncuu 
Taskuu 
<uu 
IActionResultuu '
>uu' (
GetAgreementDetailsuu) <
(uu< =
intuu= @
agreementTypeIDuuA P
)uuP Q
{vv 	
ifww 
(ww 
agreementTypeIDww 
==ww  "
$numww# $
)ww$ %
{xx 
varyy 
invalidParameterMSGyy '
=yy( )
awaityy* /"
_dynamicMessageServiceyy0 F
.yyF G
GetyyG J
(yyJ K
INVALID_PARAMETERyyK \
)yy\ ]
;yy] ^
returnzz %
_iHttpsResponseRepositoryzz 0
.zz0 1
ReturnResultzz1 =
(zz= >
APIStatusCodezz> K
.zzK L
ERRORzzL Q
,zzQ R
APIStatezzS [
.zz[ \
FAILEDzz\ b
,zzb c
nullzzd h
,zzh i
newzzj m
UserMessagezzn y
(zzy z
)zzz {
{zz| }
messageContent	zz~ �
=
zz� �
new
zz� �
MessageContent
zz� �
{
zz� �
messageType
zz� �
=
zz� �!
invalidParameterMSG
zz� �
.
zz� �
messageType
zz� �
,
zz� �
messageCode
zz� �
=
zz� �!
invalidParameterMSG
zz� �
.
zz� �
messageCode
zz� �
,
zz� �
message
zz� �
=
zz� �!
invalidParameterMSG
zz� �
.
zz� �
message
zz� �
}
zz� �
}
zz� �
)
zz� �
;
zz� �
}{{ 
try|| 
{}} 
MySqlParameter~~ 
	parameter~~ (
=~~) *
new~~+ .
MySqlParameter~~/ =
(~~= >
$str~~> P
,~~P Q
agreementTypeID~~R a
)~~a b
;~~b c%
GetAgreementDetailDetails )%
getAgreementDetailDetails* C
=D E
awaitF K
_iDbRepositoryL Z
.Z [(
GetAgreementDetailsListAsync[ w
(w x
$str	x �
,
� �
	parameter
� �
)
� �
;
� �$
GetAgreementDetailData
�� &%
getAgreementDetailsData
��' >
=
��? @
new
��A D$
GetAgreementDetailData
��E [
(
��[ \
)
��\ ]
{
�� 
data
�� 
=
�� '
getAgreementDetailDetails
�� 4
.
��4 5!
GetAgreementDetails
��5 H
.
��H I
ToList
��I O
(
��O P
)
��P Q
}
�� 
;
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f%
getAgreementDetailsData
��g ~
,
��~ 
null��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpGet
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (&
RetriveAgreementByTypeId
��) A
(
��A B
int
��B E
agreementTypeID
��F U
)
��U V
{
�� 	
if
�� 
(
�� 
agreementTypeID
�� 
==
��  "
$num
��# $
)
��$ %
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
var
�� 
agreementList
�� !
=
��" #
await
��$ )$
_iFJTIdentityDbContext
��* @
.
��@ A
	Agreement
��A J
.
��J K
Where
��K P
(
��P Q
x
��Q R
=>
��S U
x
��V W
.
��W X
agreementTypeID
��X g
==
��h j
agreementTypeID
��k z
)
��z {
.
��{ |
ToListAsync��| �
(��� �
)��� �
;��� �
if
�� 
(
�� 
agreementList
�� !
==
��" $
null
��% )
)
��) *
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
foreach
�� 
(
�� 
var
�� 
	agreement
�� &
in
��' )
agreementList
��* 7
)
��7 8
{
�� 
if
�� 
(
�� 
!
�� 
string
�� 
.
��  
IsNullOrEmpty
��  -
(
��- .
	agreement
��. 7
.
��7 8
agreementContent
��8 H
)
��H I
)
��I J
{
�� 
	agreement
�� !
.
��! "
agreementContent
��" 2
=
��3 4$
_textAngularValueForDB
��5 K
.
��K L&
GetTextAngularValueForDB
��L d
(
��d e
	agreement
��e n
.
��n o
agreementContent
��o 
)�� �
;��� �
if
�� 
(
�� 
	agreement
�� %
.
��% &
agreementContent
��& 6
==
��7 9
null
��: >
)
��> ?
{
�� 
var
�� 
somethingWrongMSG
��  1
=
��2 3
await
��4 9$
_dynamicMessageService
��: P
.
��P Q
Get
��Q T
(
��T U
SOMTHING_WRONG
��U c
)
��c d
;
��d e
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
ERROR
��X ]
,
��] ^
APIState
��_ g
.
��g h
FAILED
��h n
,
��n o
null
��p t
,
��t u
new
��v y
UserMessage��z �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
if
�� 
(
�� 
!
�� 
string
�� 
.
��  
IsNullOrEmpty
��  -
(
��- .
	agreement
��. 7
.
��7 8
agreementSubject
��8 H
)
��H I
)
��I J
{
�� 
	agreement
�� !
.
��! "
agreementSubject
��" 2
=
��3 4$
_textAngularValueForDB
��5 K
.
��K L&
GetTextAngularValueForDB
��L d
(
��d e
	agreement
��e n
.
��n o
agreementSubject
��o 
)�� �
;��� �
if
�� 
(
�� 
	agreement
�� %
.
��% &
agreementSubject
��& 6
==
��7 9
null
��: >
)
��> ?
{
�� 
var
�� 
somethingWrongMSG
��  1
=
��2 3
await
��4 9$
_dynamicMessageService
��: P
.
��P Q
Get
��Q T
(
��T U
SOMTHING_WRONG
��U c
)
��c d
;
��d e
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
ERROR
��X ]
,
��] ^
APIState
��_ g
.
��g h
FAILED
��h n
,
��n o
null
��p t
,
��t u
new
��v y
UserMessage��z �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
}
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
agreementList
��g t
,
��t u
null
��v z
)
��z {
;
��{ |
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (,
RetriveUserSignUpAgreementList
��) G
(
��G H
[
��H I
FromBody
��I Q
]
��Q R%
RequestSprocParameterVM
��S j&
requestSprocParameterVM��k �
)��� �
{
�� 	
if
�� 
(
�� %
requestSprocParameterVM
�� '
==
��( *
null
��+ /
)
��/ 0
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
int
�� 
page
�� 
=
�� %
requestSprocParameterVM
�� 2
.
��2 3
Page
��3 7
==
��8 :
$num
��; <
?
��= >
$num
��? @
:
��A B%
requestSprocParameterVM
��C Z
.
��Z [
Page
��[ _
;
��_ `
int
�� 
limit
�� 
=
�� %
requestSprocParameterVM
�� 3
.
��3 4
pageSize
��4 <
==
��= ?
$num
��@ A
?
��B C
$num
��D F
:
��G H%
requestSprocParameterVM
��I `
.
��` a
pageSize
��a i
;
��i j
string
�� 
orderBy
�� 
=
��  
string
��! '
.
��' (
Empty
��( -
;
��- .
string
�� 
whereClause
�� "
=
��# $
$str
��% ,
;
��, -
List
�� 
<
�� %
UserSignUpAgreementList
�� ,
>
��, -
agreementLists
��. <
=
��= >
new
��? B
List
��C G
<
��G H%
UserSignUpAgreementList
��H _
>
��_ `
(
��` a
)
��a b
;
��b c
if
�� 
(
�� %
requestSprocParameterVM
�� +
.
��+ ,
SortColumns
��, 7
.
��7 8
Count
��8 =
>
��> ?
$num
��@ A
)
��A B
{
�� 
orderBy
�� 
+=
�� 
OrderBy
�� &
.
��& '
GenerateOrderBy
��' 6
(
��6 7%
requestSprocParameterVM
��7 N
.
��N O
SortColumns
��O Z
)
��Z [
;
��[ \
}
�� 
if
�� 
(
�� %
requestSprocParameterVM
�� +
.
��+ ,
SearchColumns
��, 9
.
��9 :
Count
��: ?
>
��@ A
$num
��B C
)
��C D
{
�� 
whereClause
�� 
+=
��  "
WhereClause
��# .
.
��. /!
GenerateWhereClause
��/ B
(
��B C%
requestSprocParameterVM
��C Z
.
��Z [
SearchColumns
��[ h
)
��h i
;
��i j
}
�� 
MySqlParameter
�� 
[
�� 
]
��  

parameters
��! +
=
��, -
new
��. 1
MySqlParameter
��2 @
[
��@ A
]
��A B
{
��C D
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 4
,
��4 5
page
��6 :
)
��: ;
,
��; <
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 8
,
��8 9
limit
��: ?
)
��? @
,
��@ A
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 2
,
��2 3
orderBy
��4 ;
)
��; <
,
��< =
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 6
,
��6 7
whereClause
��7 B
)
��B C
,
��C D
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 1
,
��1 2%
requestSprocParameterVM
��3 J
.
��J K
userID
��K Q
)
��Q R
}
�� 
;
�� ,
UserSignUpAgreementListDetails
�� .,
userSignUpAgreementListDetails
��/ M
=
��N O
await
��P U
_iDbRepository
��V d
.
��d e+
UserSignUpAgreementListAsync��e �
(��� �
$str��� �
,��� �

parameters��� �
)��� �
;��� �)
UserSignUpAgreementListData
�� +)
userSignUpAgreementListData
��, G
=
��H I
new
��J M)
UserSignUpAgreementListData
��N i
{
�� 
AgreementUserList
�� %
=
��& ',
userSignUpAgreementListDetails
��( F
.
��F G&
UserSignUpAgreementLists
��G _
.
��_ `
ToList
��` f
(
��f g
)
��g h
,
��h i
Count
�� 
=
�� ,
userSignUpAgreementListDetails
�� :
.
��: ;
	SpCountVM
��; D
.
��D E
Select
��E K
(
��K L
x
��L M
=>
��N P
x
��Q R
.
��R S
TotalRecord
��S ^
)
��^ _
.
��_ `
FirstOrDefault
��` n
(
��n o
)
��o p
}
�� 
;
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f*
userSignUpAgreementListData��g �
,��� �
null��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (&
PublishAgreementTemplate
��) A
(
��A B
[
��B C
FromBody
��C K
]
��K L 
RequestParameterVM
��M _ 
requestParameterVM
��` r
)
��r s
{
�� 	
if
�� 
(
��  
requestParameterVM
�� "
==
��# %
null
��& *
)
��* +
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
int
�� 
agreementTypeID
�� #
=
��$ % 
requestParameterVM
��& 8
.
��8 9
agreementTypeID
��9 H
;
��H I
int
�� 
?
�� 

maxVersion
�� 
=
��  !
await
��" '$
_iFJTIdentityDbContext
��( >
.
��> ?
	Agreement
��? H
.
��H I
Where
��I N
(
��N O
x
��O P
=>
��Q S
x
��T U
.
��U V
agreementTypeID
��V e
==
��f h
agreementTypeID
��i x
)
��x y
.
��y z
MaxAsync��z �
(��� �
x��� �
=>��� �
x��� �
.��� �
version��� �
)��� �
;��� �
	Agreement
�� 
	agreement
�� #
=
��$ %
await
��& +$
_iFJTIdentityDbContext
��, B
.
��B C
	Agreement
��C L
.
��L M!
FirstOrDefaultAsync
��M `
(
��` a
x
��a b
=>
��c e
x
��f g
.
��g h
agreementTypeID
��h w
==
��x z
agreementTypeID��{ �
&&��� �
x��� �
.��� �
isPublished��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� 
	agreement
�� 
==
��  
null
��! %
)
��% &
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
	agreement
�� 
.
�� 
version
�� !
=
��" #

maxVersion
��$ .
!=
��/ 1
null
��2 6
?
��7 8

maxVersion
��9 C
:
��D E
$num
��F G
;
��G H
	agreement
�� 
.
�� 
isPublished
�� %
=
��& '
true
��( ,
;
��, -
	agreement
�� 
.
�� 
publishedDate
�� '
=
��( )
DateTime
��* 2
.
��2 3
UtcNow
��3 9
;
��9 :
	agreement
�� 
.
�� 
	updatedBy
�� #
=
��$ % 
requestParameterVM
��& 8
.
��8 9
userName
��9 A
;
��A B
	agreement
�� 
.
�� 
updateByRole
�� &
=
��' ( 
requestParameterVM
��) ;
.
��; <
userRoleName
��< H
;
��H I
	agreement
�� 
.
�� 
	updatedAt
�� #
=
��$ %
DateTime
��& .
.
��. /
UtcNow
��/ 5
;
��5 6
await
�� $
_iFJTIdentityDbContext
�� ,
.
��, -
CustomSaveChanges
��- >
(
��> ?
)
��? @
;
��@ A
var
�� !
agreementPublishMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
$str
��K f
)
��f g
;
��g h
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
null
��g k
,
��k l
new
��m p
UserMessage
��q |
(
��| }
)
��} ~
{�� �
message��� �
=��� �#
agreementPublishMSG��� �
.��� �
message��� �
}��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (+
RetriveArchieveVersionDetails
��) F
(
��F G
[
��G H
FromBody
��H P
]
��P Q%
RequestSprocParameterVM
��R i&
requestSprocParameterVM��j �
)��� �
{
�� 	
if
�� 
(
�� %
requestSprocParameterVM
�� '
==
��( *
null
��+ /
)
��/ 0
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
int
�� 
page
�� 
=
�� %
requestSprocParameterVM
�� 2
.
��2 3
Page
��3 7
==
��8 :
$num
��; <
?
��= >
$num
��? @
:
��A B%
requestSprocParameterVM
��C Z
.
��Z [
Page
��[ _
;
��_ `
int
�� 
limit
�� 
=
�� %
requestSprocParameterVM
�� 3
.
��3 4
pageSize
��4 <
==
��= ?
$num
��@ A
?
��B C
$num
��D F
:
��G H%
requestSprocParameterVM
��I `
.
��` a
pageSize
��a i
;
��i j
string
�� 
orderBy
�� 
=
��  
string
��! '
.
��' (
Empty
��( -
;
��- .
string
�� 
whereClause
�� "
=
��# $
$str
��% ,
;
��, -
List
�� 
<
�� (
ArchieveVersionDetailsList
�� /
>
��/ 0
agreementLists
��1 ?
=
��@ A
new
��B E
List
��F J
<
��J K(
ArchieveVersionDetailsList
��K e
>
��e f
(
��f g
)
��g h
;
��h i
if
�� 
(
�� %
requestSprocParameterVM
�� +
.
��+ ,
SortColumns
��, 7
.
��7 8
Count
��8 =
>
��> ?
$num
��@ A
)
��A B
{
�� 
orderBy
�� 
+=
�� 
OrderBy
�� &
.
��& '
GenerateOrderBy
��' 6
(
��6 7%
requestSprocParameterVM
��7 N
.
��N O
SortColumns
��O Z
)
��Z [
;
��[ \
}
�� 
if
�� 
(
�� %
requestSprocParameterVM
�� +
.
��+ ,
SearchColumns
��, 9
.
��9 :
Count
��: ?
>
��@ A
$num
��B C
)
��C D
{
�� 
whereClause
�� 
+=
��  "
WhereClause
��# .
.
��. /!
GenerateWhereClause
��/ B
(
��B C%
requestSprocParameterVM
��C Z
.
��Z [
SearchColumns
��[ h
)
��h i
;
��i j
}
�� 
MySqlParameter
�� 
[
�� 
]
��  

parameters
��! +
=
��, -
new
��. 1
MySqlParameter
��2 @
[
��@ A
]
��A B
{
��C D
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 4
,
��4 5
page
��6 :
)
��: ;
,
��; <
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 8
,
��8 9
limit
��: ?
)
��? @
,
��@ A
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 2
,
��2 3
orderBy
��4 ;
)
��; <
,
��< =
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 6
,
��6 7
whereClause
��7 B
)
��B C
,
��C D
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' :
,
��: ;%
requestSprocParameterVM
��; R
.
��R S
agreementID
��S ^
)
��^ _
,
��_ `
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 1
,
��1 2%
requestSprocParameterVM
��3 J
.
��J K
userID
��K Q
)
��Q R
}
�� 
;
�� /
!ArchieveVersionDetailsListDetails
�� 1/
!archieveVersionDetailsListDetails
��2 S
=
��T U
await
��V [
_iDbRepository
��\ j
.
��j k.
ArchieveVersionDetailsListAsync��k �
(��� �
$str��� �
,��� �

parameters��� �
)��� �
;��� �
var
�� ,
archieveVersionDetailsListData
�� 2
=
��3 4
new
��5 8,
ArchieveVersionDetailsListData
��9 W
{
�� 
ArchieveList
��  
=
��! "/
!archieveVersionDetailsListDetails
��# D
.
��D E)
ArchieveVersionDetailsLists
��E `
.
��` a
ToList
��a g
(
��g h
)
��h i
,
��i j
Count
�� 
=
�� /
!archieveVersionDetailsListDetails
�� =
.
��= >
	SpCountVM
��> G
.
��G H
Select
��H N
(
��N O
x
��O P
=>
��Q S
x
��T U
.
��U V
TotalRecord
��V a
)
��a b
.
��b c
FirstOrDefault
��c q
(
��q r
)
��r s
}
�� 
;
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f-
archieveVersionDetailsListData��g �
,��� �
null��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' ()
CheckDuplicateAgreementType
��) D
(
��D E
[
��E F
FromBody
��F N
]
��N O 
RequestParameterVM
��P b 
requestParameterVM
��c u
)
��u v
{
�� 	
if
�� 
(
��  
requestParameterVM
�� "
==
��# %
null
��& *
)
��* +
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
bool
�� 
isDuplicate
��  
=
��! "
false
��# (
;
��( )
int
�� 
?
�� 
agreementTypeID
�� $
=
��% &
await
��' ,$
_iFJTIdentityDbContext
��- C
.
��C D
AgreementType
��D Q
.
��Q R
Where
��R W
(
��W X
x
��X Y
=>
��Z \
x
��] ^
.
��^ _
agreementTypeID
��_ n
==
��o q!
requestParameterVM��r �
.��� �
agreementTypeID��� �
&&��� �
x��� �
.��� �
displayName��� �
==��� �"
requestParameterVM��� �
.��� �
displayName��� �
&&��� �
x��� �
.��� �
templateType��� �
==��� �"
requestParameterVM��� �
.��� �
templateType��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
agreementTypeID��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
if
�� 
(
�� 
!
�� 
(
�� 
agreementTypeID
�� %
==
��& (
null
��) -
||
��. 0
agreementTypeID
��1 @
==
��A C
$num
��D E
)
��E F
)
��F G
{
�� 
isDuplicate
�� 
=
��  !
true
��" &
;
��& '
}
�� 
CommonResponse
�� 
commonResponse
�� -
=
��. /
new
��0 3
CommonResponse
��4 B
{
�� 
isDuplicate
�� 
=
��  !
isDuplicate
��" -
}
�� 
;
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
commonResponse
��g u
,
��u v
null
��w {
)
��{ |
;
��| }
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
SaveAgreementType
��) :
(
��: ;
[
��; <
FromBody
��< D
]
��D E 
RequestParameterVM
��F X 
requestParameterVM
��Y k
)
��k l
{
�� 	
if
�� 
(
��  
requestParameterVM
�� "
==
��# %
null
��& *
)
��* +
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
var
�� 
agreementType
�� !
=
��" #
await
��$ )$
_iFJTIdentityDbContext
��* @
.
��@ A
AgreementType
��A N
.
��N O
Where
��O T
(
��T U
x
��U V
=>
��W Y
x
��Z [
.
��[ \
agreementTypeID
��\ k
==
��l n!
requestParameterVM��o �
.��� �
agreementTypeID��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
if
�� 
(
�� 
agreementType
�� !
==
��" $
null
��% )
)
��) *
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
agreementType
�� 
.
�� 
displayName
�� )
=
��* + 
requestParameterVM
��, >
.
��> ?
displayName
��? J
;
��J K
agreementType
�� 
.
�� 
	updatedBy
�� '
=
��( ) 
requestParameterVM
��* <
.
��< =
userName
��= E
;
��E F
agreementType
�� 
.
�� 
updateByRole
�� *
=
��+ , 
requestParameterVM
��- ?
.
��? @
userRoleName
��@ L
;
��L M
agreementType
�� 
.
�� 
	updatedAt
�� '
=
��( )
DateTime
��* 2
.
��2 3
UtcNow
��3 9
;
��9 :
await
�� $
_iFJTIdentityDbContext
�� ,
.
��, -
CustomSaveChanges
��- >
(
��> ?
)
��? @
;
��@ A
CommonResponse
�� 
commonResponse
�� -
=
��. /
new
��0 3
CommonResponse
��4 B
{
�� 
agreementTypeID
�� #
=
��$ % 
requestParameterVM
��& 8
.
��8 9
agreementTypeID
��9 H
}
�� 
;
�� 
var
�� 
savedMSG
�� 
=
�� 
await
�� $$
_dynamicMessageService
��% ;
.
��; <
Get
��< ?
(
��? @
SAVED
��@ E
)
��E F
;
��F G
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
commonResponse
��g u
,
��u v
new
��w z
UserMessage��{ �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
savedMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
GetAgreedUserList
��) :
(
��: ;
[
��; <
FromBody
��< D
]
��D E%
RequestSprocParameterVM
��F ]%
requestSprocParameterVM
��^ u
)
��u v
{
�� 	
if
�� 
(
�� %
requestSprocParameterVM
�� '
==
��( *
null
��+ /
)
��/ 0
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
int
�� 
page
�� 
=
�� %
requestSprocParameterVM
�� 2
.
��2 3
Page
��3 7
==
��8 :
$num
��; <
?
��= >
$num
��? @
:
��A B%
requestSprocParameterVM
��C Z
.
��Z [
Page
��[ _
;
��_ `
int
�� 
limit
�� 
=
�� %
requestSprocParameterVM
�� 3
.
��3 4
pageSize
��4 <
==
��= ?
$num
��@ A
?
��B C
$num
��D F
:
��G H%
requestSprocParameterVM
��I `
.
��` a
pageSize
��a i
;
��i j
string
�� 
orderBy
�� 
=
��  
string
��! '
.
��' (
Empty
��( -
;
��- .
string
�� 
whereClause
�� "
=
��# $
$str
��% ,
;
��, -
List
�� 
<
�� !
GetAgreedUserListVM
�� (
>
��( )
agreementLists
��* 8
=
��9 :
new
��; >
List
��? C
<
��C D!
GetAgreedUserListVM
��D W
>
��W X
(
��X Y
)
��Y Z
;
��Z [
if
�� 
(
�� %
requestSprocParameterVM
�� +
.
��+ ,
SortColumns
��, 7
.
��7 8
Count
��8 =
>
��> ?
$num
��@ A
)
��A B
{
�� 
orderBy
�� 
+=
�� 
OrderBy
�� &
.
��& '
GenerateOrderBy
��' 6
(
��6 7%
requestSprocParameterVM
��7 N
.
��N O
SortColumns
��O Z
)
��Z [
;
��[ \
}
�� 
if
�� 
(
�� %
requestSprocParameterVM
�� +
.
��+ ,
SearchColumns
��, 9
.
��9 :
Count
��: ?
>
��@ A
$num
��B C
)
��C D
{
�� 
whereClause
�� 
+=
��  "
WhereClause
��# .
.
��. /!
GenerateWhereClause
��/ B
(
��B C%
requestSprocParameterVM
��C Z
.
��Z [
SearchColumns
��[ h
)
��h i
;
��i j
}
�� 
MySqlParameter
�� 
[
�� 
]
��  

parameters
��! +
=
��, -
new
��. 1
MySqlParameter
��2 @
[
��@ A
]
��A B
{
��C D
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 4
,
��4 5
page
��6 :
)
��: ;
,
��; <
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 8
,
��8 9
limit
��: ?
)
��? @
,
��@ A
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 2
,
��2 3
orderBy
��4 ;
)
��; <
,
��< =
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 6
,
��6 7
whereClause
��7 B
)
��B C
,
��C D
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' :
,
��: ;%
requestSprocParameterVM
��< S
.
��S T
agreementTypeID
��T c
)
��c d
,
��d e
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' 1
,
��1 2%
requestSprocParameterVM
��3 J
.
��J K
userID
��K Q
)
��Q R
}
�� 
;
�� (
GetAgreedUserListVMDetails
�� *(
getAgreedUserListVMDetails
��+ E
=
��F G
await
��H M
_iDbRepository
��N \
.
��\ ]$
GetAgreedUserListAsync
��] s
(
��s t
$str��t �
,��� �

parameters��� �
)��� �
;��� �
var
�� %
getAgreedUserListVMData
�� +
=
��, -
new
��. 1%
GetAgreedUserListVMData
��2 I
(
��I J
)
��J K
{
�� 
AgreedUserList
�� "
=
��# $(
getAgreedUserListVMDetails
��% ?
.
��? @"
GetAgreedUserListVMs
��@ T
.
��T U
ToList
��U [
(
��[ \
)
��\ ]
,
��] ^
Count
�� 
=
�� (
getAgreedUserListVMDetails
�� 6
.
��6 7
	SpCountVM
��7 @
.
��@ A
Select
��A G
(
��G H
x
��H I
=>
��J L
x
��M N
.
��N O
TotalRecord
��O Z
)
��Z [
.
��[ \
FirstOrDefault
��\ j
(
��j k
)
��k l
}
�� 
;
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f%
getAgreedUserListVMData
��g ~
,
��~ 
null��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (#
CreateUpdateAgreement
��) >
(
��> ?
int
��? B
agreementID
��C N
,
��N O
[
��P Q
FromBody
��Q Y
]
��Y Z
AgreementVM
��[ f
agreementVM
��g r
)
��r s
{
�� 	
if
�� 
(
�� 
agreementVM
�� 
==
�� 
null
�� #
)
��# $
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
if
�� 
(
�� 
!
�� 
string
�� 
.
�� 
IsNullOrEmpty
�� )
(
��) *
agreementVM
��* 5
.
��5 6
agreementContent
��6 F
)
��F G
)
��G H
{
�� 
agreementVM
�� 
.
��  
agreementContent
��  0
=
��1 2$
_textAngularValueForDB
��3 I
.
��I J&
SetTextAngularValueForDB
��J b
(
��b c
agreementVM
��c n
.
��n o
agreementContent
��o 
)�� �
;��� �
if
�� 
(
�� 
agreementVM
�� #
.
��# $
agreementContent
��$ 4
==
��5 7
null
��8 <
)
��< =
{
�� 
var
�� 
somethingWrongMSG
�� -
=
��. /
await
��0 5$
_dynamicMessageService
��6 L
.
��L M
Get
��M P
(
��P Q
SOMTHING_WRONG
��Q _
)
��_ `
;
��` a
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
if
�� 
(
�� 
!
�� 
string
�� 
.
�� 
IsNullOrEmpty
�� )
(
��) *
agreementVM
��* 5
.
��5 6
agreementSubject
��6 F
)
��F G
)
��G H
{
�� 
agreementVM
�� 
.
��  
agreementSubject
��  0
=
��1 2$
_textAngularValueForDB
��3 I
.
��I J&
SetTextAngularValueForDB
��J b
(
��b c
agreementVM
��c n
.
��n o
agreementSubject
��o 
)�� �
;��� �
if
�� 
(
�� 
agreementVM
�� #
.
��# $
agreementSubject
��$ 4
==
��5 7
null
��8 <
)
��< =
{
�� 
var
�� 
somethingWrongMSG
�� -
=
��. /
await
��0 5$
_dynamicMessageService
��6 L
.
��L M
Get
��M P
(
��P Q
SOMTHING_WRONG
��Q _
)
��_ `
;
��` a
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
if
�� 
(
�� 
agreementID
�� 
!=
��  "
$num
��# $
)
��$ %
{
�� 
var
�� 
	agreement
�� !
=
��" #
await
��$ )$
_iFJTIdentityDbContext
��* @
.
��@ A
	Agreement
��A J
.
��J K!
FirstOrDefaultAsync
��K ^
(
��^ _
x
��_ `
=>
��a c
x
��d e
.
��e f
agreementID
��f q
==
��r t
agreementID��u �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
�� 
	agreement
�� !
==
��" $
null
��% )
)
��) *
{
�� 
var
�� 
notFoundMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
	NOT_FOUND
��K T
)
��T U
;
��U V
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
	agreement
�� 
.
�� 
agreementContent
�� .
=
��/ 0
agreementVM
��1 <
.
��< =
agreementContent
��= M
;
��M N
	agreement
�� 
.
�� 
system_variables
�� .
=
��/ 0
agreementVM
��1 <
.
��< =
system_variables
��= M
;
��M N
	agreement
�� 
.
�� 
agreementSubject
�� .
=
��/ 0
agreementVM
��1 <
.
��< =
agreementSubject
��= M
;
��M N
	agreement
�� 
.
�� 
	updatedAt
�� '
=
��( )
DateTime
��* 2
.
��2 3
UtcNow
��3 9
;
��9 :
	agreement
�� 
.
�� 
	updatedBy
�� '
=
��( )
agreementVM
��* 5
.
��5 6
	updatedBy
��6 ?
;
��? @
	agreement
�� 
.
�� 
updateByRole
�� *
=
��+ ,
agreementVM
��- 8
.
��8 9
updateByRole
��9 E
;
��E F
await
�� $
_iFJTIdentityDbContext
�� 0
.
��0 1
CustomSaveChanges
��1 B
(
��B C
)
��C D
;
��D E
var
�� 

updatedMSG
�� "
=
��# $
await
��% *$
_dynamicMessageService
��+ A
.
��A B
Get
��B E
(
��E F
UPDATED
��F M
)
��M N
;
��N O
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
null
��k o
,
��o p
new
��q t
UserMessage��u �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �

updatedMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
var
�� 
	agreement
�� !
=
��" #
new
��$ '
	Agreement
��( 1
(
��1 2
)
��2 3
{
�� 
agreementTypeID
�� '
=
��( )
agreementVM
��* 5
.
��5 6
agreementTypeID
��6 E
,
��E F
agreementContent
�� (
=
��) *
agreementVM
��+ 6
.
��6 7
agreementContent
��7 G
,
��G H
system_variables
�� (
=
��) *
agreementVM
��+ 6
.
��6 7
system_variables
��7 G
,
��G H
agreementSubject
�� (
=
��) *
agreementVM
��+ 6
.
��6 7
agreementSubject
��7 G
,
��G H
isPublished
�� #
=
��$ %
false
��& +
,
��+ ,
	isDeleted
�� !
=
��" #
false
��$ )
,
��) *
version
�� 
=
��  !
agreementVM
��" -
.
��- .
version
��. 5
,
��5 6
createByRole
�� $
=
��% &
agreementVM
��' 2
.
��2 3
createByRole
��3 ?
,
��? @
	createdAt
�� !
=
��" #
DateTime
��$ ,
.
��, -
UtcNow
��- 3
,
��3 4
	createdBy
�� !
=
��" #
agreementVM
��$ /
.
��/ 0
	createdBy
��0 9
,
��9 :
updateByRole
�� $
=
��% &
agreementVM
��' 2
.
��2 3
updateByRole
��3 ?
,
��? @
	updatedAt
�� !
=
��" #
DateTime
��$ ,
.
��, -
UtcNow
��- 3
,
��3 4
	updatedBy
�� !
=
��" #
agreementVM
��$ /
.
��/ 0
	updatedBy
��0 9
}
�� 
;
�� $
_iFJTIdentityDbContext
�� *
.
��* +
	Agreement
��+ 4
.
��4 5
Add
��5 8
(
��8 9
	agreement
��9 B
)
��B C
;
��C D
await
�� $
_iFJTIdentityDbContext
�� 0
.
��0 1
CustomSaveChanges
��1 B
(
��B C
)
��C D
;
��D E
var
�� 

createdMSG
�� "
=
��# $
await
��% *$
_dynamicMessageService
��+ A
.
��A B
Get
��B E
(
��E F
CREATED
��F M
)
��M N
;
��N O
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
null
��k o
,
��o p
new
��q t
UserMessage��u �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �

createdMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' ()
GetAgreementTemplateDetails
��) D
(
��D E
[
��E F
FromBody
��F N
]
��N O1
#RequestDownloadAgreementParameterVM
��P s
parameterVM
��t 
)�� �
{
�� 	
if
�� 
(
�� 
parameterVM
�� 
==
�� 
null
�� #
)
��# $
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
List
�� 
<
�� (
DownloadAgreementDetailsVM
�� /
>
��/ 0,
downloadAgreementDetailsVMList
��1 O
=
��P Q
new
��R U
List
��V Z
<
��Z [(
DownloadAgreementDetailsVM
��[ u
>
��u v
(
��v w
)
��w x
;
��x y
MySqlParameter
�� 
[
�� 
]
��  

parameters
��! +
=
��, -
new
��. 1
MySqlParameter
��2 @
[
��@ A
]
��A B
{
��C D
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' :
,
��: ;
parameterVM
��< G
.
��G H
userAgreementID
��H W
)
��W X
,
��X Y
new
�� 
MySqlParameter
�� &
(
��& '
$str
��' :
,
��: ;
parameterVM
��< G
.
��G H
agreementTypeID
��H W
)
��W X
}
�� 
;
�� /
!DownloadAgreementDetailsVMDetails
�� 1/
!downloadAgreementDetailsVMDetails
��2 S
=
��T U
await
��V [
_iDbRepository
��\ j
.
��j k,
DownloadAgreementDetailsAsync��k �
(��� �
$str��� �
,��� �

parameters��� �
)��� �
;��� �
var
�� !
agreementRecordList
�� '
=
��( )/
!downloadAgreementDetailsVMDetails
��* K
.
��K L)
DownloadAgreementDetailsVMs
��L g
.
��g h
ToList
��h n
(
��n o
)
��o p
;
��p q
if
�� 
(
�� !
agreementRecordList
�� '
==
��( *
null
��+ /
)
��/ 0
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
var
�� 
companyLogo
�� 
=
��  !
await
��" '$
_iFJTIdentityDbContext
��( >
.
��> ?!
Systemconfigrations
��? R
.
��R S
Where
��S X
(
��X Y
x
��Y Z
=>
��[ ]
x
��^ _
.
��_ `
key
��` c
==
��d f
COMPANY_LOGO_KEY
��g w
)
��w x
.
��x y
Select
��y 
(�� �
x��� �
=>��� �
x��� �
.��� �
values��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
foreach
�� 
(
�� 
var
�� 
	agreement
�� &
in
��' )!
agreementRecordList
��* =
)
��= >
{
�� 
if
�� 
(
�� 
!
�� 
string
�� 
.
��  
IsNullOrEmpty
��  -
(
��- .
	agreement
��. 7
.
��7 8
agreementContent
��8 H
)
��H I
)
��I J
{
�� 
	agreement
�� !
.
��! "
agreementContent
��" 2
=
��3 4$
_textAngularValueForDB
��5 K
.
��K L&
GetTextAngularValueForDB
��L d
(
��d e
	agreement
��e n
.
��n o
agreementContent
��o 
)�� �
;��� �
if
�� 
(
�� 
	agreement
�� %
.
��% &
agreementContent
��& 6
==
��7 9
null
��: >
)
��> ?
{
�� 
var
�� 
somethingWrongMSG
��  1
=
��2 3
await
��4 9$
_dynamicMessageService
��: P
.
��P Q
Get
��Q T
(
��T U
SOMTHING_WRONG
��U c
)
��c d
;
��d e
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
ERROR
��X ]
,
��] ^
APIState
��_ g
.
��g h
FAILED
��h n
,
��n o
null
��p t
,
��t u
new
��v y
UserMessage��z �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
	agreement
�� 
.
�� 
agreementContent
�� .
=
��/ 0
	agreement
��1 :
.
��: ;
agreementContent
��; K
.
��K L
Replace
��L S
(
��S T1
#SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG
��T w
,
��w x
COMPANY_NAME��y �
)��� �
.
��  !
Replace
��! (
(
��( )1
#SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG
��) L
,
��L M
companyLogo
��N Y
)
��Y Z
;
��Z [
}
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f!
agreementRecordList
��g z
,
��z {
null��| �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
GetAgreementTypes
��) :
(
��: ;
string
��; A
templateType
��B N
)
��N O
{
�� 	
try
�� 
{
�� 
List
�� 
<
�� 
AgreementType
�� "
>
��" #
agreementTypeList
��$ 5
=
��6 7
new
��8 ;
List
��< @
<
��@ A
AgreementType
��A N
>
��N O
(
��O P
)
��P Q
;
��Q R
if
�� 
(
�� 
templateType
��  
==
��! #
null
��$ (
)
��( )
{
�� 
agreementTypeList
�� %
=
��& '
await
��( -$
_iFJTIdentityDbContext
��. D
.
��D E
AgreementType
��E R
.
��R S
Where
��S X
(
��X Y
x
��Y Z
=>
��[ ]
x
��^ _
.
��_ `
	isDeleted
��` i
==
��j l
false
��m r
)
��r s
.
��s t
Include
��t {
(
��{ |
x
��| }
=>��~ �
x��� �
.��� �

agreements��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
agreementTypeList
�� %
=
��& '
await
��( -$
_iFJTIdentityDbContext
��. D
.
��D E
AgreementType
��E R
.
��R S
Where
��S X
(
��X Y
x
��Y Z
=>
��[ ]
x
��^ _
.
��_ `
templateType
��` l
==
��m o
templateType
��p |
&&
��} 
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �
Include��� �
(��� �
x��� �
=>��� �
x��� �
.��� �

agreements��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
}
�� 
if
�� 
(
�� 
agreementTypeList
�� %
==
��& (
null
��) -
)
��- .
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� � 
AGREEMENT_ENTITY��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
foreach
�� 
(
�� 
var
�� 
agreementType
�� *
in
��+ -
agreementTypeList
��. ?
)
��? @
{
�� 
if
�� 
(
�� 
agreementType
�� %
.
��% &

agreements
��& 0
.
��0 1
Count
��1 6
>
��7 8
$num
��9 :
)
��: ;
{
�� 
foreach
�� 
(
��  !
var
��! $
	agreement
��% .
in
��/ 1
agreementType
��2 ?
.
��? @

agreements
��@ J
)
��J K
{
�� 
if
�� 
(
��  
!
��  !
string
��! '
.
��' (
IsNullOrEmpty
��( 5
(
��5 6
	agreement
��6 ?
.
��? @
agreementContent
��@ P
)
��P Q
)
��Q R
{
�� 
	agreement
��  )
.
��) *
agreementContent
��* :
=
��; <$
_textAngularValueForDB
��= S
.
��S T&
GetTextAngularValueForDB
��T l
(
��l m
	agreement
��m v
.
��v w
agreementContent��w �
)��� �
;��� �
if
��  "
(
��# $
	agreement
��$ -
.
��- .
agreementContent
��. >
==
��? A
null
��B F
)
��F G
{
��  !
var
��$ '
somethingWrongMSG
��( 9
=
��: ;
await
��< A$
_dynamicMessageService
��B X
.
��X Y
Get
��Y \
(
��\ ]
SOMTHING_WRONG
��] k
)
��k l
;
��l m
return
��$ *'
_iHttpsResponseRepository
��+ D
.
��D E
ReturnResult
��E Q
(
��Q R
APIStatusCode
��R _
.
��_ `
ERROR
��` e
,
��e f
APIState
��g o
.
��o p
FAILED
��p v
,
��v w
null
��x |
,
��| }
new��~ �
UserMessage��� �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
��  !
}
�� 
if
�� 
(
��  
!
��  !
string
��! '
.
��' (
IsNullOrEmpty
��( 5
(
��5 6
	agreement
��6 ?
.
��? @
agreementSubject
��@ P
)
��P Q
)
��Q R
{
�� 
	agreement
��  )
.
��) *
agreementSubject
��* :
=
��; <$
_textAngularValueForDB
��= S
.
��S T&
GetTextAngularValueForDB
��T l
(
��l m
	agreement
��m v
.
��v w
agreementSubject��w �
)��� �
;��� �
if
��  "
(
��# $
	agreement
��$ -
.
��- .
agreementSubject
��. >
==
��? A
null
��B F
)
��F G
{
��  !
var
��$ '
somethingWrongMSG
��( 9
=
��: ;
await
��< A$
_dynamicMessageService
��B X
.
��X Y
Get
��Y \
(
��\ ]
SOMTHING_WRONG
��] k
)
��k l
;
��l m
return
��$ *'
_iHttpsResponseRepository
��+ D
.
��D E
ReturnResult
��E Q
(
��Q R
APIStatusCode
��R _
.
��_ `
ERROR
��` e
,
��e f
APIState
��g o
.
��o p
FAILED
��p v
,
��v w
null
��x |
,
��| }
new��~ �
UserMessage��� �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
��  !
}
�� 
}
�� 
}
�� 
}
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
agreementTypeList
��g x
,
��x y
null
��z ~
)
��~ 
;�� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
}
�� 
}�� ��
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Controllers\AuthenticationController.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Controllers (
{ 
[ 
Route 

(
 
$str &
)& '
]' (
[ 
	Authorize 
( !
AuthenticationSchemes $
=% &
JwtBearerDefaults' 8
.8 9 
AuthenticationScheme9 M
)M N
]N O
public 

class $
AuthenticationController )
:* +

Controller, 6
{ 
private 
readonly 
UserManager $
<$ %
ApplicationUser% 4
>4 5
_userManager6 B
;B C
private 
readonly 
SignInManager &
<& '
ApplicationUser' 6
>6 7
_signInManager8 F
;F G
private 
readonly $
IHttpsResponseRepository 1%
_iHttpsResponseRepository2 K
;K L
private 
readonly 
ILogger  
<  !$
AuthenticationController! 9
>9 :
_logger; B
;B C
private 
readonly #
IConfigurationDbContext 0#
_configurationDbContext1 H
;H I
private   
readonly   
IUserRepository   (
_iUserRepository  ) 9
;  9 :
private!! 
readonly!! "
IDynamicMessageService!! /"
_dynamicMessageService!!0 F
;!!F G
public$$ $
AuthenticationController$$ '
($$' (
UserManager%% 
<%% 
ApplicationUser%% '
>%%' (
userManager%%) 4
,%%4 5
SignInManager&& 
<&& 
ApplicationUser&& )
>&&) *
signInManager&&+ 8
,&&8 9$
IHttpsResponseRepository'' $$
iHttpsResponseRepository''% =
,''= >
ILogger(( 
<(( $
AuthenticationController(( ,
>((, -
logger((. 4
,((4 5#
IConfigurationDbContext)) #"
configurationDbContext))$ :
,)): ;
IUserRepository** 
iUserRepository** +
,**+ ,"
IDynamicMessageService++ "!
dynamicMessageService++# 8
)++8 9
{,, 	
_userManager-- 
=-- 
userManager-- &
;--& '
_signInManager.. 
=.. 
signInManager.. *
;..* +%
_iHttpsResponseRepository// %
=//& '$
iHttpsResponseRepository//( @
;//@ A
_logger00 
=00 
logger00 
;00 #
_configurationDbContext11 #
=11$ %"
configurationDbContext11& <
;11< =
_iUserRepository22 
=22 
iUserRepository22 .
;22. /"
_dynamicMessageService33 "
=33# $!
dynamicMessageService33% :
;33: ;
}44 	
[;; 	
HttpPost;;	 
];; 
public<< 
async<< 
Task<< 
<<< 
IActionResult<< '
><<' (%
ValidateClientUserMapping<<) B
(<<B C
[<<C D
FromBody<<D L
]<<L M%
ClientUserMappingStatusVM<<N g
model<<h m
)<<m n
{== 	
ServicePointManager>> 
.>>  
Expect100Continue>>  1
=>>2 3
true>>4 8
;>>8 9
ServicePointManager?? 
.??  
SecurityProtocol??  0
=??1 2 
SecurityProtocolType??3 G
.??G H
Tls??H K
|@@  
SecurityProtocolType@@ "
.@@" #
Tls11@@# (
|AA  
SecurityProtocolTypeAA "
.AA" #
Tls12AA# (
;AA( )
tryCC 
{DD 
ifEE 
(EE 
modelEE 
.EE 
UserIdEE  
==EE! #
nullEE$ (
)EE( )
{FF 
varGG 
invalidParameterMSGGG +
=GG, -
awaitGG. 3"
_dynamicMessageServiceGG4 J
.GGJ K
GetGGK N
(GGN O
INVALID_PARAMETERGGO `
)GG` a
;GGa b
returnHH %
_iHttpsResponseRepositoryHH 4
.HH4 5
ReturnResultHH5 A
(HHA B
APIStatusCodeHHB O
.HHO P
ERRORHHP U
,HHU V
APIStateHHW _
.HH_ `
FAILEDHH` f
,HHf g
nullHHh l
,HHl m
newHHn q
UserMessageHHr }
(HH} ~
)HH~ 
{
HH� �
messageContent
HH� �
=
HH� �
new
HH� �
MessageContent
HH� �
{
HH� �
messageType
HH� �
=
HH� �!
invalidParameterMSG
HH� �
.
HH� �
messageType
HH� �
,
HH� �
messageCode
HH� �
=
HH� �!
invalidParameterMSG
HH� �
.
HH� �
messageCode
HH� �
,
HH� �
message
HH� �
=
HH� �!
invalidParameterMSG
HH� �
.
HH� �
message
HH� �
}
HH� �
}
HH� �
)
HH� �
;
HH� �
}II 
elseJJ 
{KK 
stringLL 
ClintIdLL "
=LL# $
stringLL% +
.LL+ ,
EmptyLL, 1
;LL1 2
varMM 
ClintMM 
=MM 
awaitMM  %#
_configurationDbContextMM& =
.MM= >
ClientsMM> E
.MME F
FirstOrDefaultAsyncMMF Y
(MMY Z
xMMZ [
=>MM\ ^
xMM_ `
.MM` a

ClientNameMMa k
==MMl n
modelMMo t
.MMt u
ClaimMMu z
)MMz {
;MM{ |
ifOO 
(OO 
ClintOO 
!=OO  
nullOO! %
)OO% &
{OO' (
ClintIdOO) 0
=OO1 2
ClintOO3 8
.OO8 9
ClientIdOO9 A
;OOA B
}OOC D
ifQQ 
(QQ 
awaitQQ 
_iUserRepositoryQQ .
.QQ. /.
"ClientUserMappingAvailabilityStausQQ/ Q
(QQQ R
modelQQR W
.QQW X
UserIdQQX ^
,QQ^ _
ClintIdQQ` g
)QQg h
)QQh i
{RR 
varSS 
responseObjSS '
=SS( )
awaitSS* /
CheckAutoLogoutSS0 ?
(SS? @
)SS@ A
asSSB D
OkObjectResultSSE S
;SSS T
varTT 
responseTT $
=TT% &
(TT' (
ApiResponseTT( 3
)TT3 4
responseObjTT4 ?
.TT? @
ValueTT@ E
;TTE F
responseVV  
.VV  !
dataVV! %
=VV& '
$strVV( 9
;VV9 :
returnWW 
newWW "
OkObjectResultWW# 1
(WW1 2
responseWW2 :
)WW: ;
;WW; <
}XX 
elseYY 
{ZZ 
return[[ %
_iHttpsResponseRepository[[ 8
.[[8 9
ReturnResult[[9 E
([[E F
APIStatusCode[[F S
.[[S T
ERROR[[T Y
,[[Y Z
APIState[[[ c
.[[c d
FAILED[[d j
,[[j k
null[[l p
,[[p q
null[[r v
)[[v w
;[[w x
}\\ 
}]] 
}^^ 
catch__ 
(__ 
	Exception__ 
e__ 
)__ 
{`` 
_loggeraa 
.aa 
LogErroraa  
(aa  !
eaa! "
.aa" #
ToStringaa# +
(aa+ ,
)aa, -
)aa- .
;aa. /
returnbb 
awaitbb %
_iHttpsResponseRepositorybb 6
.bb6 7#
ReturnExceptionResponsebb7 N
(bbN O
ebbO P
)bbP Q
;bbQ R
}cc 
}dd 	
[jj 	
HttpGetjj	 
]jj 
publickk 
asynckk 
Taskkk 
<kk 
IActionResultkk '
>kk' (
CheckAutoLogoutkk) 8
(kk8 9
)kk9 :
{ll 	
trymm 
{nn 
stringoo 
useridoo 
=oo 
stringoo  &
.oo& '
Emptyoo' ,
;oo, -
stringpp 
identityUserIdpp %
=pp& '
HttpContextpp( 3
.pp3 4
Userpp4 8
.pp8 9
Claimspp9 ?
.pp? @
Countpp@ E
(ppE F
)ppF G
!=ppH J
$numppK L
?ppM N
HttpContextppO Z
.ppZ [
Userpp[ _
.pp_ `
	FindFirstpp` i
(ppi j

ClaimTypesppj t
.ppt u
NameIdentifier	ppu �
)
pp� �
.
pp� �
Value
pp� �
:
pp� �
null
pp� �
;
pp� �
ifqq 
(qq 
identityUserIdqq "
==qq# %
nullqq& *
)qq* +
{rr 
varss 
somethingWrongMSGss )
=ss* +
awaitss, 1"
_dynamicMessageServicess2 H
.ssH I
GetssI L
(ssL M
SOMTHING_WRONGssM [
)ss[ \
;ss\ ]
returntt %
_iHttpsResponseRepositorytt 4
.tt4 5
ReturnResulttt5 A
(ttA B
APIStatusCodettB O
.ttO P
ERRORttP U
,ttU V
APIStatettW _
.tt_ `
FAILEDtt` f
,ttf g
nulltth l
,ttl m
newttn q
UserMessagettr }
(tt} ~
)tt~ 
{
tt� �
messageContent
tt� �
=
tt� �
new
tt� �
MessageContent
tt� �
{
tt� �
messageType
tt� �
=
tt� �
somethingWrongMSG
tt� �
.
tt� �
messageType
tt� �
,
tt� �
messageCode
tt� �
=
tt� �
somethingWrongMSG
tt� �
.
tt� �
messageCode
tt� �
,
tt� �
message
tt� �
=
tt� �
somethingWrongMSG
tt� �
.
tt� �
message
tt� �
}
tt� �
}
tt� �
)
tt� �
;
tt� �
}uu 
varww 
userTempww 
=ww 
awaitww $
_userManagerww% 1
.ww1 2
FindByIdAsyncww2 ?
(ww? @
identityUserIdww@ N
)wwN O
;wwO P
ifxx 
(xx 
userTempxx 
.xx 
changePasswordAtxx -
.xx- .
HasValuexx. 6
)xx6 7
{yy 
var{{ 
	timeStamp{{ !
={{" #
HttpContext{{$ /
.{{/ 0
User{{0 4
.{{4 5
Claims{{5 ;
.{{; <
Count{{< A
({{A B
){{B C
!={{D F
$num{{G H
?{{I J
HttpContext{{K V
.{{V W
User{{W [
.{{[ \
FindFirstValue{{\ j
({{j k
$str{{k p
){{p q
:{{r s
null{{t x
;{{x y
if|| 
(|| 
	timeStamp|| !
==||" $
null||% )
)||) *
{}} 
var~~ 
somethingWrongMSG~~ -
=~~. /
await~~0 5"
_dynamicMessageService~~6 L
.~~L M
Get~~M P
(~~P Q
SOMTHING_WRONG~~Q _
)~~_ `
;~~` a
return %
_iHttpsResponseRepository 8
.8 9
ReturnResult9 E
(E F
APIStatusCodeF S
.S T
ERRORT Y
,Y Z
APIState[ c
.c d
FAILEDd j
,j k
nulll p
,p q
newr u
UserMessage	v �
(
� �
)
� �
{
� �
messageContent
� �
=
� �
new
� �
MessageContent
� �
{
� �
messageType
� �
=
� �
somethingWrongMSG
� �
.
� �
messageType
� �
,
� �
messageCode
� �
=
� �
somethingWrongMSG
� �
.
� �
messageCode
� �
,
� �
message
� �
=
� �
somethingWrongMSG
� �
.
� �
message
� �
}
� �
}
� �
)
� �
;
� �
}
�� 
long
�� 
.
�� 
TryParse
�� !
(
��! "
	timeStamp
��" +
,
��+ ,
out
��- 0
long
��1 5
longTimeStamp
��6 C
)
��C D
;
��D E
DateTime
�� 
tokenCreationdate
�� .
=
��/ 0
new
��1 4
DateTime
��5 =
(
��= >
$num
��> B
,
��B C
$num
��D E
,
��E F
$num
��G H
,
��H I
$num
��J K
,
��K L
$num
��M N
,
��N O
$num
��P Q
,
��Q R
$num
��S T
,
��T U
System
��V \
.
��\ ]
DateTimeKind
��] i
.
��i j
Utc
��j m
)
��m n
;
��n o
tokenCreationdate
�� %
=
��& '
tokenCreationdate
��( 9
.
��9 :

AddSeconds
��: D
(
��D E
longTimeStamp
��E R
)
��R S
.
��S T
ToUniversalTime
��T c
(
��c d
)
��d e
;
��e f
int
�� 
isValid
�� 
=
��  !
DateTime
��" *
.
��* +
Compare
��+ 2
(
��2 3
tokenCreationdate
��3 D
,
��D E
userTemp
��F N
.
��N O
changePasswordAt
��O _
.
��_ `
Value
��` e
)
��e f
;
��f g
if
�� 
(
�� 
isValid
�� 
>
��  !
$num
��" #
)
��# $
{
�� 
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
SUCCESS
��T [
,
��[ \
APIState
��] e
.
��e f
SUCCESS
��f m
,
��m n
null
��o s
,
��s t
null
��u y
)
��y z
;
��z {
}
�� 
else
�� 
{
�� 
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
UNAUTHORIZED
��T `
,
��` a
APIState
��b j
.
��j k
SUCCESS
��k r
,
��r s
null
��t x
,
��x y
null
��z ~
)
��~ 
;�� �
}
�� 
}
�� 
else
�� 
{
�� 
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
null
��k o
,
��o p
null
��q u
)
��u v
;
��v w
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
HttpGet
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
SetSuperAdmin
��) 6
(
��6 7
string
��7 =
userId
��> D
,
��D E
bool
��F J
isSuperAdmin
��K W
)
��W X
{
�� 	
if
�� 
(
�� 
userId
�� 
==
�� 
null
�� 
)
�� 
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
var
�� 
userTemp
�� 
=
�� 
await
�� $
_userManager
��% 1
.
��1 2
FindByIdAsync
��2 ?
(
��? @
userId
��@ F
)
��F G
;
��G H
if
�� 
(
�� 
userTemp
�� 
==
�� 
null
��  $
)
��$ %
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �
USER_ENTITY��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
userTemp
�� 
.
�� 
isSuperAdmin
�� %
=
��& '
isSuperAdmin
��( 4
;
��4 5
await
�� 
_userManager
�� "
.
��" #
UpdateAsync
��# .
(
��. /
userTemp
��/ 7
)
��7 8
;
��8 9
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
null
��g k
,
��k l
null
��m q
)
��q r
;
��r s
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
}
�� 
}�� �U
BD:\Development\FJT\FJT-DEV\FJT.IdentityServer\CryptoJS\CryptoJs.cs
	namespace

 	
FJT


 
.

 
IdentityServer

 
.

 
CryptoJS

 %
{ 
public 

class 
CryptoJs 
{ 
private 
static 
string "
DecryptStringFromBytes 4
(4 5
byte5 9
[9 :
]: ;

cipherText< F
,F G
byteH L
[L M
]M N
keyO R
,R S
byteT X
[X Y
]Y Z
iv[ ]
)] ^
{ 	
if 
( 

cipherText 
== 
null "
||# %

cipherText& 0
.0 1
Length1 7
<=8 :
$num; <
)< =
throw 
new !
ArgumentNullException /
(/ 0
$str0 <
)< =
;= >
if 
( 
key 
== 
null 
|| 
key "
." #
Length# )
<=* ,
$num- .
). /
throw 
new !
ArgumentNullException /
(/ 0
$str0 5
)5 6
;6 7
if 
( 
iv 
== 
null 
|| 
iv  
.  !
Length! '
<=( *
$num+ ,
), -
throw 
new !
ArgumentNullException /
(/ 0
$str0 5
)5 6
;6 7
string 
	plaintext 
= 
null #
;# $
using 
( 
var 
rijAlg 
= 
new  #
RijndaelManaged$ 3
(3 4
)4 5
)5 6
{ 
rijAlg 
. 
Mode 
= 

CipherMode (
.( )
CBC) ,
;, -
rijAlg 
. 
Padding 
=  
PaddingMode! ,
., -
PKCS7- 2
;2 3
rijAlg 
. 
FeedbackSize #
=$ %
$num& )
;) *
rijAlg   
.   
Key   
=   
key    
;    !
rijAlg!! 
.!! 
IV!! 
=!! 
iv!! 
;!! 
var"" 
	decryptor"" 
="" 
rijAlg""  &
.""& '
CreateDecryptor""' 6
(""6 7
rijAlg""7 =
.""= >
Key""> A
,""A B
rijAlg""C I
.""I J
IV""J L
)""L M
;""M N
try## 
{$$ 
using%% 
(%% 
var%% 
	msDecrypt%% (
=%%) *
new%%+ .
MemoryStream%%/ ;
(%%; <

cipherText%%< F
)%%F G
)%%G H
{&& 
using'' 
('' 
var'' "
	csDecrypt''# ,
=''- .
new''/ 2
CryptoStream''3 ?
(''? @
	msDecrypt''@ I
,''I J
	decryptor''K T
,''T U
CryptoStreamMode''V f
.''f g
Read''g k
)''k l
)''l m
{(( 
using)) !
())" #
var))# &
	srDecrypt))' 0
=))1 2
new))3 6
StreamReader))7 C
())C D
	csDecrypt))D M
)))M N
)))N O
{** 
	plaintext++  )
=++* +
	srDecrypt++, 5
.++5 6
	ReadToEnd++6 ?
(++? @
)++@ A
;++A B
},, 
}-- 
}.. 
}// 
catch00 
{11 
	plaintext22 
=22 
$str22  *
;22* +
}33 
}44 
return55 
	plaintext55 
;55 
}66 	
public88 
static88 
byte88 
[88 
]88  
EncryptStringToBytes88 1
(881 2
string882 8
	plainText889 B
,88B C
byte88D H
[88H I
]88I J
key88K N
,88N O
byte88P T
[88T U
]88U V
iv88W Y
)88Y Z
{99 	
if:: 
(:: 
	plainText:: 
==:: 
null:: !
||::" $
	plainText::% .
.::. /
Length::/ 5
<=::6 8
$num::9 :
)::: ;
throw;; 
new;; !
ArgumentNullException;; /
(;;/ 0
$str;;0 ;
);;; <
;;;< =
if<< 
(<< 
key<< 
==<< 
null<< 
||<< 
key<< "
.<<" #
Length<<# )
<=<<* ,
$num<<- .
)<<. /
throw== 
new== !
ArgumentNullException== /
(==/ 0
$str==0 5
)==5 6
;==6 7
if>> 
(>> 
iv>> 
==>> 
null>> 
||>> 
iv>>  
.>>  !
Length>>! '
<=>>( *
$num>>+ ,
)>>, -
throw?? 
new?? !
ArgumentNullException?? /
(??/ 0
$str??0 5
)??5 6
;??6 7
byte@@ 
[@@ 
]@@ 
	encrypted@@ 
;@@ 
usingAA 
(AA 
varAA 
rijAlgAA 
=AA 
newAA  #
RijndaelManagedAA$ 3
(AA3 4
)AA4 5
)AA5 6
{BB 
rijAlgCC 
.CC 
ModeCC 
=CC 

CipherModeCC (
.CC( )
CBCCC) ,
;CC, -
rijAlgDD 
.DD 
PaddingDD 
=DD  
PaddingModeDD! ,
.DD, -
PKCS7DD- 2
;DD2 3
rijAlgEE 
.EE 
FeedbackSizeEE #
=EE$ %
$numEE& )
;EE) *
rijAlgFF 
.FF 
KeyFF 
=FF 
keyFF  
;FF  !
rijAlgGG 
.GG 
IVGG 
=GG 
ivGG 
;GG 
varHH 
	encryptorHH 
=HH 
rijAlgHH  &
.HH& '
CreateEncryptorHH' 6
(HH6 7
rijAlgHH7 =
.HH= >
KeyHH> A
,HHA B
rijAlgHHC I
.HHI J
IVHHJ L
)HHL M
;HHM N
usingII 
(II 
varII 
	msEncryptII $
=II% &
newII' *
MemoryStreamII+ 7
(II7 8
)II8 9
)II9 :
{JJ 
usingKK 
(KK 
varKK 
	csEncryptKK (
=KK) *
newKK+ .
CryptoStreamKK/ ;
(KK; <
	msEncryptKK< E
,KKE F
	encryptorKKG P
,KKP Q
CryptoStreamModeKKR b
.KKb c
WriteKKc h
)KKh i
)KKi j
{LL 
usingMM 
(MM 
varMM "
	swEncryptMM# ,
=MM- .
newMM/ 2
StreamWriterMM3 ?
(MM? @
	csEncryptMM@ I
)MMI J
)MMJ K
{NN 
	swEncryptOO %
.OO% &
WriteOO& +
(OO+ ,
	plainTextOO, 5
)OO5 6
;OO6 7
}PP 
	encryptedQQ !
=QQ" #
	msEncryptQQ$ -
.QQ- .
ToArrayQQ. 5
(QQ5 6
)QQ6 7
;QQ7 8
}RR 
}SS 
}TT 
returnUU 
	encryptedUU 
;UU 
}VV 	
publicXX 
staticXX 
stringXX 
DecryptStringAESXX -
(XX- .
stringXX. 4

cipherTextXX5 ?
)XX? @
{YY 	
varZZ  
AESEncryptDecryptKeyZZ $
=ZZ% &
ConstantZZ' /
.ZZ/ 0
AESSecretKeyZZ0 <
;ZZ< =
var[[ 
keybytes[[ 
=[[ 
Encoding[[ #
.[[# $
UTF8[[$ (
.[[( )
GetBytes[[) 1
([[1 2 
AESEncryptDecryptKey[[2 F
)[[F G
;[[G H
var\\ 
iv\\ 
=\\ 
Encoding\\ 
.\\ 
UTF8\\ "
.\\" #
GetBytes\\# +
(\\+ , 
AESEncryptDecryptKey\\, @
)\\@ A
;\\A B
var]] 
	encrypted]] 
=]] 
Convert]] #
.]]# $
FromBase64String]]$ 4
(]]4 5

cipherText]]5 ?
)]]? @
;]]@ A
var^^ #
decriptedFromJavascript^^ '
=^^( )"
DecryptStringFromBytes^^* @
(^^@ A
	encrypted^^A J
,^^J K
keybytes^^L T
,^^T U
iv^^V X
)^^X Y
;^^Y Z
return__ 
string__ 
.__ 
Format__  
(__  !#
decriptedFromJavascript__! 8
)__8 9
;__9 :
}`` 	
publicbb 
staticbb 
stringbb 
Encryptbb $
(bb$ %
stringbb% +
originalbb, 4
)bb4 5
{cc 	
usingdd 
(dd 
RijndaelManageddd "

myRijndaeldd# -
=dd. /
newdd0 3
RijndaelManageddd4 C
(ddC D
)ddD E
)ddE F
{ee 

myRijndaelgg 
.gg 
Modegg 
=gg  !

CipherModegg" ,
.gg, -
CBCgg- 0
;gg0 1

myRijndaelhh 
.hh 
Paddinghh "
=hh# $
PaddingModehh% 0
.hh0 1
PKCS7hh1 6
;hh6 7

myRijndaelii 
.ii 
FeedbackSizeii '
=ii( )
$numii* -
;ii- .
bytekk 
[kk 
]kk 
keybyteskk 
=kk  !
Encodingkk" *
.kk* +
UTF8kk+ /
.kk/ 0
GetByteskk0 8
(kk8 9
Constantkk9 A
.kkA B
AESSecretKeykkB N
)kkN O
;kkO P
bytemm 
[mm 
]mm 
ivmm 
=mm 
Encodingmm $
.mm$ %
UTF8mm% )
.mm) *
GetBytesmm* 2
(mm2 3
Constantmm3 ;
.mm; <
AESSecretKeymm< H
)mmH I
;mmI J
bytepp 
[pp 
]pp 
	encryptedpp  
=pp! " 
EncryptStringToBytespp# 7
(pp7 8
originalpp8 @
,pp@ A
keybytesppB J
,ppJ K
ivppL N
)ppN O
;ppO P
stringss 
encryptedStringss &
=ss' (
Convertss) 0
.ss0 1
ToBase64Stringss1 ?
(ss? @
	encryptedss@ I
)ssI J
;ssJ K
returntt 
encryptedStringtt &
;tt& '
}uu 
}vv 	
}ww 
}xx �&
KD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\DataMapper\DataMapper.cs
	namespace

 	
FJT


 
.

 
IdentityServer

 
.

 
Data

 !
.

! "

DataMapper

" ,
{ 
public 

class 

DataMapper 
: 
IDataMapper )
{ 
public  
AgreementListDetails #&
AgreementListDetailsMapper$ >
(> ?
DbDataReader? K
readerL R
)R S
{ 	
var 
result 
= 
new  
AgreementListDetails 1
{ 
	SpCountVM 
= 
reader "
." #
	Translate# ,
<, -
	SpCountVM- 6
>6 7
(7 8
)8 9
,9 :
agreementListVMs  
=! "
reader# )
.) *
	Translate* 3
<3 4
AgreementListVM4 C
>C D
(D E
)E F
} 
; 
return 
result 
; 
} 	
public %
GetAgreementDetailDetails (+
GetAgreementDetailDetailsMapper) H
(H I
DbDataReaderI U
readerV \
)\ ]
{ 	
var   
result   
=   
new   %
GetAgreementDetailDetails   6
{!! 
GetAgreementDetails"" #
=""$ %
reader""& ,
."", -
	Translate""- 6
<""6 7
GetAgreementDetail""7 I
>""I J
(""J K
)""K L
}## 
;## 
return$$ 
result$$ 
;$$ 
}%% 	
public'' *
UserSignUpAgreementListDetails'' -0
$UserSignUpAgreementListDetailsMapper''. R
(''R S
DbDataReader''S _
reader''` f
)''f g
{(( 	
var)) 
result)) 
=)) 
new)) *
UserSignUpAgreementListDetails)) ;
{** 
	SpCountVM,, 
=,, 
reader,, "
.,," #
	Translate,,# ,
<,,, -
	SpCountVM,,- 6
>,,6 7
(,,7 8
),,8 9
,,,9 :$
UserSignUpAgreementLists// (
=//) *
reader//+ 1
.//1 2
	Translate//2 ;
<//; <#
UserSignUpAgreementList//< S
>//S T
(//T U
)//U V
}00 
;00 
return11 
result11 
;11 
}22 	
public44 -
!ArchieveVersionDetailsListDetails44 03
'ArchieveVersionDetailsListDetailsMapper441 X
(44X Y
DbDataReader44Y e
reader44f l
)44l m
{55 	
var66 
result66 
=66 
new66 -
!ArchieveVersionDetailsListDetails66 >
{77 
	SpCountVM99 
=99 
reader99 "
.99" #
	Translate99# ,
<99, -
	SpCountVM99- 6
>996 7
(997 8
)998 9
,999 :'
ArchieveVersionDetailsLists<< +
=<<, -
reader<<. 4
.<<4 5
	Translate<<5 >
<<<> ?&
ArchieveVersionDetailsList<<? Y
><<Y Z
(<<Z [
)<<[ \
}== 
;== 
return>> 
result>> 
;>> 
}?? 	
publicAA &
GetAgreedUserListVMDetailsAA ),
 GetAgreedUserListVMDetailsMapperAA* J
(AAJ K
DbDataReaderAAK W
readerAAX ^
)AA^ _
{BB 	
varCC 
resultCC 
=CC 
newCC &
GetAgreedUserListVMDetailsCC 7
{DD 
	SpCountVMFF 
=FF 
readerFF "
.FF" #
	TranslateFF# ,
<FF, -
	SpCountVMFF- 6
>FF6 7
(FF7 8
)FF8 9
,FF9 : 
GetAgreedUserListVMsII $
=II% &
readerII' -
.II- .
	TranslateII. 7
<II7 8
GetAgreedUserListVMII8 K
>IIK L
(IIL M
)IIM N
}JJ 
;JJ 
returnKK 
resultKK 
;KK 
}LL 	
publicNN -
!DownloadAgreementDetailsVMDetailsNN 03
'DownloadAgreementDetailsVMDetailsMapperNN1 X
(NNX Y
DbDataReaderNNY e
readerNNf l
)NNl m
{OO 	
varPP 
resultPP 
=PP 
newPP -
!DownloadAgreementDetailsVMDetailsPP >
{QQ '
DownloadAgreementDetailsVMsRR +
=RR, -
readerRR. 4
.RR4 5
	TranslateRR5 >
<RR> ?&
DownloadAgreementDetailsVMRR? Y
>RRY Z
(RRZ [
)RR[ \
}SS 
;SS 
returnTT 
resultTT 
;TT 
}UU 	
}VV 
}WW ��
BD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\DbInitialize.cs
	namespace		 	
FJT		
 
.		 
IdentityServer		 
.		 
Data		 !
{

 
public 

static 
class 
DbInitialize $
{ 
private 
static  
FJTIdentityDbContext +
_db, /
;/ 0
private 
static 
string 
FJTMainDBName +
=, -
string. 4
.4 5
Empty5 :
;: ;
private 
static 
string 
IdentityDBName ,
=- .
string/ 5
.5 6
Empty6 ;
;; <
public 
static 
void 

Initialize %
(% & 
FJTIdentityDbContext& :
context; B
,B C!
IConfigurationSectionD Y
databaseNamesZ g
)g h
{ 	
FJTMainDBName 
= 
databaseNames )
.) *
GetValue* 2
(2 3
typeof3 9
(9 :
string: @
)@ A
,A B
$strC N
)N O
.O P
ToStringP X
(X Y
)Y Z
;Z [
IdentityDBName 
= 
databaseNames *
.* +
GetValue+ 3
(3 4
typeof4 :
(: ;
string; A
)A B
,B C
$strD P
)P Q
.Q R
ToStringR Z
(Z [
)[ \
;\ ]
_db 
= 
context 
; 
_db 
. 
Database 
. 
EnsureCreated &
(& '
)' (
;( )*
Seed_fun_ApplyCommonDateFormat *
(* +
)+ ,
;, -7
+Seed_fun_ApplyLongDateTimeFormatByParaValue 7
(7 8
)8 9
;9 :9
-Seed_fun_ApplyCommonDateTimeFormatByParaValue 9
(9 :
): ;
;; <5
)Seed_fun_getLastAgreementPublishedVersion 5
(5 6
)6 7
;7 86
*Seed_fun_getDraftAgreementPublishedVersion 6
(6 7
)7 8
;8 9&
Seed_fun_getDateTimeFormat &
(& '
)' (
;( ) 
Seed_fun_getTimeZone    
(    !
)  ! "
;  " #-
!Seed_fun_getAgreementTypeNameById!! -
(!!- .
)!!. /
;!!/ 02
&Seed_fun_getLastAgreementPublishedDate"" 2
(""2 3
)""3 4
;""4 5-
!Seed_fun_getEmpployeeNameByUserID## -
(##- .
)##. /
;##/ 0(
Seed_Sproc_getAgreedUserList$$ (
($$( )
)$$) *
;$$* +*
Seed_Sproc_GetAgreementDetails%% *
(%%* +
)%%+ ,
;%%, -2
&Seed_Sproc_GetDownloadAgreementDetails&& 2
(&&2 3
)&&3 4
;&&4 5,
 Seed_Sproc_RetrieveAgreementList'' ,
('', -
)''- .
;''. /5
)Seed_Sproc_RetrieveArchieveVesrionDetails(( 5
(((5 6
)((6 7
;((7 86
*Seed_Sproc_RetrieveUserSignUpAgreementList)) 6
())6 7
)))7 8
;))8 9&
Seed_AgreementType_Records++ &
(++& '
)++' (
;++( )"
Seed_Agreement_Records,, "
(,," #
),,# $
;,,$ %,
 Seed_Systemconfigrations_Records.. ,
(.., -
)..- .
;... /
}// 	
private11 
static11 
void11 &
Seed_AgreementType_Records11 6
(116 7
)117 8
{22 	
var33 
script33 
=33 
$str3B +
;BB+ ,
_dbCC 
.CC 
ExecuteSqlCommandCC !
(CC! "
scriptCC" (
.CC( )
ReplaceCC) 0
(CC0 1
$strCC1 B
,CCB C
FJTMainDBNameCCD Q
)CCQ R
.CCR S
ReplaceCCS Z
(CCZ [
$strCC[ m
,CCm n
IdentityDBNameCCo }
)CC} ~
)CC~ 
;	CC �
}DD 	
privateFF 
staticFF 
voidFF "
Seed_Agreement_RecordsFF 2
(FF2 3
)FF3 4
{GG 	
varHH 
scriptHH 
=HH 
$strHX '
;XX' (
_dbYY 
.YY 
ExecuteSqlCommandYY !
(YY! "
scriptYY" (
.YY( )
ReplaceYY) 0
(YY0 1
$strYY1 B
,YYB C
FJTMainDBNameYYC P
)YYP Q
.YYQ R
ReplaceYYR Y
(YYY Z
$strYYZ l
,YYl m
IdentityDBNameYYn |
)YY| }
)YY} ~
;YY~ 
}ZZ 	
private\\ 
static\\ 
void\\ &
Seed_UserAgreement_Records\\ 6
(\\6 7
)\\7 8
{]] 	
var^^ 
script^^ 
=^^ 
$str^p +
;pp+ ,
_dbqq 
.qq 
ExecuteSqlCommandqq !
(qq! "
scriptqq" (
.qq( )
Replaceqq) 0
(qq0 1
$strqq1 B
,qqB C
FJTMainDBNameqqD Q
)qqQ R
.qqR S
ReplaceqqS Z
(qqZ [
$strqq[ m
,qqm n
IdentityDBNameqqo }
)qq} ~
)qq~ 
;	qq �
}rr 	
privatett 
statictt 
voidtt ,
 Seed_Systemconfigrations_Recordstt <
(tt< =
)tt= >
{uu 	
varvv 
scriptvv 
=vv 
$str	v� 
;
�� 
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
script
��" (
.
��( )
Replace
��) 0
(
��0 1
$str
��1 B
,
��B C
FJTMainDBName
��D Q
)
��Q R
.
��R S
Replace
��S Z
(
��Z [
$str
��[ m
,
��m n
IdentityDBName
��o }
)
��} ~
)
��~ 
;�� �
}
�� 	
private
�� 
static
�� 
void
�� 9
+Seed_fun_ApplyLongDateTimeFormatByParaValue
�� G
(
��G H
)
��H I
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" f
)
��f g
;
��g h
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� ,
Seed_fun_ApplyCommonDateFormat
�� :
(
��: ;
)
��; <
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" Y
)
��Y Z
;
��Z [
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� ;
-Seed_fun_ApplyCommonDateTimeFormatByParaValue
�� I
(
��I J
)
��J K
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" h
)
��h i
;
��i j
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� 7
)Seed_fun_getLastAgreementPublishedVersion
�� E
(
��E F
)
��F G
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" d
)
��d e
;
��e f
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� 8
*Seed_fun_getDraftAgreementPublishedVersion
�� F
(
��F G
)
��G H
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" e
)
��e f
;
��f g
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� (
Seed_fun_getDateTimeFormat
�� 6
(
��6 7
)
��7 8
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" U
)
��U V
;
��V W
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� "
Seed_fun_getTimeZone
�� 0
(
��0 1
)
��1 2
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" O
)
��O P
;
��P Q
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� /
!Seed_fun_getAgreementTypeNameById
�� =
(
��= >
)
��> ?
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" \
)
��\ ]
;
��] ^
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� 4
&Seed_fun_getLastAgreementPublishedDate
�� B
(
��B C
)
��C D
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" a
)
��a b
;
��b c
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� /
!Seed_fun_getEmpployeeNameByUserID
�� =
(
��= >
)
��> ?
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" \
)
��\ ]
;
��] ^
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" 
)
�� 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� *
Seed_Sproc_getAgreedUserList
�� 8
(
��8 9
)
��9 :
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" X
)
��X Y
;
��Y Z
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" e
+
��f g
$str�� I
+
��J K
$str�� M
+
��N O
$str�� P
+
��Q R
$str�� 6
+
��7 8
$str�� 2
+
��3 4
$str�� 0
+
��1 2
$str�� 
+
�� 	
$str�� 
+
�� 
$str�� ?
+
��@ A
$str�� B
+
��C D
$str�� U
+
��V W
$str�� :
+
��; <
$str�� 
+
�� 
$str�� H
+
��I J
$str�� S
+
��T U
$str�� J
+
��K L
$str�� +
+
��, -
$str�� B
+
��C D
$str�� 
+
�� 
$str�� %
+
��& '
$str�� ,
+
��- .
$str�� '
+
��( )
$str�� <
+
��= >
$str�� 2
+
��3 4
$str�� 0
+
��1 2
$str�� u
+
��v w
$str�� o
+
��p q
$str	�� �
+��� �
$str	�� �
+��� �
$str�� 5
+
��6 7
$str�� S
+
��T U
$str�� 8
+
��9 :
$str	�� �
+��� �
$str�� #
+
��$ %
$str�� 
+
�� 
$str�� t
+
��u v
$str	�� �
+��� �
$str�� M
+
��N O
$str�� |
+
��} ~
$str�� Q
+
��R S
$str�� 
+
�� 
$str�� ]
+
��^ _
$str�� H
+
��I J
$str�� 
+
�� 
$str�� 
+
�� 
$str�� 8
+
��9 :
$str�� e
+
��f g
$str�� 
+
�� 
$str�� 
+
�� 
$str�� z
+
��{ |
$str�� |
+
��} ~
$str	�� �
+��� �
$str�� N
+
��O P
$str�� _
+
��` a
$str�� &
+
��' (
$str�� 
+
�� 
$str	�� �
+��� �
$str�� ^
+
��_ `
$str�� J
+
��K L
$str�� 9
+
��: ;
$str�� 
+
�� 
$str	�� �
+��� �
$str�� ^
+
��_ `
$str�� ?
+
��@ A
$str�� 9
+
��: ;
$str�� 
+
�� 
$str�� 

)
��
 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� ,
Seed_Sproc_GetAgreementDetails
�� :
(
��: ;
)
��; <
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" Z
)
��Z [
;
��[ \
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" [
+
��\ ]
$str�� 
+
�� 
$str�� 
+
�� 	
$str�� 
+
�� 
$str�� 
+
�� 
$str�� 
+
�� 
$str�� I
+
��J K
$str�� m
+
��n o
$str�� V
+
��W X
$str�� P
+
��Q R
$str�� "
+
��# $
$str�� N
+
��O P
$str�� 

)
��
 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� 4
&Seed_Sproc_GetDownloadAgreementDetails
�� B
(
��B C
)
��C D
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" b
)
��b c
;
��c d
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" a
+
��b c
$str�� ,
+
��- .
$str�� %
+
��& '
$str�� 
+
�� 	
$str�� 
+
�� 
$str�� /
+
��0 1
$str�� ,
+
��- .
$str�� 6
+
��7 8
$str�� 4
+
��5 6
$str�� 
+
�� 
$str	�� �
+��� �
$str�� 2
+
��3 4
$str�� !
+
��" #
$str�� x
+
��y z
$str	�� �
+��� �
$str�� 2
+
��3 4
$str�� 
+
�� 
$str�� 
+
��  !
$str�� %
+
��& '
$str�� (
+
��) *
$str�� k
+
��l m
$str�� e
+
��f g
$str�� /
+
��0 1
$str�� K
+
��L M
$str	�� �
+��� �
$str�� 
+
�� 
$str�� 3
+
��4 5
$str�� 
+
��  !
$str�� x
+
��y z
$str	�� �
+��� �
$str�� 
+
�� 
$str�� 
+
��  
$str�� -
+
��. /
$str�� j
+
��k l
$str�� /
+
��0 1
$str�� S
+
��T U
$str�� }
+
��~ 
$str�� 
+
�� 
$str�� 
+
�� 
$str�� [
+
��\ ]
$str�� 9
+
��: ;
$str�� 3
+
��4 5
$str�� 
+
�� 
$str�� 

)
��
 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� .
 Seed_Sproc_RetrieveAgreementList
�� <
(
��< =
)
��= >
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" \
)
��\ ]
;
��] ^
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" c
+
��d e
$str�� C
+
��D E
$str�� G
+
��H I
$str�� J
+
��K L
$str�� 0
+
��1 2
$str�� 0
+
��1 2
$str�� )
+
��* +
$str�� 
+
�� 	
$str�� 
+
�� 
$str�� 
+
�� 
$str�� 9
+
��: ;
$str�� <
+
��= >
$str�� O
+
��P Q
$str�� 4
+
��5 6
$str�� 
+
�� 
$str�� E
+
��F G
$str�� U
+
��V W
$str�� 
+
�� 
$str�� K
+
��L M
$str�� .
+
��/ 0
$str�� 6
+
��7 8
$str�� B
+
��C D
$str�� .
+
��/ 0
$str�� +
+
��, -
$str��  
+
��! "
$str�� 1
+
��2 3
$str�� [
+
��\ ]
$str�� z
+
��{ |
$str	�� �
+��� �
$str�� U
+
��V W
$str�� g
+
��h i
$str�� .
+
��/ 0
$str�� A
+
��B C
$str�� Y
+
��Z [
$str�� b
+
��c d
$str�� S
+
��T U
$str�� e
+
��f g
$str�� :
+
��; <
$str�� 9
+
��: ;
$str�� 7
+
��8 9
$str�� -
+
��. /
$str�� I
+
��J K
$str�� I
+
��J K
$str�� Q
+
��R S
$str�� D
+
��E F
$str	�� �
+��� �
$str	�� �
+��� �
$str�� +
+
��, -
$str	�� �
+��� �
$str�� n
+
��o p
$str�� 9
+
��: ;
$str�� ?
+
��@ A
$str�� *
+
��+ ,
$str�� 
+
�� 
$str�� 
+
�� 
$str�� n
+
��o p
$str�� ~
+�� �
$str�� G
+
��H I
$str�� v
+
��w x
$str�� K
+
��L M
$str�� 
+
�� 
$str�� W
+
��X Y
$str�� B
+
��C D
$str�� 
+
�� 
$str�� 
+
�� 
$str�� N
+
��O P
$str�� u
+
��v w
$str�� 
+
�� 
$str�� 
+
�� 
$str�� t
+
��u v
$str�� v
+
��w x
$str	�� �
+��� �
$str�� H
+
��I J
$str�� Y
+
��Z [
$str��  
+
��! "
$str�� 
+
�� 
$str	�� �
+��� �
$str�� Z
+
��[ \
$str�� E
+
��F G
$str�� 4
+
��5 6
$str�� 
+
�� 
$str	�� �
+��� �
$str�� X
+
��Y Z
$str�� 9
+
��: ;
$str�� 3
+
��4 5
$str�� 
+
�� 
$str�� 

)
��
 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� 7
)Seed_Sproc_RetrieveArchieveVesrionDetails
�� E
(
��E F
)
��F G
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" e
)
��e f
;
��f g
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" p
+
��q r
$str�� G
+
��H I
$str�� K
+
��L M
$str�� N
+
��O P
$str�� 8
+
��9 :
$str�� +
+
��, -
$str�� ,
+
��- .
$str�� 
+
�� 	
$str�� 
+
�� 
$str�� =
+
��> ?
$str�� @
+
��A B
$str�� S
+
��T U
$str�� 8
+
��9 :
$str�� F
+
��G H
$str�� K
+
��L M
$str�� 
+
�� 
$str�� L
+
��M N
$str�� 5
+
��6 7
$str�� !
+
��" #
$str�� %
+
��& '
$str�� K
+
��L M
$str�� u
+
��v w
$str	�� �
+��� �
$str�� 1
+
��2 3
$str�� -
+
��. /
$str�� 
+
��  !
$str�� /
+
��0 1
$str�� *
+
��+ ,
$str�� r
+
��s t
$str�� 
+
�� 
$str�� 
+
�� 
$str�� r
+
��s t
$str�� |
+
��} ~
$str�� K
+
��L M
$str�� z
+
��{ |
$str�� O
+
��P Q
$str�� 
+
�� 
$str�� [
+
��\ ]
$str�� F
+
��G H
$str�� 
+
��  
$str�� 
+
�� 
$str�� x
+
��y z
$str�� z
+
��{ |
$str	�� �
+��� �
$str�� L
+
��M N
$str�� ]
+
��^ _
$str�� $
+
��% &
$str�� 
+
�� 
$str	�� �
+��� �
$str�� \
+
��] ^
$str�� H
+
��I J
$str�� 7
+
��8 9
$str	�� �
+��� �
$str�� \
+
��] ^
$str�� =
+
��> ?
$str�� 7
+
��8 9
$str�� 
+
�� 
$str�� 

)
��
 
;
�� 
}
�� 	
private
�� 
static
�� 
void
�� 8
*Seed_Sproc_RetrieveUserSignUpAgreementList
�� F
(
��F G
)
��G H
{
�� 	
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" f
)
��f g
;
��g h
_db
�� 
.
�� 
ExecuteSqlCommand
�� !
(
��! "
$str
��" t
+
��u v
$str�� +
+
��, -
$str�� /
+
��0 1
$str�� 2
+
��3 4
$str�� 8
+
��9 :
$str�� /
+
��0 1
$str�� 
+
�� 	
$str�� 
+
�� 
$str�� 
+
�� 
$str�� .
+
��/ 0
$str�� ;
+
��< =
$str�� G
+
��H I
$str�� 9
+
��: ;
$str�� C
+
��D E
$str�� V
+
��W X
$str�� U
+
��V W
$str�� +
+
��, -
$str�� +
+
��, -
$str�� -
+
��. /
$str�� +
+
��, -
$str�� 3
+
��4 5
$str	�� �
+��� �
$str�� +
+
��, -
$str�� 7
+
��8 9
$str�� &
+
��' (
$str	�� �
+��� �
$str�� {
+
��| }
$str�� i
+
��j k
$str�� X
+
��Y Z
$str�� Q
+
��R S
$str�� )
+
��* +
$str�� k
+
��l m
$str�� -
+
��. /
$str�� [
+
��\ ]
$str�� 6
+
��7 8
$str�� N
+
��O P
$str��  
+
��! "
$str�� E
+
��F G
$str�� M
+
��N O
$str�� 
+
��  
$str�� M
+
��N O
$str�� !
+
��" #
$str�� L
+
��M N
$str�� 7
+
��8 9
$str�� !
+
��" #
$str�� J
+
��K L
$str�� J
+
��K L
$str�� l
+
��m n
$str�� 
+
��  
$str�� 0
+
��1 2
$str�� !
+
��" #
$str	�� �
+��� �
$str�� >
+
��? @
$str�� *
+
��+ ,
$str�� 2
+
��3 4
$str�� 
+
�� 
$str	�� �
+��� �
$str�� =
+
��> ?
$str�� )
+
��* +
$str�� 4
+
��5 6
$str�� 

)
��
 
;
�� 
}
�� 	
}
�� 
}�� �#
JD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\FJTIdentityDbContext.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
{ 
public 

class  
FJTIdentityDbContext %
:& '
IdentityDbContext( 9
<9 :
ApplicationUser: I
,I J
ApplicationRoleK Z
,Z [
string\ b
>b c
,c d!
IFJTIdentityDbContexte z
{ 
public  
FJTIdentityDbContext #
(# $
DbContextOptions$ 4
<4 5 
FJTIdentityDbContext5 I
>I J
optionsK R
)R S
: 
base 
( 
options 
) 
{ 	
} 	
public 
DbSet 
< 
ClientUsersMapping '
>' (
ClientUsersMapping) ;
{< =
get> A
;A B
setC F
;F G
}H I
public 
DbSet 
< 
Feature 
> 
Feature %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
DbSet 
< 
Product 
> 
Product %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
DbSet 
< 
ApplicationUser $
>$ %
ApplicationUsers& 6
{7 8
get9 <
;< =
set> A
;A B
}C D
public 
DbSet 
< 
ApiScope 
> 
	ApiScopes (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
DbSet 
< 
ClientScope  
>  !
ClientScopes" .
{/ 0
get1 4
;4 5
set6 9
;9 :
}; <
public 
DbSet 
< 
	Agreement 
> 
	Agreement  )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
DbSet 
< 
AgreementType "
>" #
AgreementType$ 1
{2 3
get4 7
;7 8
set9 <
;< =
}> ?
public 
DbSet 
< 
UserAgreement "
>" #
UserAgreement$ 1
{2 3
get4 7
;7 8
set9 <
;< =
}> ?
public   
DbSet   
<   
Systemconfigrations   (
>  ( )
Systemconfigrations  * =
{  > ?
get  @ C
;  C D
set  E H
;  H I
}  J K
public"" 
async"" 
Task"" 
CustomSaveChanges"" +
(""+ ,
)"", -
{## 	
await$$ 
this$$ 
.$$ 
SaveChangesAsync$$ '
($$' (
)$$( )
;$$) *
}%% 	
public'' 
virtual'' 
void'' 
ExecuteSqlCommand'' -
(''- .
string''. 4
sql''5 8
,''8 9
params'': @
object''A G
[''G H
]''H I

parameters''J T
)''T U
{(( 	
this)) 
.)) 
Database)) 
.)) 
ExecuteSqlCommand)) +
())+ ,
sql)), /
,))/ 0

parameters))1 ;
))); <
;))< =
}** 	
	protected-- 
override-- 
void-- 
OnModelCreating--  /
(--/ 0
ModelBuilder--0 <
builder--= D
)--D E
{.. 	
base// 
.// 
OnModelCreating//  
(//  !
builder//! (
)//( )
;//) *
builder11 
.11 
Entity11 
<11 
Systemconfigrations11 .
>11. /
(11/ 0
entity110 6
=>117 9
{11: ;
entity22 
.22 
HasIndex22 
(22  
e22  !
=>22" $
e22% &
.22& '
key22' *
)22* +
.22+ ,
IsUnique22, 4
(224 5
)225 6
;226 7
}33 
)33 
;33 
}88 	
}99 
}:: �
KD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Interface\IDataMapper.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "
	Interface" +
{		 
public

 

	interface

 
IDataMapper

  
{  
AgreementListDetails &
AgreementListDetailsMapper 7
(7 8
DbDataReader8 D
readerE K
)K L
;L M%
GetAgreementDetailDetails !+
GetAgreementDetailDetailsMapper" A
(A B
DbDataReaderB N
readerO U
)U V
;V W*
UserSignUpAgreementListDetails &0
$UserSignUpAgreementListDetailsMapper' K
(K L
DbDataReaderL X
readerY _
)_ `
;` a-
!ArchieveVersionDetailsListDetails )3
'ArchieveVersionDetailsListDetailsMapper* Q
(Q R
DbDataReaderR ^
reader_ e
)e f
;f g&
GetAgreedUserListVMDetails ",
 GetAgreedUserListVMDetailsMapper# C
(C D
DbDataReaderD P
readerQ W
)W X
;X Y-
!DownloadAgreementDetailsVMDetails )3
'DownloadAgreementDetailsVMDetailsMapper* Q
(Q R
DbDataReaderR ^
reader_ e
)e f
;f g
} 
} �
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Interface\IFJTIdentityDbContext.cs
	namespace

 	
FJT


 
.

 
IdentityServer

 
.

 
Data

 !
.

! "
	Interface

" +
{ 
public 

	interface !
IFJTIdentityDbContext *
{ 
DbSet 
< 
ClientUsersMapping  
>  !
ClientUsersMapping" 4
{5 6
get7 :
;: ;
set< ?
;? @
}A B
DbSet 
< 
ApplicationUser 
> 
ApplicationUsers /
{0 1
get2 5
;5 6
set7 :
;: ;
}< =
DbSet 
< 
ApiScope 
> 
	ApiScopes !
{" #
get$ '
;' (
set) ,
;, -
}. /
DbSet 
< 
ClientScope 
> 
ClientScopes '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
DbSet 
< 
	Agreement 
> 
	Agreement "
{# $
get% (
;( )
set* -
;- .
}/ 0
DbSet 
< 
AgreementType 
> 
AgreementType *
{+ ,
get- 0
;0 1
set2 5
;5 6
}7 8
DbSet 
< 
UserAgreement 
> 
UserAgreement *
{+ ,
get- 0
;0 1
set2 5
;5 6
}7 8
DbSet 
< 
Systemconfigrations !
>! "
Systemconfigrations# 6
{7 8
get9 <
;< =
set> A
;A B
}C D
Task 
CustomSaveChanges 
( 
)  
;  !
} 
} �
\D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Interface\IFJTIdentityManualConnection.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "
	Interface" +
{ 
public		 

	interface		 (
IFJTIdentityManualConnection		 1
{

 
Task 
< 
T 
> 
ExecuteReaderAsync "
<" #
T# $
>$ %
(% &
Func& *
<* +
DbDataReader+ 7
,7 8
T9 :
>: ;
mapEntities< G
,G H
stringH N
execO S
,S T
paramsU [
object\ b
[b c
]c d

parameterse o
)o p
;p q
} 
} ��
�D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\AspNetIdentity\FJTIdentityDb\20210119072727_InitialIdentityDbMigration.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "

Migrations" ,
., -
AspNetIdentity- ;
.; <
FJTIdentityDb< I
{ 
public 

partial 
class &
InitialIdentityDbMigration 3
:4 5
	Migration6 ?
{ 
	protected		 
override		 
void		 
Up		  "
(		" #
MigrationBuilder		# 3
migrationBuilder		4 D
)		D E
{

 	
migrationBuilder 
. 
CreateTable (
(( )
name 
: 
$str #
,# $
columns 
: 
table 
=> !
new" %
{ 
Id 
= 
table 
. 
Column %
<% &
string& ,
>, -
(- .
nullable. 6
:6 7
false8 =
)= >
,> ?
Name 
= 
table  
.  !
Column! '
<' (
string( .
>. /
(/ 0
	maxLength0 9
:9 :
$num; >
,> ?
nullable@ H
:H I
trueJ N
)N O
,O P
NormalizedName "
=# $
table% *
.* +
Column+ 1
<1 2
string2 8
>8 9
(9 :
	maxLength: C
:C D
$numE H
,H I
nullableJ R
:R S
trueT X
)X Y
,Y Z
ConcurrencyStamp $
=% &
table' ,
., -
Column- 3
<3 4
string4 :
>: ;
(; <
nullable< D
:D E
trueF J
)J K
} 
, 
constraints 
: 
table "
=># %
{ 
table 
. 

PrimaryKey $
($ %
$str% 5
,5 6
x7 8
=>9 ;
x< =
.= >
Id> @
)@ A
;A B
} 
) 
; 
migrationBuilder 
. 
CreateTable (
(( )
name 
: 
$str #
,# $
columns 
: 
table 
=> !
new" %
{ 
Id 
= 
table 
. 
Column %
<% &
string& ,
>, -
(- .
nullable. 6
:6 7
false8 =
)= >
,> ?
UserName 
= 
table $
.$ %
Column% +
<+ ,
string, 2
>2 3
(3 4
	maxLength4 =
:= >
$num? B
,B C
nullableD L
:L M
trueN R
)R S
,S T
NormalizedUserName &
=' (
table) .
.. /
Column/ 5
<5 6
string6 <
>< =
(= >
	maxLength> G
:G H
$numI L
,L M
nullableN V
:V W
trueX \
)\ ]
,] ^
Email   
=   
table   !
.  ! "
Column  " (
<  ( )
string  ) /
>  / 0
(  0 1
	maxLength  1 :
:  : ;
$num  < ?
,  ? @
nullable  A I
:  I J
true  K O
)  O P
,  P Q
NormalizedEmail!! #
=!!$ %
table!!& +
.!!+ ,
Column!!, 2
<!!2 3
string!!3 9
>!!9 :
(!!: ;
	maxLength!!; D
:!!D E
$num!!F I
,!!I J
nullable!!K S
:!!S T
true!!U Y
)!!Y Z
,!!Z [
EmailConfirmed"" "
=""# $
table""% *
.""* +
Column""+ 1
<""1 2
bool""2 6
>""6 7
(""7 8
nullable""8 @
:""@ A
false""B G
)""G H
,""H I
PasswordHash##  
=##! "
table### (
.##( )
Column##) /
<##/ 0
string##0 6
>##6 7
(##7 8
nullable##8 @
:##@ A
true##B F
)##F G
,##G H
SecurityStamp$$ !
=$$" #
table$$$ )
.$$) *
Column$$* 0
<$$0 1
string$$1 7
>$$7 8
($$8 9
nullable$$9 A
:$$A B
true$$C G
)$$G H
,$$H I
ConcurrencyStamp%% $
=%%% &
table%%' ,
.%%, -
Column%%- 3
<%%3 4
string%%4 :
>%%: ;
(%%; <
nullable%%< D
:%%D E
true%%F J
)%%J K
,%%K L
PhoneNumber&& 
=&&  !
table&&" '
.&&' (
Column&&( .
<&&. /
string&&/ 5
>&&5 6
(&&6 7
nullable&&7 ?
:&&? @
true&&A E
)&&E F
,&&F G 
PhoneNumberConfirmed'' (
='') *
table''+ 0
.''0 1
Column''1 7
<''7 8
bool''8 <
>''< =
(''= >
nullable''> F
:''F G
false''H M
)''M N
,''N O
TwoFactorEnabled(( $
=((% &
table((' ,
.((, -
Column((- 3
<((3 4
bool((4 8
>((8 9
(((9 :
nullable((: B
:((B C
false((D I
)((I J
,((J K

LockoutEnd)) 
=))  
table))! &
.))& '
Column))' -
<))- .
DateTimeOffset)). <
>))< =
())= >
nullable))> F
:))F G
true))H L
)))L M
,))M N
LockoutEnabled** "
=**# $
table**% *
.*** +
Column**+ 1
<**1 2
bool**2 6
>**6 7
(**7 8
nullable**8 @
:**@ A
false**B G
)**G H
,**H I
AccessFailedCount++ %
=++& '
table++( -
.++- .
Column++. 4
<++4 5
int++5 8
>++8 9
(++9 :
nullable++: B
:++B C
false++D I
)++I J
,++J K
userPasswordDigest,, &
=,,' (
table,,) .
.,,. /
Column,,/ 5
<,,5 6
string,,6 <
>,,< =
(,,= >
nullable,,> F
:,,F G
true,,H L
),,L M
,,,M N
passwordHashUpdated-- '
=--( )
table--* /
.--/ 0
Column--0 6
<--6 7
bool--7 ;
>--; <
(--< =
nullable--= E
:--E F
false--G L
)--L M
,--M N
	isDeleted.. 
=.. 
table..  %
...% &
Column..& ,
<.., -
bool..- 1
>..1 2
(..2 3
nullable..3 ;
:..; <
false..= B
)..B C
,..C D
isSuperAdmin//  
=//! "
table//# (
.//( )
Column//) /
</// 0
bool//0 4
>//4 5
(//5 6
nullable//6 >
://> ?
true//@ D
)//D E
}00 
,00 
constraints11 
:11 
table11 "
=>11# %
{22 
table33 
.33 

PrimaryKey33 $
(33$ %
$str33% 5
,335 6
x337 8
=>339 ;
x33< =
.33= >
Id33> @
)33@ A
;33A B
}44 
)44 
;44 
migrationBuilder66 
.66 
CreateTable66 (
(66( )
name77 
:77 
$str77  
,77  !
columns88 
:88 
table88 
=>88 !
new88" %
{99 
Id:: 
=:: 
table:: 
.:: 
Column:: %
<::% &
int::& )
>::) *
(::* +
nullable::+ 3
:::3 4
false::5 :
)::: ;
.;; 

Annotation;; #
(;;# $
$str;;$ C
,;;C D(
MySqlValueGenerationStrategy;;E a
.;;a b
IdentityColumn;;b p
);;p q
,;;q r
Name<< 
=<< 
table<<  
.<<  !
Column<<! '
<<<' (
string<<( .
><<. /
(<</ 0
	maxLength<<0 9
:<<9 :
$num<<; >
,<<> ?
nullable<<@ H
:<<H I
true<<J N
)<<N O
,<<O P
DataType== 
=== 
table== $
.==$ %
Column==% +
<==+ ,
string==, 2
>==2 3
(==3 4
	maxLength==4 =
:=== >
$num==? A
,==A B
nullable==C K
:==K L
true==M Q
)==Q R
,==R S
DefaultValue>>  
=>>! "
table>># (
.>>( )
Column>>) /
<>>/ 0
string>>0 6
>>>6 7
(>>7 8
	maxLength>>8 A
:>>A B
$num>>C E
,>>E F
nullable>>G O
:>>O P
true>>Q U
)>>U V
,>>V W
FeatureLevel??  
=??! "
table??# (
.??( )
Column??) /
<??/ 0
string??0 6
>??6 7
(??7 8
	maxLength??8 A
:??A B
$num??C E
,??E F
nullable??G O
:??O P
true??Q U
)??U V
,??V W
IsActive@@ 
=@@ 
table@@ $
.@@$ %
Column@@% +
<@@+ ,
bool@@, 0
>@@0 1
(@@1 2
nullable@@2 :
:@@: ;
false@@< A
)@@A B
,@@B C
	IsDeletedAA 
=AA 
tableAA  %
.AA% &
ColumnAA& ,
<AA, -
boolAA- 1
>AA1 2
(AA2 3
nullableAA3 ;
:AA; <
falseAA= B
)AAB C
,AAC D
	CreatedAtBB 
=BB 
tableBB  %
.BB% &
ColumnBB& ,
<BB, -
DateTimeBB- 5
>BB5 6
(BB6 7
nullableBB7 ?
:BB? @
trueBBA E
)BBE F
,BBF G
	CreatedByCC 
=CC 
tableCC  %
.CC% &
ColumnCC& ,
<CC, -
stringCC- 3
>CC3 4
(CC4 5
	maxLengthCC5 >
:CC> ?
$numCC@ C
,CCC D
nullableCCE M
:CCM N
trueCCO S
)CCS T
,CCT U
	UpdatedAtDD 
=DD 
tableDD  %
.DD% &
ColumnDD& ,
<DD, -
DateTimeDD- 5
>DD5 6
(DD6 7
nullableDD7 ?
:DD? @
trueDDA E
)DDE F
,DDF G
	UpdatedByEE 
=EE 
tableEE  %
.EE% &
ColumnEE& ,
<EE, -
stringEE- 3
>EE3 4
(EE4 5
	maxLengthEE5 >
:EE> ?
$numEE@ B
,EEB C
nullableEED L
:EEL M
trueEEN R
)EER S
}FF 
,FF 
constraintsGG 
:GG 
tableGG "
=>GG# %
{HH 
tableII 
.II 

PrimaryKeyII $
(II$ %
$strII% 2
,II2 3
xII4 5
=>II6 8
xII9 :
.II: ;
IdII; =
)II= >
;II> ?
}JJ 
)JJ 
;JJ 
migrationBuilderLL 
.LL 
CreateTableLL (
(LL( )
nameMM 
:MM 
$strMM  
,MM  !
columnsNN 
:NN 
tableNN 
=>NN !
newNN" %
{OO 
IdPP 
=PP 
tablePP 
.PP 
ColumnPP %
<PP% &
intPP& )
>PP) *
(PP* +
nullablePP+ 3
:PP3 4
falsePP5 :
)PP: ;
.QQ 

AnnotationQQ #
(QQ# $
$strQQ$ C
,QQC D(
MySqlValueGenerationStrategyQQE a
.QQa b
IdentityColumnQQb p
)QQp q
,QQq r
ProductNameRR 
=RR  !
tableRR" '
.RR' (
ColumnRR( .
<RR. /
stringRR/ 5
>RR5 6
(RR6 7
	maxLengthRR7 @
:RR@ A
$numRRB E
,RRE F
nullableRRG O
:RRO P
trueRRQ U
)RRU V
,RRV W
PriceSS 
=SS 
tableSS !
.SS! "
ColumnSS" (
<SS( )
decimalSS) 0
>SS0 1
(SS1 2
nullableSS2 :
:SS: ;
trueSS< @
)SS@ A
,SSA B
CategoryTT 
=TT 
tableTT $
.TT$ %
ColumnTT% +
<TT+ ,
stringTT, 2
>TT2 3
(TT3 4
	maxLengthTT4 =
:TT= >
$numTT? A
,TTA B
nullableTTC K
:TTK L
trueTTM Q
)TTQ R
,TTR S
IsActiveUU 
=UU 
tableUU $
.UU$ %
ColumnUU% +
<UU+ ,
boolUU, 0
>UU0 1
(UU1 2
nullableUU2 :
:UU: ;
falseUU< A
)UUA B
,UUB C
	IsDeletedVV 
=VV 
tableVV  %
.VV% &
ColumnVV& ,
<VV, -
boolVV- 1
>VV1 2
(VV2 3
nullableVV3 ;
:VV; <
falseVV= B
)VVB C
,VVC D
	CreatedAtWW 
=WW 
tableWW  %
.WW% &
ColumnWW& ,
<WW, -
DateTimeWW- 5
>WW5 6
(WW6 7
nullableWW7 ?
:WW? @
trueWWA E
)WWE F
,WWF G
	CreatedByXX 
=XX 
tableXX  %
.XX% &
ColumnXX& ,
<XX, -
stringXX- 3
>XX3 4
(XX4 5
	maxLengthXX5 >
:XX> ?
$numXX@ C
,XXC D
nullableXXE M
:XXM N
trueXXO S
)XXS T
,XXT U
	UpdatedAtYY 
=YY 
tableYY  %
.YY% &
ColumnYY& ,
<YY, -
DateTimeYY- 5
>YY5 6
(YY6 7
nullableYY7 ?
:YY? @
trueYYA E
)YYE F
,YYF G
	UpdatedByZZ 
=ZZ 
tableZZ  %
.ZZ% &
ColumnZZ& ,
<ZZ, -
stringZZ- 3
>ZZ3 4
(ZZ4 5
	maxLengthZZ5 >
:ZZ> ?
$numZZ@ B
,ZZB C
nullableZZD L
:ZZL M
trueZZN R
)ZZR S
}[[ 
,[[ 
constraints\\ 
:\\ 
table\\ "
=>\\# %
{]] 
table^^ 
.^^ 

PrimaryKey^^ $
(^^$ %
$str^^% 2
,^^2 3
x^^4 5
=>^^6 8
x^^9 :
.^^: ;
Id^^; =
)^^= >
;^^> ?
}__ 
)__ 
;__ 
migrationBuilderaa 
.aa 
CreateTableaa (
(aa( )
namebb 
:bb 
$strbb (
,bb( )
columnscc 
:cc 
tablecc 
=>cc !
newcc" %
{dd 
Idee 
=ee 
tableee 
.ee 
Columnee %
<ee% &
intee& )
>ee) *
(ee* +
nullableee+ 3
:ee3 4
falseee5 :
)ee: ;
.ff 

Annotationff #
(ff# $
$strff$ C
,ffC D(
MySqlValueGenerationStrategyffE a
.ffa b
IdentityColumnffb p
)ffp q
,ffq r
RoleIdgg 
=gg 
tablegg "
.gg" #
Columngg# )
<gg) *
stringgg* 0
>gg0 1
(gg1 2
nullablegg2 :
:gg: ;
falsegg< A
)ggA B
,ggB C
	ClaimTypehh 
=hh 
tablehh  %
.hh% &
Columnhh& ,
<hh, -
stringhh- 3
>hh3 4
(hh4 5
nullablehh5 =
:hh= >
truehh? C
)hhC D
,hhD E

ClaimValueii 
=ii  
tableii! &
.ii& '
Columnii' -
<ii- .
stringii. 4
>ii4 5
(ii5 6
nullableii6 >
:ii> ?
trueii@ D
)iiD E
}jj 
,jj 
constraintskk 
:kk 
tablekk "
=>kk# %
{ll 
tablemm 
.mm 

PrimaryKeymm $
(mm$ %
$strmm% :
,mm: ;
xmm< =
=>mm> @
xmmA B
.mmB C
IdmmC E
)mmE F
;mmF G
tablenn 
.nn 

ForeignKeynn $
(nn$ %
nameoo 
:oo 
$stroo F
,ooF G
columnpp 
:pp 
xpp  !
=>pp" $
xpp% &
.pp& '
RoleIdpp' -
,pp- .
principalTableqq &
:qq& '
$strqq( 5
,qq5 6
principalColumnrr '
:rr' (
$strrr) -
,rr- .
onDeletess  
:ss  !
ReferentialActionss" 3
.ss3 4
Cascadess4 ;
)ss; <
;ss< =
}tt 
)tt 
;tt 
migrationBuildervv 
.vv 
CreateTablevv (
(vv( )
nameww 
:ww 
$strww (
,ww( )
columnsxx 
:xx 
tablexx 
=>xx !
newxx" %
{yy 
Idzz 
=zz 
tablezz 
.zz 
Columnzz %
<zz% &
intzz& )
>zz) *
(zz* +
nullablezz+ 3
:zz3 4
falsezz5 :
)zz: ;
.{{ 

Annotation{{ #
({{# $
$str{{$ C
,{{C D(
MySqlValueGenerationStrategy{{E a
.{{a b
IdentityColumn{{b p
){{p q
,{{q r
UserId|| 
=|| 
table|| "
.||" #
Column||# )
<||) *
string||* 0
>||0 1
(||1 2
nullable||2 :
:||: ;
false||< A
)||A B
,||B C
	ClaimType}} 
=}} 
table}}  %
.}}% &
Column}}& ,
<}}, -
string}}- 3
>}}3 4
(}}4 5
nullable}}5 =
:}}= >
true}}? C
)}}C D
,}}D E

ClaimValue~~ 
=~~  
table~~! &
.~~& '
Column~~' -
<~~- .
string~~. 4
>~~4 5
(~~5 6
nullable~~6 >
:~~> ?
true~~@ D
)~~D E
} 
, 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% :
,
��: ;
x
��< =
=>
��> @
x
��A B
.
��B C
Id
��C E
)
��E F
;
��F G
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� F
,
��F G
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
UserId
��' -
,
��- .
principalTable
�� &
:
��& '
$str
��( 5
,
��5 6
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� (
,
��( )
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
LoginProvider
�� !
=
��" #
table
��$ )
.
��) *
Column
��* 0
<
��0 1
string
��1 7
>
��7 8
(
��8 9
	maxLength
��9 B
:
��B C
$num
��D G
,
��G H
nullable
��I Q
:
��Q R
false
��S X
)
��X Y
,
��Y Z
ProviderKey
�� 
=
��  !
table
��" '
.
��' (
Column
��( .
<
��. /
string
��/ 5
>
��5 6
(
��6 7
	maxLength
��7 @
:
��@ A
$num
��B E
,
��E F
nullable
��G O
:
��O P
false
��Q V
)
��V W
,
��W X!
ProviderDisplayName
�� '
=
��( )
table
��* /
.
��/ 0
Column
��0 6
<
��6 7
string
��7 =
>
��= >
(
��> ?
nullable
��? G
:
��G H
true
��I M
)
��M N
,
��N O
UserId
�� 
=
�� 
table
�� "
.
��" #
Column
��# )
<
��) *
string
��* 0
>
��0 1
(
��1 2
nullable
��2 :
:
��: ;
false
��< A
)
��A B
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% :
,
��: ;
x
��< =
=>
��> @
new
��A D
{
��E F
x
��G H
.
��H I
LoginProvider
��I V
,
��V W
x
��X Y
.
��Y Z
ProviderKey
��Z e
}
��f g
)
��g h
;
��h i
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� F
,
��F G
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
UserId
��' -
,
��- .
principalTable
�� &
:
��& '
$str
��( 5
,
��5 6
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� '
,
��' (
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
UserId
�� 
=
�� 
table
�� "
.
��" #
Column
��# )
<
��) *
string
��* 0
>
��0 1
(
��1 2
nullable
��2 :
:
��: ;
false
��< A
)
��A B
,
��B C
RoleId
�� 
=
�� 
table
�� "
.
��" #
Column
��# )
<
��) *
string
��* 0
>
��0 1
(
��1 2
nullable
��2 :
:
��: ;
false
��< A
)
��A B
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% 9
,
��9 :
x
��; <
=>
��= ?
new
��@ C
{
��D E
x
��F G
.
��G H
UserId
��H N
,
��N O
x
��P Q
.
��Q R
RoleId
��R X
}
��Y Z
)
��Z [
;
��[ \
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� E
,
��E F
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
RoleId
��' -
,
��- .
principalTable
�� &
:
��& '
$str
��( 5
,
��5 6
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� E
,
��E F
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
UserId
��' -
,
��- .
principalTable
�� &
:
��& '
$str
��( 5
,
��5 6
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� (
,
��( )
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
UserId
�� 
=
�� 
table
�� "
.
��" #
Column
��# )
<
��) *
string
��* 0
>
��0 1
(
��1 2
nullable
��2 :
:
��: ;
false
��< A
)
��A B
,
��B C
LoginProvider
�� !
=
��" #
table
��$ )
.
��) *
Column
��* 0
<
��0 1
string
��1 7
>
��7 8
(
��8 9
	maxLength
��9 B
:
��B C
$num
��D G
,
��G H
nullable
��I Q
:
��Q R
false
��S X
)
��X Y
,
��Y Z
Name
�� 
=
�� 
table
��  
.
��  !
Column
��! '
<
��' (
string
��( .
>
��. /
(
��/ 0
	maxLength
��0 9
:
��9 :
$num
��; >
,
��> ?
nullable
��@ H
:
��H I
false
��J O
)
��O P
,
��P Q
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
true
��; ?
)
��? @
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% :
,
��: ;
x
��< =
=>
��> @
new
��A D
{
��E F
x
��G H
.
��H I
UserId
��I O
,
��O P
x
��Q R
.
��R S
LoginProvider
��S `
,
��` a
x
��b c
.
��c d
Name
��d h
}
��i j
)
��j k
;
��k l
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� F
,
��F G
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
UserId
��' -
,
��- .
principalTable
�� &
:
��& '
$str
��( 5
,
��5 6
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� *
,
��* +
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
string
��, 2
>
��2 3
(
��3 4
nullable
��4 <
:
��< =
false
��> C
)
��C D
,
��D E
UserId
�� 
=
�� 
table
�� "
.
��" #
Column
��# )
<
��) *
string
��* 0
>
��0 1
(
��1 2
nullable
��2 :
:
��: ;
true
��< @
)
��@ A
,
��A B
	isDeleted
�� 
=
�� 
table
��  %
.
��% &
Column
��& ,
<
��, -
bool
��- 1
>
��1 2
(
��2 3
nullable
��3 ;
:
��; <
false
��= B
)
��B C
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% <
,
��< =
x
��> ?
=>
��@ B
x
��C D
.
��D E
Id
��E G
)
��G H
;
��H I
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� H
,
��H I
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
UserId
��' -
,
��- .
principalTable
�� &
:
��& '
$str
��( 5
,
��5 6
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Restrict
��4 <
)
��< =
;
��= >
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 2
,
��2 3
table
�� 
:
�� 
$str
�� )
,
��) *
column
�� 
:
�� 
$str
��  
)
��  !
;
��! "
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� %
,
��% &
table
�� 
:
�� 
$str
�� $
,
��$ %
column
�� 
:
�� 
$str
�� (
,
��( )
unique
�� 
:
�� 
true
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 2
,
��2 3
table
�� 
:
�� 
$str
�� )
,
��) *
column
�� 
:
�� 
$str
��  
)
��  !
;
��! "
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 2
,
��2 3
table
�� 
:
�� 
$str
�� )
,
��) *
column
�� 
:
�� 
$str
��  
)
��  !
;
��! "
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 1
,
��1 2
table
�� 
:
�� 
$str
�� (
,
��( )
column
�� 
:
�� 
$str
��  
)
��  !
;
��! "
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� "
,
��" #
table
�� 
:
�� 
$str
�� $
,
��$ %
column
�� 
:
�� 
$str
�� )
)
��) *
;
��* +
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� %
,
��% &
table
�� 
:
�� 
$str
�� $
,
��$ %
column
�� 
:
�� 
$str
�� ,
,
��, -
unique
�� 
:
�� 
true
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 4
,
��4 5
table
�� 
:
�� 
$str
�� +
,
��+ ,
column
�� 
:
�� 
$str
��  
)
��  !
;
��! "
}
�� 	
	protected
�� 
override
�� 
void
�� 
Down
��  $
(
��$ %
MigrationBuilder
��% 5
migrationBuilder
��6 F
)
��F G
{
�� 	
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� (
)
��( )
;
��) *
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� (
)
��( )
;
��) *
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� (
)
��( )
;
��) *
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� '
)
��' (
;
��( )
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� (
)
��( )
;
��) *
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� *
)
��* +
;
��+ ,
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
��  
)
��  !
;
��! "
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
��  
)
��  !
;
��! "
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� #
)
��# $
;
��$ %
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� #
)
��# $
;
��$ %
}
�� 	
}
�� 
}�� ��
~D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\AspNetIdentity\FJTIdentityDb\20210128103049_AddTableMigration.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "

Migrations" ,
., -
AspNetIdentity- ;
.; <
FJTIdentityDb< I
{ 
public 

partial 
class 
AddTableMigration *
:+ ,
	Migration- 6
{ 
	protected		 
override		 
void		 
Up		  "
(		" #
MigrationBuilder		# 3
migrationBuilder		4 D
)		D E
{

 	
migrationBuilder 
. 
CreateTable (
(( )
name 
: 
$str &
,& '
columns 
: 
table 
=> !
new" %
{ 
agreementTypeID #
=$ %
table& +
.+ ,
Column, 2
<2 3
int3 6
>6 7
(7 8
nullable8 @
:@ A
falseB G
)G H
. 

Annotation #
(# $
$str$ C
,C D(
MySqlValueGenerationStrategyE a
.a b
IdentityColumnb p
)p q
,q r
agreementType !
=" #
table$ )
.) *
Column* 0
<0 1
string1 7
>7 8
(8 9
	maxLength9 B
:B C
$numD G
,G H
nullableI Q
:Q R
trueS W
)W X
,X Y
	isDeleted 
= 
table  %
.% &
Column& ,
<, -
bool- 1
>1 2
(2 3
nullable3 ;
:; <
false= B
)B C
,C D
	createdBy 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
	updatedBy 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
	deletedBy 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
	createdAt 
= 
table  %
.% &
Column& ,
<, -
DateTime- 5
>5 6
(6 7
nullable7 ?
:? @
falseA F
)F G
,G H
	updatedAt 
= 
table  %
.% &
Column& ,
<, -
DateTime- 5
>5 6
(6 7
nullable7 ?
:? @
trueA E
)E F
,F G
	deletedAt 
= 
table  %
.% &
Column& ,
<, -
DateTime- 5
>5 6
(6 7
nullable7 ?
:? @
trueA E
)E F
,F G
templateType  
=! "
table# (
.( )
Column) /
</ 0
string0 6
>6 7
(7 8
	maxLength8 A
:A B
$numC F
,F G
nullableH P
:P Q
trueR V
)V W
,W X
createByRole  
=! "
table# (
.( )
Column) /
</ 0
string0 6
>6 7
(7 8
	maxLength8 A
:A B
$numC F
,F G
nullableH P
:P Q
trueR V
)V W
,W X
updateByRole  
=! "
table# (
.( )
Column) /
</ 0
string0 6
>6 7
(7 8
	maxLength8 A
:A B
$numC F
,F G
nullableH P
:P Q
trueR V
)V W
,W X
deleteByRole  
=! "
table# (
.( )
Column) /
</ 0
string0 6
>6 7
(7 8
	maxLength8 A
:A B
$numC F
,F G
nullableH P
:P Q
trueR V
)V W
,W X
purpose 
= 
table #
.# $
Column$ *
<* +
string+ 1
>1 2
(2 3
	maxLength3 <
:< =
$num> B
,B C
nullableD L
:L M
trueN R
)R S
,S T

where_used 
=  
table! &
.& '
Column' -
<- .
string. 4
>4 5
(5 6
	maxLength6 ?
:? @
$numA E
,E F
nullableG O
:O P
trueQ U
)U V
,V W
displayName 
=  !
table" '
.' (
Column( .
<. /
string/ 5
>5 6
(6 7
	maxLength7 @
:@ A
$numB E
,E F
nullableG O
:O P
trueQ U
)U V
}   
,   
constraints!! 
:!! 
table!! "
=>!!# %
{"" 
table## 
.## 

PrimaryKey## $
(##$ %
$str##% 8
,##8 9
x##: ;
=>##< >
x##? @
.##@ A
agreementTypeID##A P
)##P Q
;##Q R
}$$ 
)$$ 
;$$ 
migrationBuilder&& 
.&& 
CreateTable&& (
(&&( )
name'' 
:'' 
$str'' !
,''! "
columns(( 
:(( 
table(( 
=>(( !
new((" %
{)) 
agreementID** 
=**  !
table**" '
.**' (
Column**( .
<**. /
int**/ 2
>**2 3
(**3 4
nullable**4 <
:**< =
false**> C
)**C D
.++ 

Annotation++ #
(++# $
$str++$ C
,++C D(
MySqlValueGenerationStrategy++E a
.++a b
IdentityColumn++b p
)++p q
,++q r
agreementTypeID,, #
=,,$ %
table,,& +
.,,+ ,
Column,,, 2
<,,2 3
int,,3 6
>,,6 7
(,,7 8
nullable,,8 @
:,,@ A
false,,B G
),,G H
,,,H I
agreementContent-- $
=--% &
table--' ,
.--, -
Column--- 3
<--3 4
string--4 :
>--: ;
(--; <
nullable--< D
:--D E
true--F J
)--J K
,--K L
version.. 
=.. 
table.. #
...# $
Column..$ *
<..* +
int..+ .
>... /
(../ 0
nullable..0 8
:..8 9
true..: >
)..> ?
,..? @
system_variables// $
=//% &
table//' ,
.//, -
Column//- 3
<//3 4
string//4 :
>//: ;
(//; <
nullable//< D
://D E
true//F J
)//J K
,//K L
isPublished00 
=00  !
table00" '
.00' (
Column00( .
<00. /
bool00/ 3
>003 4
(004 5
nullable005 =
:00= >
true00? C
)00C D
,00D E
publishedDate11 !
=11" #
table11$ )
.11) *
Column11* 0
<110 1
DateTime111 9
>119 :
(11: ;
nullable11; C
:11C D
true11E I
)11I J
,11J K
	isDeleted22 
=22 
table22  %
.22% &
Column22& ,
<22, -
bool22- 1
>221 2
(222 3
nullable223 ;
:22; <
false22= B
)22B C
,22C D
	createdBy33 
=33 
table33  %
.33% &
Column33& ,
<33, -
string33- 3
>333 4
(334 5
	maxLength335 >
:33> ?
$num33@ C
,33C D
nullable33E M
:33M N
true33O S
)33S T
,33T U
	updatedBy44 
=44 
table44  %
.44% &
Column44& ,
<44, -
string44- 3
>443 4
(444 5
	maxLength445 >
:44> ?
$num44@ C
,44C D
nullable44E M
:44M N
true44O S
)44S T
,44T U
	deletedBy55 
=55 
table55  %
.55% &
Column55& ,
<55, -
string55- 3
>553 4
(554 5
	maxLength555 >
:55> ?
$num55@ C
,55C D
nullable55E M
:55M N
true55O S
)55S T
,55T U
	createdAt66 
=66 
table66  %
.66% &
Column66& ,
<66, -
DateTime66- 5
>665 6
(666 7
nullable667 ?
:66? @
false66A F
)66F G
,66G H
	updatedAt77 
=77 
table77  %
.77% &
Column77& ,
<77, -
DateTime77- 5
>775 6
(776 7
nullable777 ?
:77? @
true77A E
)77E F
,77F G
	deletedAt88 
=88 
table88  %
.88% &
Column88& ,
<88, -
DateTime88- 5
>885 6
(886 7
nullable887 ?
:88? @
true88A E
)88E F
,88F G
agreementSubject99 $
=99% &
table99' ,
.99, -
Column99- 3
<993 4
string994 :
>99: ;
(99; <
	maxLength99< E
:99E F
$num99G J
,99J K
nullable99L T
:99T U
true99V Z
)99Z [
,99[ \
createByRole::  
=::! "
table::# (
.::( )
Column::) /
<::/ 0
string::0 6
>::6 7
(::7 8
	maxLength::8 A
:::A B
$num::C F
,::F G
nullable::H P
:::P Q
true::R V
)::V W
,::W X
updateByRole;;  
=;;! "
table;;# (
.;;( )
Column;;) /
<;;/ 0
string;;0 6
>;;6 7
(;;7 8
	maxLength;;8 A
:;;A B
$num;;C F
,;;F G
nullable;;H P
:;;P Q
true;;R V
);;V W
,;;W X
deleteByRole<<  
=<<! "
table<<# (
.<<( )
Column<<) /
<<</ 0
string<<0 6
><<6 7
(<<7 8
	maxLength<<8 A
:<<A B
$num<<C F
,<<F G
nullable<<H P
:<<P Q
true<<R V
)<<V W
}== 
,== 
constraints>> 
:>> 
table>> "
=>>># %
{?? 
table@@ 
.@@ 

PrimaryKey@@ $
(@@$ %
$str@@% 3
,@@3 4
x@@5 6
=>@@7 9
x@@: ;
.@@; <
agreementID@@< G
)@@G H
;@@H I
tableAA 
.AA 

ForeignKeyAA $
(AA$ %
nameBB 
:BB 
$strBB K
,BBK L
columnCC 
:CC 
xCC  !
=>CC" $
xCC% &
.CC& '
agreementTypeIDCC' 6
,CC6 7
principalTableDD &
:DD& '
$strDD( 8
,DD8 9
principalColumnEE '
:EE' (
$strEE) :
,EE: ;
onDeleteFF  
:FF  !
ReferentialActionFF" 3
.FF3 4
CascadeFF4 ;
)FF; <
;FF< =
}GG 
)GG 
;GG 
migrationBuilderII 
.II 
CreateTableII (
(II( )
nameJJ 
:JJ 
$strJJ &
,JJ& '
columnsKK 
:KK 
tableKK 
=>KK !
newKK" %
{LL 
userAgreementIDMM #
=MM$ %
tableMM& +
.MM+ ,
ColumnMM, 2
<MM2 3
intMM3 6
>MM6 7
(MM7 8
nullableMM8 @
:MM@ A
falseMMB G
)MMG H
.NN 

AnnotationNN #
(NN# $
$strNN$ C
,NNC D(
MySqlValueGenerationStrategyNNE a
.NNa b
IdentityColumnNNb p
)NNp q
,NNq r
userIDOO 
=OO 
tableOO "
.OO" #
ColumnOO# )
<OO) *
stringOO* 0
>OO0 1
(OO1 2
	maxLengthOO2 ;
:OO; <
$numOO= @
,OO@ A
nullableOOB J
:OOJ K
trueOOL P
)OOP Q
,OOQ R
agreementIDPP 
=PP  !
tablePP" '
.PP' (
ColumnPP( .
<PP. /
intPP/ 2
>PP2 3
(PP3 4
nullablePP4 <
:PP< =
falsePP> C
)PPC D
,PPD E

agreedDateQQ 
=QQ  
tableQQ! &
.QQ& '
ColumnQQ' -
<QQ- .
DateTimeQQ. 6
>QQ6 7
(QQ7 8
nullableQQ8 @
:QQ@ A
trueQQB F
)QQF G
,QQG H
	isDeletedRR 
=RR 
tableRR  %
.RR% &
ColumnRR& ,
<RR, -
boolRR- 1
>RR1 2
(RR2 3
nullableRR3 ;
:RR; <
falseRR= B
)RRB C
,RRC D
	createdBySS 
=SS 
tableSS  %
.SS% &
ColumnSS& ,
<SS, -
stringSS- 3
>SS3 4
(SS4 5
	maxLengthSS5 >
:SS> ?
$numSS@ C
,SSC D
nullableSSE M
:SSM N
trueSSO S
)SSS T
,SST U
	updatedByTT 
=TT 
tableTT  %
.TT% &
ColumnTT& ,
<TT, -
stringTT- 3
>TT3 4
(TT4 5
	maxLengthTT5 >
:TT> ?
$numTT@ C
,TTC D
nullableTTE M
:TTM N
trueTTO S
)TTS T
,TTT U
	deletedByUU 
=UU 
tableUU  %
.UU% &
ColumnUU& ,
<UU, -
stringUU- 3
>UU3 4
(UU4 5
	maxLengthUU5 >
:UU> ?
$numUU@ C
,UUC D
nullableUUE M
:UUM N
trueUUO S
)UUS T
,UUT U
	createdAtVV 
=VV 
tableVV  %
.VV% &
ColumnVV& ,
<VV, -
DateTimeVV- 5
>VV5 6
(VV6 7
nullableVV7 ?
:VV? @
falseVVA F
)VVF G
,VVG H
	updatedAtWW 
=WW 
tableWW  %
.WW% &
ColumnWW& ,
<WW, -
DateTimeWW- 5
>WW5 6
(WW6 7
nullableWW7 ?
:WW? @
trueWWA E
)WWE F
,WWF G
	deletedAtXX 
=XX 
tableXX  %
.XX% &
ColumnXX& ,
<XX, -
DateTimeXX- 5
>XX5 6
(XX6 7
nullableXX7 ?
:XX? @
trueXXA E
)XXE F
,XXF G
createByRoleYY  
=YY! "
tableYY# (
.YY( )
ColumnYY) /
<YY/ 0
stringYY0 6
>YY6 7
(YY7 8
	maxLengthYY8 A
:YYA B
$numYYC F
,YYF G
nullableYYH P
:YYP Q
trueYYR V
)YYV W
,YYW X
updateByRoleZZ  
=ZZ! "
tableZZ# (
.ZZ( )
ColumnZZ) /
<ZZ/ 0
stringZZ0 6
>ZZ6 7
(ZZ7 8
	maxLengthZZ8 A
:ZZA B
$numZZC F
,ZZF G
nullableZZH P
:ZZP Q
trueZZR V
)ZZV W
,ZZW X
deleteByRole[[  
=[[! "
table[[# (
.[[( )
Column[[) /
<[[/ 0
string[[0 6
>[[6 7
([[7 8
	maxLength[[8 A
:[[A B
$num[[C F
,[[F G
nullable[[H P
:[[P Q
true[[R V
)[[V W
,[[W X
signaturevalue\\ "
=\\# $
table\\% *
.\\* +
Column\\+ 1
<\\1 2
string\\2 8
>\\8 9
(\\9 :
nullable\\: B
:\\B C
true\\D H
)\\H I
}]] 
,]] 
constraints^^ 
:^^ 
table^^ "
=>^^# %
{__ 
table`` 
.`` 

PrimaryKey`` $
(``$ %
$str``% 8
,``8 9
x``: ;
=>``< >
x``? @
.``@ A
userAgreementID``A P
)``P Q
;``Q R
tableaa 
.aa 

ForeignKeyaa $
(aa$ %
namebb 
:bb 
$strbb G
,bbG H
columncc 
:cc 
xcc  !
=>cc" $
xcc% &
.cc& '
agreementIDcc' 2
,cc2 3
principalTabledd &
:dd& '
$strdd( 3
,dd3 4
principalColumnee '
:ee' (
$stree) 6
,ee6 7
onDeleteff  
:ff  !
ReferentialActionff" 3
.ff3 4
Cascadeff4 ;
)ff; <
;ff< =
tablegg 
.gg 

ForeignKeygg $
(gg$ %
namehh 
:hh 
$strhh D
,hhD E
columnii 
:ii 
xii  !
=>ii" $
xii% &
.ii& '
userIDii' -
,ii- .
principalTablejj &
:jj& '
$strjj( 5
,jj5 6
principalColumnkk '
:kk' (
$strkk) -
,kk- .
onDeletell  
:ll  !
ReferentialActionll" 3
.ll3 4
Restrictll4 <
)ll< =
;ll= >
}mm 
)mm 
;mm 
migrationBuilderoo 
.oo 
CreateIndexoo (
(oo( )
namepp 
:pp 
$strpp 4
,pp4 5
tableqq 
:qq 
$strqq "
,qq" #
columnrr 
:rr 
$strrr )
)rr) *
;rr* +
migrationBuildertt 
.tt 
CreateIndextt (
(tt( )
nameuu 
:uu 
$struu 5
,uu5 6
tablevv 
:vv 
$strvv '
,vv' (
columnww 
:ww 
$strww %
)ww% &
;ww& '
migrationBuilderyy 
.yy 
CreateIndexyy (
(yy( )
namezz 
:zz 
$strzz 0
,zz0 1
table{{ 
:{{ 
$str{{ '
,{{' (
column|| 
:|| 
$str||  
)||  !
;||! "
}}} 	
	protected 
override 
void 
Down  $
($ %
MigrationBuilder% 5
migrationBuilder6 F
)F G
{
�� 	
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� &
)
��& '
;
��' (
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� !
)
��! "
;
��" #
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� &
)
��& '
;
��' (
}
�� 	
}
�� 
}�� �:
�D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\AspNetIdentity\FJTIdentityDb\20210223095330_AddTable_systemconfigrations.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "

Migrations" ,
., -
AspNetIdentity- ;
.; <
FJTIdentityDb< I
{ 
public 

partial 
class (
AddTable_systemconfigrations 5
:6 7
	Migration8 A
{ 
	protected		 
override		 
void		 
Up		  "
(		" #
MigrationBuilder		# 3
migrationBuilder		4 D
)		D E
{

 	
migrationBuilder 
. 
CreateTable (
(( )
name 
: 
$str +
,+ ,
columns 
: 
table 
=> !
new" %
{ 
id 
= 
table 
. 
Column %
<% &
int& )
>) *
(* +
nullable+ 3
:3 4
false5 :
): ;
. 

Annotation #
(# $
$str$ C
,C D(
MySqlValueGenerationStrategyE a
.a b
IdentityColumnb p
)p q
,q r
key 
= 
table 
.  
Column  &
<& '
string' -
>- .
(. /
	maxLength/ 8
:8 9
$num: =
,= >
nullable? G
:G H
trueI M
)M N
,N O
values 
= 
table "
." #
Column# )
<) *
string* 0
>0 1
(1 2
	maxLength2 ;
:; <
$num= @
,@ A
nullableB J
:J K
trueL P
)P Q
,Q R
clusterName 
=  !
table" '
.' (
Column( .
<. /
string/ 5
>5 6
(6 7
	maxLength7 @
:@ A
$numB D
,D E
nullableF N
:N O
trueP T
)T U
,U V
isEncrypted 
=  !
table" '
.' (
Column( .
<. /
bool/ 3
>3 4
(4 5
nullable5 =
:= >
true? C
)C D
,D E
isActive 
= 
table $
.$ %
Column% +
<+ ,
bool, 0
>0 1
(1 2
nullable2 :
:: ;
true< @
)@ A
,A B
	isDeleted 
= 
table  %
.% &
Column& ,
<, -
bool- 1
>1 2
(2 3
nullable3 ;
:; <
true= A
)A B
,B C
	createdBy 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
	createdAt 
= 
table  %
.% &
Column& ,
<, -
DateTime- 5
>5 6
(6 7
nullable7 ?
:? @
falseA F
)F G
,G H
	updatedBy 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
	updatedAt 
= 
table  %
.% &
Column& ,
<, -
DateTime- 5
>5 6
(6 7
nullable7 ?
:? @
falseA F
)F G
,G H
	deletedBy 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
	deletedAt 
= 
table  %
.% &
Column& ,
<, -
DateTime- 5
>5 6
(6 7
nullable7 ?
:? @
trueA E
)E F
,F G

isEditable 
=  
table! &
.& '
Column' -
<- .
bool. 2
>2 3
(3 4
nullable4 <
:< =
false> C
)C D
,D E
description 
=  !
table" '
.' (
Column( .
<. /
string/ 5
>5 6
(6 7
	maxLength7 @
:@ A
$numB F
,F G
nullableH P
:P Q
trueR V
)V W
,W X
displayName 
=  !
table" '
.' (
Column( .
<. /
string/ 5
>5 6
(6 7
	maxLength7 @
:@ A
$numB E
,E F
nullableG O
:O P
trueQ U
)U V
,V W
createByRoleId   "
=  # $
table  % *
.  * +
Column  + 1
<  1 2
int  2 5
>  5 6
(  6 7
nullable  7 ?
:  ? @
true  A E
)  E F
,  F G
updateByRoleId!! "
=!!# $
table!!% *
.!!* +
Column!!+ 1
<!!1 2
int!!2 5
>!!5 6
(!!6 7
nullable!!7 ?
:!!? @
true!!A E
)!!E F
,!!F G
deleteByRoleId"" "
=""# $
table""% *
.""* +
Column""+ 1
<""1 2
int""2 5
>""5 6
(""6 7
nullable""7 ?
:""? @
true""A E
)""E F
}## 
,## 
constraints$$ 
:$$ 
table$$ "
=>$$# %
{%% 
table&& 
.&& 

PrimaryKey&& $
(&&$ %
$str&&% =
,&&= >
x&&? @
=>&&A C
x&&D E
.&&E F
id&&F H
)&&H I
;&&I J
}'' 
)'' 
;'' 
migrationBuilder)) 
.)) 
CreateIndex)) (
())( )
name** 
:** 
$str** 2
,**2 3
table++ 
:++ 
$str++ ,
,++, -
column,, 
:,, 
$str,, 
,,, 
unique-- 
:-- 
true-- 
)-- 
;-- 
}.. 	
	protected00 
override00 
void00 
Down00  $
(00$ %
MigrationBuilder00% 5
migrationBuilder006 F
)00F G
{11 	
migrationBuilder22 
.22 
	DropTable22 &
(22& '
name33 
:33 
$str33 +
)33+ ,
;33, -
}44 	
}55 
}66 �
�D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\AspNetIdentity\FJTIdentityDb\20210616043730_Add_changePasswordAt_aspnetusers.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "

Migrations" ,
., -
AspNetIdentity- ;
.; <
FJTIdentityDb< I
{ 
public 

partial 
class ,
 Add_changePasswordAt_aspnetusers 9
:: ;
	Migration< E
{ 
	protected 
override 
void 
Up  "
(" #
MigrationBuilder# 3
migrationBuilder4 D
)D E
{		 	
migrationBuilder

 
.

 
	AddColumn

 &
<

& '
DateTime

' /
>

/ 0
(

0 1
name 
: 
$str (
,( )
table 
: 
$str $
,$ %
nullable 
: 
true 
) 
;  
} 	
	protected 
override 
void 
Down  $
($ %
MigrationBuilder% 5
migrationBuilder6 F
)F G
{ 	
migrationBuilder 
. 

DropColumn '
(' (
name 
: 
$str (
,( )
table 
: 
$str $
)$ %
;% &
} 	
} 
} ��
�D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\IdentityServer\ConfigurationDb\20210715060059_InitialIdentityServerConfigurationDbMigration.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "

Migrations" ,
., -
IdentityServer- ;
.; <
ConfigurationDb< K
{ 
public 

partial 
class 9
-InitialIdentityServerConfigurationDbMigration F
:G H
	MigrationI R
{ 
	protected		 
override		 
void		 
Up		  "
(		" #
MigrationBuilder		# 3
migrationBuilder		4 D
)		D E
{

 	
migrationBuilder 
. 
CreateTable (
(( )
name 
: 
$str $
,$ %
columns 
: 
table 
=> !
new" %
{ 
Id 
= 
table 
. 
Column %
<% &
int& )
>) *
(* +
nullable+ 3
:3 4
false5 :
): ;
. 

Annotation #
(# $
$str$ C
,C D(
MySqlValueGenerationStrategyE a
.a b
IdentityColumnb p
)p q
,q r
Enabled 
= 
table #
.# $
Column$ *
<* +
bool+ /
>/ 0
(0 1
nullable1 9
:9 :
false; @
)@ A
,A B
Name 
= 
table  
.  !
Column! '
<' (
string( .
>. /
(/ 0
	maxLength0 9
:9 :
$num; >
,> ?
nullable@ H
:H I
falseJ O
)O P
,P Q
DisplayName 
=  !
table" '
.' (
Column( .
<. /
string/ 5
>5 6
(6 7
	maxLength7 @
:@ A
$numB E
,E F
nullableG O
:O P
trueQ U
)U V
,V W
Description 
=  !
table" '
.' (
Column( .
<. /
string/ 5
>5 6
(6 7
	maxLength7 @
:@ A
$numB F
,F G
nullableH P
:P Q
trueR V
)V W
,W X/
#AllowedAccessTokenSigningAlgorithms 7
=8 9
table: ?
.? @
Column@ F
<F G
stringG M
>M N
(N O
	maxLengthO X
:X Y
$numZ ]
,] ^
nullable_ g
:g h
truei m
)m n
,n o#
ShowInDiscoveryDocument +
=, -
table. 3
.3 4
Column4 :
<: ;
bool; ?
>? @
(@ A
nullableA I
:I J
falseK P
)P Q
,Q R
Created 
= 
table #
.# $
Column$ *
<* +
DateTime+ 3
>3 4
(4 5
nullable5 =
:= >
false? D
)D E
,E F
Updated 
= 
table #
.# $
Column$ *
<* +
DateTime+ 3
>3 4
(4 5
nullable5 =
:= >
true? C
)C D
,D E
LastAccessed  
=! "
table# (
.( )
Column) /
</ 0
DateTime0 8
>8 9
(9 :
nullable: B
:B C
trueD H
)H I
,I J
NonEditable 
=  !
table" '
.' (
Column( .
<. /
bool/ 3
>3 4
(4 5
nullable5 =
:= >
false? D
)D E
} 
, 
constraints 
: 
table "
=># %
{ 
table 
. 

PrimaryKey $
($ %
$str% 6
,6 7
x8 9
=>: <
x= >
.> ?
Id? A
)A B
;B C
} 
) 
; 
migrationBuilder!! 
.!! 
CreateTable!! (
(!!( )
name"" 
:"" 
$str"" !
,""! "
columns## 
:## 
table## 
=>## !
new##" %
{$$ 
Id%% 
=%% 
table%% 
.%% 
Column%% %
<%%% &
int%%& )
>%%) *
(%%* +
nullable%%+ 3
:%%3 4
false%%5 :
)%%: ;
.&& 

Annotation&& #
(&&# $
$str&&$ C
,&&C D(
MySqlValueGenerationStrategy&&E a
.&&a b
IdentityColumn&&b p
)&&p q
,&&q r
Enabled'' 
='' 
table'' #
.''# $
Column''$ *
<''* +
bool''+ /
>''/ 0
(''0 1
nullable''1 9
:''9 :
false''; @
)''@ A
,''A B
Name(( 
=(( 
table((  
.((  !
Column((! '
<((' (
string((( .
>((. /
(((/ 0
	maxLength((0 9
:((9 :
$num((; >
,((> ?
nullable((@ H
:((H I
false((J O
)((O P
,((P Q
DisplayName)) 
=))  !
table))" '
.))' (
Column))( .
<)). /
string))/ 5
>))5 6
())6 7
	maxLength))7 @
:))@ A
$num))B E
,))E F
nullable))G O
:))O P
true))Q U
)))U V
,))V W
Description** 
=**  !
table**" '
.**' (
Column**( .
<**. /
string**/ 5
>**5 6
(**6 7
	maxLength**7 @
:**@ A
$num**B F
,**F G
nullable**H P
:**P Q
true**R V
)**V W
,**W X
Required++ 
=++ 
table++ $
.++$ %
Column++% +
<+++ ,
bool++, 0
>++0 1
(++1 2
nullable++2 :
:++: ;
false++< A
)++A B
,++B C
	Emphasize,, 
=,, 
table,,  %
.,,% &
Column,,& ,
<,,, -
bool,,- 1
>,,1 2
(,,2 3
nullable,,3 ;
:,,; <
false,,= B
),,B C
,,,C D#
ShowInDiscoveryDocument-- +
=--, -
table--. 3
.--3 4
Column--4 :
<--: ;
bool--; ?
>--? @
(--@ A
nullable--A I
:--I J
false--K P
)--P Q
}.. 
,.. 
constraints// 
:// 
table// "
=>//# %
{00 
table11 
.11 

PrimaryKey11 $
(11$ %
$str11% 3
,113 4
x115 6
=>117 9
x11: ;
.11; <
Id11< >
)11> ?
;11? @
}22 
)22 
;22 
migrationBuilder44 
.44 
CreateTable44 (
(44( )
name55 
:55 
$str55 
,55  
columns66 
:66 
table66 
=>66 !
new66" %
{77 
Id88 
=88 
table88 
.88 
Column88 %
<88% &
int88& )
>88) *
(88* +
nullable88+ 3
:883 4
false885 :
)88: ;
.99 

Annotation99 #
(99# $
$str99$ C
,99C D(
MySqlValueGenerationStrategy99E a
.99a b
IdentityColumn99b p
)99p q
,99q r
Enabled:: 
=:: 
table:: #
.::# $
Column::$ *
<::* +
bool::+ /
>::/ 0
(::0 1
nullable::1 9
:::9 :
false::; @
)::@ A
,::A B
ClientId;; 
=;; 
table;; $
.;;$ %
Column;;% +
<;;+ ,
string;;, 2
>;;2 3
(;;3 4
	maxLength;;4 =
:;;= >
$num;;? B
,;;B C
nullable;;D L
:;;L M
false;;N S
);;S T
,;;T U
ProtocolType<<  
=<<! "
table<<# (
.<<( )
Column<<) /
<<</ 0
string<<0 6
><<6 7
(<<7 8
	maxLength<<8 A
:<<A B
$num<<C F
,<<F G
nullable<<H P
:<<P Q
false<<R W
)<<W X
,<<X Y
RequireClientSecret== '
===( )
table==* /
.==/ 0
Column==0 6
<==6 7
bool==7 ;
>==; <
(==< =
nullable=== E
:==E F
false==G L
)==L M
,==M N

ClientName>> 
=>>  
table>>! &
.>>& '
Column>>' -
<>>- .
string>>. 4
>>>4 5
(>>5 6
	maxLength>>6 ?
:>>? @
$num>>A D
,>>D E
nullable>>F N
:>>N O
true>>P T
)>>T U
,>>U V
Description?? 
=??  !
table??" '
.??' (
Column??( .
<??. /
string??/ 5
>??5 6
(??6 7
	maxLength??7 @
:??@ A
$num??B F
,??F G
nullable??H P
:??P Q
true??R V
)??V W
,??W X
	ClientUri@@ 
=@@ 
table@@  %
.@@% &
Column@@& ,
<@@, -
string@@- 3
>@@3 4
(@@4 5
	maxLength@@5 >
:@@> ?
$num@@@ D
,@@D E
nullable@@F N
:@@N O
true@@P T
)@@T U
,@@U V
LogoUriAA 
=AA 
tableAA #
.AA# $
ColumnAA$ *
<AA* +
stringAA+ 1
>AA1 2
(AA2 3
	maxLengthAA3 <
:AA< =
$numAA> B
,AAB C
nullableAAD L
:AAL M
trueAAN R
)AAR S
,AAS T
RequireConsentBB "
=BB# $
tableBB% *
.BB* +
ColumnBB+ 1
<BB1 2
boolBB2 6
>BB6 7
(BB7 8
nullableBB8 @
:BB@ A
falseBBB G
)BBG H
,BBH I 
AllowRememberConsentCC (
=CC) *
tableCC+ 0
.CC0 1
ColumnCC1 7
<CC7 8
boolCC8 <
>CC< =
(CC= >
nullableCC> F
:CCF G
falseCCH M
)CCM N
,CCN O,
 AlwaysIncludeUserClaimsInIdTokenDD 4
=DD5 6
tableDD7 <
.DD< =
ColumnDD= C
<DDC D
boolDDD H
>DDH I
(DDI J
nullableDDJ R
:DDR S
falseDDT Y
)DDY Z
,DDZ [
RequirePkceEE 
=EE  !
tableEE" '
.EE' (
ColumnEE( .
<EE. /
boolEE/ 3
>EE3 4
(EE4 5
nullableEE5 =
:EE= >
falseEE? D
)EED E
,EEE F
AllowPlainTextPkceFF &
=FF' (
tableFF) .
.FF. /
ColumnFF/ 5
<FF5 6
boolFF6 :
>FF: ;
(FF; <
nullableFF< D
:FFD E
falseFFF K
)FFK L
,FFL M 
RequireRequestObjectGG (
=GG) *
tableGG+ 0
.GG0 1
ColumnGG1 7
<GG7 8
boolGG8 <
>GG< =
(GG= >
nullableGG> F
:GGF G
falseGGH M
)GGM N
,GGN O'
AllowAccessTokensViaBrowserHH /
=HH0 1
tableHH2 7
.HH7 8
ColumnHH8 >
<HH> ?
boolHH? C
>HHC D
(HHD E
nullableHHE M
:HHM N
falseHHO T
)HHT U
,HHU V!
FrontChannelLogoutUriII )
=II* +
tableII, 1
.II1 2
ColumnII2 8
<II8 9
stringII9 ?
>II? @
(II@ A
	maxLengthIIA J
:IIJ K
$numIIL P
,IIP Q
nullableIIR Z
:IIZ [
trueII\ `
)II` a
,IIa b-
!FrontChannelLogoutSessionRequiredJJ 5
=JJ6 7
tableJJ8 =
.JJ= >
ColumnJJ> D
<JJD E
boolJJE I
>JJI J
(JJJ K
nullableJJK S
:JJS T
falseJJU Z
)JJZ [
,JJ[ \ 
BackChannelLogoutUriKK (
=KK) *
tableKK+ 0
.KK0 1
ColumnKK1 7
<KK7 8
stringKK8 >
>KK> ?
(KK? @
	maxLengthKK@ I
:KKI J
$numKKK O
,KKO P
nullableKKQ Y
:KKY Z
trueKK[ _
)KK_ `
,KK` a,
 BackChannelLogoutSessionRequiredLL 4
=LL5 6
tableLL7 <
.LL< =
ColumnLL= C
<LLC D
boolLLD H
>LLH I
(LLI J
nullableLLJ R
:LLR S
falseLLT Y
)LLY Z
,LLZ [
AllowOfflineAccessMM &
=MM' (
tableMM) .
.MM. /
ColumnMM/ 5
<MM5 6
boolMM6 :
>MM: ;
(MM; <
nullableMM< D
:MMD E
falseMMF K
)MMK L
,MML M!
IdentityTokenLifetimeNN )
=NN* +
tableNN, 1
.NN1 2
ColumnNN2 8
<NN8 9
intNN9 <
>NN< =
(NN= >
nullableNN> F
:NNF G
falseNNH M
)NNM N
,NNN O1
%AllowedIdentityTokenSigningAlgorithmsOO 9
=OO: ;
tableOO< A
.OOA B
ColumnOOB H
<OOH I
stringOOI O
>OOO P
(OOP Q
	maxLengthOOQ Z
:OOZ [
$numOO\ _
,OO_ `
nullableOOa i
:OOi j
trueOOk o
)OOo p
,OOp q
AccessTokenLifetimePP '
=PP( )
tablePP* /
.PP/ 0
ColumnPP0 6
<PP6 7
intPP7 :
>PP: ;
(PP; <
nullablePP< D
:PPD E
falsePPF K
)PPK L
,PPL M%
AuthorizationCodeLifetimeQQ -
=QQ. /
tableQQ0 5
.QQ5 6
ColumnQQ6 <
<QQ< =
intQQ= @
>QQ@ A
(QQA B
nullableQQB J
:QQJ K
falseQQL Q
)QQQ R
,QQR S
ConsentLifetimeRR #
=RR$ %
tableRR& +
.RR+ ,
ColumnRR, 2
<RR2 3
intRR3 6
>RR6 7
(RR7 8
nullableRR8 @
:RR@ A
trueRRB F
)RRF G
,RRG H(
AbsoluteRefreshTokenLifetimeSS 0
=SS1 2
tableSS3 8
.SS8 9
ColumnSS9 ?
<SS? @
intSS@ C
>SSC D
(SSD E
nullableSSE M
:SSM N
falseSSO T
)SST U
,SSU V'
SlidingRefreshTokenLifetimeTT /
=TT0 1
tableTT2 7
.TT7 8
ColumnTT8 >
<TT> ?
intTT? B
>TTB C
(TTC D
nullableTTD L
:TTL M
falseTTN S
)TTS T
,TTT U
RefreshTokenUsageUU %
=UU& '
tableUU( -
.UU- .
ColumnUU. 4
<UU4 5
intUU5 8
>UU8 9
(UU9 :
nullableUU: B
:UUB C
falseUUD I
)UUI J
,UUJ K,
 UpdateAccessTokenClaimsOnRefreshVV 4
=VV5 6
tableVV7 <
.VV< =
ColumnVV= C
<VVC D
boolVVD H
>VVH I
(VVI J
nullableVVJ R
:VVR S
falseVVT Y
)VVY Z
,VVZ ["
RefreshTokenExpirationWW *
=WW+ ,
tableWW- 2
.WW2 3
ColumnWW3 9
<WW9 :
intWW: =
>WW= >
(WW> ?
nullableWW? G
:WWG H
falseWWI N
)WWN O
,WWO P
AccessTokenTypeXX #
=XX$ %
tableXX& +
.XX+ ,
ColumnXX, 2
<XX2 3
intXX3 6
>XX6 7
(XX7 8
nullableXX8 @
:XX@ A
falseXXB G
)XXG H
,XXH I
EnableLocalLoginYY $
=YY% &
tableYY' ,
.YY, -
ColumnYY- 3
<YY3 4
boolYY4 8
>YY8 9
(YY9 :
nullableYY: B
:YYB C
falseYYD I
)YYI J
,YYJ K
IncludeJwtIdZZ  
=ZZ! "
tableZZ# (
.ZZ( )
ColumnZZ) /
<ZZ/ 0
boolZZ0 4
>ZZ4 5
(ZZ5 6
nullableZZ6 >
:ZZ> ?
falseZZ@ E
)ZZE F
,ZZF G"
AlwaysSendClientClaims[[ *
=[[+ ,
table[[- 2
.[[2 3
Column[[3 9
<[[9 :
bool[[: >
>[[> ?
([[? @
nullable[[@ H
:[[H I
false[[J O
)[[O P
,[[P Q
ClientClaimsPrefix\\ &
=\\' (
table\\) .
.\\. /
Column\\/ 5
<\\5 6
string\\6 <
>\\< =
(\\= >
	maxLength\\> G
:\\G H
$num\\I L
,\\L M
nullable\\N V
:\\V W
true\\X \
)\\\ ]
,\\] ^
PairWiseSubjectSalt]] '
=]]( )
table]]* /
.]]/ 0
Column]]0 6
<]]6 7
string]]7 =
>]]= >
(]]> ?
	maxLength]]? H
:]]H I
$num]]J M
,]]M N
nullable]]O W
:]]W X
true]]Y ]
)]]] ^
,]]^ _
Created^^ 
=^^ 
table^^ #
.^^# $
Column^^$ *
<^^* +
DateTime^^+ 3
>^^3 4
(^^4 5
nullable^^5 =
:^^= >
false^^? D
)^^D E
,^^E F
Updated__ 
=__ 
table__ #
.__# $
Column__$ *
<__* +
DateTime__+ 3
>__3 4
(__4 5
nullable__5 =
:__= >
true__? C
)__C D
,__D E
LastAccessed``  
=``! "
table``# (
.``( )
Column``) /
<``/ 0
DateTime``0 8
>``8 9
(``9 :
nullable``: B
:``B C
true``D H
)``H I
,``I J
UserSsoLifetimeaa #
=aa$ %
tableaa& +
.aa+ ,
Columnaa, 2
<aa2 3
intaa3 6
>aa6 7
(aa7 8
nullableaa8 @
:aa@ A
trueaaB F
)aaF G
,aaG H
UserCodeTypebb  
=bb! "
tablebb# (
.bb( )
Columnbb) /
<bb/ 0
stringbb0 6
>bb6 7
(bb7 8
	maxLengthbb8 A
:bbA B
$numbbC F
,bbF G
nullablebbH P
:bbP Q
truebbR V
)bbV W
,bbW X
DeviceCodeLifetimecc &
=cc' (
tablecc) .
.cc. /
Columncc/ 5
<cc5 6
intcc6 9
>cc9 :
(cc: ;
nullablecc; C
:ccC D
falseccE J
)ccJ K
,ccK L
NonEditabledd 
=dd  !
tabledd" '
.dd' (
Columndd( .
<dd. /
booldd/ 3
>dd3 4
(dd4 5
nullabledd5 =
:dd= >
falsedd? D
)ddD E
}ee 
,ee 
constraintsff 
:ff 
tableff "
=>ff# %
{gg 
tablehh 
.hh 

PrimaryKeyhh $
(hh$ %
$strhh% 1
,hh1 2
xhh3 4
=>hh5 7
xhh8 9
.hh9 :
Idhh: <
)hh< =
;hh= >
}ii 
)ii 
;ii 
migrationBuilderkk 
.kk 
CreateTablekk (
(kk( )
namell 
:ll 
$strll )
,ll) *
columnsmm 
:mm 
tablemm 
=>mm !
newmm" %
{nn 
Idoo 
=oo 
tableoo 
.oo 
Columnoo %
<oo% &
intoo& )
>oo) *
(oo* +
nullableoo+ 3
:oo3 4
falseoo5 :
)oo: ;
.pp 

Annotationpp #
(pp# $
$strpp$ C
,ppC D(
MySqlValueGenerationStrategyppE a
.ppa b
IdentityColumnppb p
)ppp q
,ppq r
Enabledqq 
=qq 
tableqq #
.qq# $
Columnqq$ *
<qq* +
boolqq+ /
>qq/ 0
(qq0 1
nullableqq1 9
:qq9 :
falseqq; @
)qq@ A
,qqA B
Namerr 
=rr 
tablerr  
.rr  !
Columnrr! '
<rr' (
stringrr( .
>rr. /
(rr/ 0
	maxLengthrr0 9
:rr9 :
$numrr; >
,rr> ?
nullablerr@ H
:rrH I
falserrJ O
)rrO P
,rrP Q
DisplayNamess 
=ss  !
tabless" '
.ss' (
Columnss( .
<ss. /
stringss/ 5
>ss5 6
(ss6 7
	maxLengthss7 @
:ss@ A
$numssB E
,ssE F
nullablessG O
:ssO P
truessQ U
)ssU V
,ssV W
Descriptiontt 
=tt  !
tablett" '
.tt' (
Columntt( .
<tt. /
stringtt/ 5
>tt5 6
(tt6 7
	maxLengthtt7 @
:tt@ A
$numttB F
,ttF G
nullablettH P
:ttP Q
truettR V
)ttV W
,ttW X
Requireduu 
=uu 
tableuu $
.uu$ %
Columnuu% +
<uu+ ,
booluu, 0
>uu0 1
(uu1 2
nullableuu2 :
:uu: ;
falseuu< A
)uuA B
,uuB C
	Emphasizevv 
=vv 
tablevv  %
.vv% &
Columnvv& ,
<vv, -
boolvv- 1
>vv1 2
(vv2 3
nullablevv3 ;
:vv; <
falsevv= B
)vvB C
,vvC D#
ShowInDiscoveryDocumentww +
=ww, -
tableww. 3
.ww3 4
Columnww4 :
<ww: ;
boolww; ?
>ww? @
(ww@ A
nullablewwA I
:wwI J
falsewwK P
)wwP Q
,wwQ R
Createdxx 
=xx 
tablexx #
.xx# $
Columnxx$ *
<xx* +
DateTimexx+ 3
>xx3 4
(xx4 5
nullablexx5 =
:xx= >
falsexx? D
)xxD E
,xxE F
Updatedyy 
=yy 
tableyy #
.yy# $
Columnyy$ *
<yy* +
DateTimeyy+ 3
>yy3 4
(yy4 5
nullableyy5 =
:yy= >
trueyy? C
)yyC D
,yyD E
NonEditablezz 
=zz  !
tablezz" '
.zz' (
Columnzz( .
<zz. /
boolzz/ 3
>zz3 4
(zz4 5
nullablezz5 =
:zz= >
falsezz? D
)zzD E
}{{ 
,{{ 
constraints|| 
:|| 
table|| "
=>||# %
{}} 
table~~ 
.~~ 

PrimaryKey~~ $
(~~$ %
$str~~% ;
,~~; <
x~~= >
=>~~? A
x~~B C
.~~C D
Id~~D F
)~~F G
;~~G H
} 
) 
; 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� )
,
��) *
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Type
�� 
=
�� 
table
��  
.
��  !
Column
��! '
<
��' (
string
��( .
>
��. /
(
��/ 0
	maxLength
��0 9
:
��9 :
$num
��; >
,
��> ?
nullable
��@ H
:
��H I
false
��J O
)
��O P
,
��P Q
ApiResourceId
�� !
=
��" #
table
��$ )
.
��) *
Column
��* 0
<
��0 1
int
��1 4
>
��4 5
(
��5 6
nullable
��6 >
:
��> ?
false
��@ E
)
��E F
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% ;
,
��; <
x
��= >
=>
��? A
x
��B C
.
��C D
Id
��D F
)
��F G
;
��G H
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� O
,
��O P
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ApiResourceId
��' 4
,
��4 5
principalTable
�� &
:
��& '
$str
��( 6
,
��6 7
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� -
,
��- .
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Key
�� 
=
�� 
table
�� 
.
��  
Column
��  &
<
��& '
string
��' -
>
��- .
(
��. /
	maxLength
��/ 8
:
��8 9
$num
��: =
,
��= >
nullable
��? G
:
��G H
false
��I N
)
��N O
,
��O P
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< @
,
��@ A
nullable
��B J
:
��J K
false
��L Q
)
��Q R
,
��R S
ApiResourceId
�� !
=
��" #
table
��$ )
.
��) *
Column
��* 0
<
��0 1
int
��1 4
>
��4 5
(
��5 6
nullable
��6 >
:
��> ?
false
��@ E
)
��E F
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% ?
,
��? @
x
��A B
=>
��C E
x
��F G
.
��G H
Id
��H J
)
��J K
;
��K L
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� S
,
��S T
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ApiResourceId
��' 4
,
��4 5
principalTable
�� &
:
��& '
$str
��( 6
,
��6 7
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� )
,
��) *
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Scope
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< ?
,
��? @
nullable
��A I
:
��I J
false
��K P
)
��P Q
,
��Q R
ApiResourceId
�� !
=
��" #
table
��$ )
.
��) *
Column
��* 0
<
��0 1
int
��1 4
>
��4 5
(
��5 6
nullable
��6 >
:
��> ?
false
��@ E
)
��E F
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% ;
,
��; <
x
��= >
=>
��? A
x
��B C
.
��C D
Id
��D F
)
��F G
;
��G H
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� O
,
��O P
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ApiResourceId
��' 4
,
��4 5
principalTable
�� &
:
��& '
$str
��( 6
,
��6 7
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� *
,
��* +
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Description
�� 
=
��  !
table
��" '
.
��' (
Column
��( .
<
��. /
string
��/ 5
>
��5 6
(
��6 7
	maxLength
��7 @
:
��@ A
$num
��B F
,
��F G
nullable
��H P
:
��P Q
true
��R V
)
��V W
,
��W X
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< @
,
��@ A
nullable
��B J
:
��J K
false
��L Q
)
��Q R
,
��R S

Expiration
�� 
=
��  
table
��! &
.
��& '
Column
��' -
<
��- .
DateTime
��. 6
>
��6 7
(
��7 8
nullable
��8 @
:
��@ A
true
��B F
)
��F G
,
��G H
Type
�� 
=
�� 
table
��  
.
��  !
Column
��! '
<
��' (
string
��( .
>
��. /
(
��/ 0
	maxLength
��0 9
:
��9 :
$num
��; >
,
��> ?
nullable
��@ H
:
��H I
false
��J O
)
��O P
,
��P Q
Created
�� 
=
�� 
table
�� #
.
��# $
Column
��$ *
<
��* +
DateTime
��+ 3
>
��3 4
(
��4 5
nullable
��5 =
:
��= >
false
��? D
)
��D E
,
��E F
ApiResourceId
�� !
=
��" #
table
��$ )
.
��) *
Column
��* 0
<
��0 1
int
��1 4
>
��4 5
(
��5 6
nullable
��6 >
:
��> ?
false
��@ E
)
��E F
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% <
,
��< =
x
��> ?
=>
��@ B
x
��C D
.
��D E
Id
��E G
)
��G H
;
��H I
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� P
,
��P Q
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ApiResourceId
��' 4
,
��4 5
principalTable
�� &
:
��& '
$str
��( 6
,
��6 7
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� &
,
��& '
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Type
�� 
=
�� 
table
��  
.
��  !
Column
��! '
<
��' (
string
��( .
>
��. /
(
��/ 0
	maxLength
��0 9
:
��9 :
$num
��; >
,
��> ?
nullable
��@ H
:
��H I
false
��J O
)
��O P
,
��P Q
ScopeId
�� 
=
�� 
table
�� #
.
��# $
Column
��$ *
<
��* +
int
��+ .
>
��. /
(
��/ 0
nullable
��0 8
:
��8 9
false
��: ?
)
��? @
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% 8
,
��8 9
x
��: ;
=>
��< >
x
��? @
.
��@ A
Id
��A C
)
��C D
;
��D E
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� C
,
��C D
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ScopeId
��' .
,
��. /
principalTable
�� &
:
��& '
$str
��( 3
,
��3 4
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� *
,
��* +
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Key
�� 
=
�� 
table
�� 
.
��  
Column
��  &
<
��& '
string
��' -
>
��- .
(
��. /
	maxLength
��/ 8
:
��8 9
$num
��: =
,
��= >
nullable
��? G
:
��G H
false
��I N
)
��N O
,
��O P
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< @
,
��@ A
nullable
��B J
:
��J K
false
��L Q
)
��Q R
,
��R S
ScopeId
�� 
=
�� 
table
�� #
.
��# $
Column
��$ *
<
��* +
int
��+ .
>
��. /
(
��/ 0
nullable
��0 8
:
��8 9
false
��: ?
)
��? @
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% <
,
��< =
x
��> ?
=>
��@ B
x
��C D
.
��D E
Id
��E G
)
��G H
;
��H I
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� G
,
��G H
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ScopeId
��' .
,
��. /
principalTable
�� &
:
��& '
$str
��( 3
,
��3 4
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� $
,
��$ %
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Type
�� 
=
�� 
table
��  
.
��  !
Column
��! '
<
��' (
string
��( .
>
��. /
(
��/ 0
	maxLength
��0 9
:
��9 :
$num
��; >
,
��> ?
nullable
��@ H
:
��H I
false
��J O
)
��O P
,
��P Q
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< ?
,
��? @
nullable
��A I
:
��I J
false
��K P
)
��P Q
,
��Q R
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% 6
,
��6 7
x
��8 9
=>
��: <
x
��= >
.
��> ?
Id
��? A
)
��A B
;
��B C
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� @
,
��@ A
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� )
,
��) *
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Origin
�� 
=
�� 
table
�� "
.
��" #
Column
��# )
<
��) *
string
��* 0
>
��0 1
(
��1 2
	maxLength
��2 ;
:
��; <
$num
��= @
,
��@ A
nullable
��B J
:
��J K
false
��L Q
)
��Q R
,
��R S
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% ;
,
��; <
x
��= >
=>
��? A
x
��B C
.
��C D
Id
��D F
)
��F G
;
��G H
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� E
,
��E F
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� (
,
��( )
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
	GrantType
�� 
=
�� 
table
��  %
.
��% &
Column
��& ,
<
��, -
string
��- 3
>
��3 4
(
��4 5
	maxLength
��5 >
:
��> ?
$num
��@ C
,
��C D
nullable
��E M
:
��M N
false
��O T
)
��T U
,
��U V
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% :
,
��: ;
x
��< =
=>
��> @
x
��A B
.
��B C
Id
��C E
)
��E F
;
��F G
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� D
,
��D E
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� -
,
��- .
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Provider
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
string
��, 2
>
��2 3
(
��3 4
	maxLength
��4 =
:
��= >
$num
��? B
,
��B C
nullable
��D L
:
��L M
false
��N S
)
��S T
,
��T U
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% ?
,
��? @
x
��A B
=>
��C E
x
��F G
.
��G H
Id
��H J
)
��J K
;
��K L
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� I
,
��I J
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� 4
,
��4 5
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r#
PostLogoutRedirectUri
�� )
=
��* +
table
��, 1
.
��1 2
Column
��2 8
<
��8 9
string
��9 ?
>
��? @
(
��@ A
	maxLength
��A J
:
��J K
$num
��L P
,
��P Q
nullable
��R Z
:
��Z [
false
��\ a
)
��a b
,
��b c
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% F
,
��F G
x
��H I
=>
��J L
x
��M N
.
��N O
Id
��O Q
)
��Q R
;
��R S
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� P
,
��P Q
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� (
,
��( )
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Key
�� 
=
�� 
table
�� 
.
��  
Column
��  &
<
��& '
string
��' -
>
��- .
(
��. /
	maxLength
��/ 8
:
��8 9
$num
��: =
,
��= >
nullable
��? G
:
��G H
false
��I N
)
��N O
,
��O P
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< @
,
��@ A
nullable
��B J
:
��J K
false
��L Q
)
��Q R
,
��R S
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% :
,
��: ;
x
��< =
=>
��> @
x
��A B
.
��B C
Id
��C E
)
��E F
;
��F G
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� D
,
��D E
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� *
,
��* +
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
RedirectUri
�� 
=
��  !
table
��" '
.
��' (
Column
��( .
<
��. /
string
��/ 5
>
��5 6
(
��6 7
	maxLength
��7 @
:
��@ A
$num
��B F
,
��F G
nullable
��H P
:
��P Q
false
��R W
)
��W X
,
��X Y
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% <
,
��< =
x
��> ?
=>
��@ B
x
��C D
.
��D E
Id
��E G
)
��G H
;
��H I
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� F
,
��F G
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� $
,
��$ %
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Scope
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< ?
,
��? @
nullable
��A I
:
��I J
false
��K P
)
��P Q
,
��Q R
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% 6
,
��6 7
x
��8 9
=>
��: <
x
��= >
.
��> ?
Id
��? A
)
��A B
;
��B C
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� @
,
��@ A
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� %
,
��% &
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Description
�� 
=
��  !
table
��" '
.
��' (
Column
��( .
<
��. /
string
��/ 5
>
��5 6
(
��6 7
	maxLength
��7 @
:
��@ A
$num
��B F
,
��F G
nullable
��H P
:
��P Q
true
��R V
)
��V W
,
��W X
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< @
,
��@ A
nullable
��B J
:
��J K
false
��L Q
)
��Q R
,
��R S

Expiration
�� 
=
��  
table
��! &
.
��& '
Column
��' -
<
��- .
DateTime
��. 6
>
��6 7
(
��7 8
nullable
��8 @
:
��@ A
true
��B F
)
��F G
,
��G H
Type
�� 
=
�� 
table
��  
.
��  !
Column
��! '
<
��' (
string
��( .
>
��. /
(
��/ 0
	maxLength
��0 9
:
��9 :
$num
��; >
,
��> ?
nullable
��@ H
:
��H I
false
��J O
)
��O P
,
��P Q
Created
�� 
=
�� 
table
�� #
.
��# $
Column
��$ *
<
��* +
DateTime
��+ 3
>
��3 4
(
��4 5
nullable
��5 =
:
��= >
false
��? D
)
��D E
,
��E F
ClientId
�� 
=
�� 
table
�� $
.
��$ %
Column
��% +
<
��+ ,
int
��, /
>
��/ 0
(
��0 1
nullable
��1 9
:
��9 :
false
��; @
)
��@ A
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% 7
,
��7 8
x
��9 :
=>
��; =
x
��> ?
.
��? @
Id
��@ B
)
��B C
;
��C D
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� A
,
��A B
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& '
ClientId
��' /
,
��/ 0
principalTable
�� &
:
��& '
$str
��( 1
,
��1 2
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� .
,
��. /
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Type
�� 
=
�� 
table
��  
.
��  !
Column
��! '
<
��' (
string
��( .
>
��. /
(
��/ 0
	maxLength
��0 9
:
��9 :
$num
��; >
,
��> ?
nullable
��@ H
:
��H I
false
��J O
)
��O P
,
��P Q 
IdentityResourceId
�� &
=
��' (
table
��) .
.
��. /
Column
��/ 5
<
��5 6
int
��6 9
>
��9 :
(
��: ;
nullable
��; C
:
��C D
false
��E J
)
��J K
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% @
,
��@ A
x
��B C
=>
��D F
x
��G H
.
��H I
Id
��I K
)
��K L
;
��L M
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� ^
,
��^ _
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& ' 
IdentityResourceId
��' 9
,
��9 :
principalTable
�� &
:
��& '
$str
��( ;
,
��; <
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateTable
�� (
(
��( )
name
�� 
:
�� 
$str
�� 2
,
��2 3
columns
�� 
:
�� 
table
�� 
=>
�� !
new
��" %
{
�� 
Id
�� 
=
�� 
table
�� 
.
�� 
Column
�� %
<
��% &
int
��& )
>
��) *
(
��* +
nullable
��+ 3
:
��3 4
false
��5 :
)
��: ;
.
�� 

Annotation
�� #
(
��# $
$str
��$ C
,
��C D*
MySqlValueGenerationStrategy
��E a
.
��a b
IdentityColumn
��b p
)
��p q
,
��q r
Key
�� 
=
�� 
table
�� 
.
��  
Column
��  &
<
��& '
string
��' -
>
��- .
(
��. /
	maxLength
��/ 8
:
��8 9
$num
��: =
,
��= >
nullable
��? G
:
��G H
false
��I N
)
��N O
,
��O P
Value
�� 
=
�� 
table
�� !
.
��! "
Column
��" (
<
��( )
string
��) /
>
��/ 0
(
��0 1
	maxLength
��1 :
:
��: ;
$num
��< @
,
��@ A
nullable
��B J
:
��J K
false
��L Q
)
��Q R
,
��R S 
IdentityResourceId
�� &
=
��' (
table
��) .
.
��. /
Column
��/ 5
<
��5 6
int
��6 9
>
��9 :
(
��: ;
nullable
��; C
:
��C D
false
��E J
)
��J K
}
�� 
,
�� 
constraints
�� 
:
�� 
table
�� "
=>
��# %
{
�� 
table
�� 
.
�� 

PrimaryKey
�� $
(
��$ %
$str
��% D
,
��D E
x
��F G
=>
��H J
x
��K L
.
��L M
Id
��M O
)
��O P
;
��P Q
table
�� 
.
�� 

ForeignKey
�� $
(
��$ %
name
�� 
:
�� 
$str
�� `
,
��` a
column
�� 
:
�� 
x
��  !
=>
��" $
x
��% &
.
��& ' 
IdentityResourceId
��' 9
,
��9 :
principalTable
�� &
:
��& '
$str
��( ;
,
��; <
principalColumn
�� '
:
��' (
$str
��) -
,
��- .
onDelete
��  
:
��  !
ReferentialAction
��" 3
.
��3 4
Cascade
��4 ;
)
��; <
;
��< =
}
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� :
,
��: ;
table
�� 
:
�� 
$str
�� *
,
��* +
column
�� 
:
�� 
$str
�� '
)
��' (
;
��( )
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� >
,
��> ?
table
�� 
:
�� 
$str
�� .
,
��. /
column
�� 
:
�� 
$str
�� '
)
��' (
;
��( )
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� ,
,
��, -
table
�� 
:
�� 
$str
�� %
,
��% &
column
�� 
:
�� 
$str
�� 
,
�� 
unique
�� 
:
�� 
true
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� :
,
��: ;
table
�� 
:
�� 
$str
�� *
,
��* +
column
�� 
:
�� 
$str
�� '
)
��' (
;
��( )
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� ;
,
��; <
table
�� 
:
�� 
$str
�� +
,
��+ ,
column
�� 
:
�� 
$str
�� '
)
��' (
;
��( )
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 1
,
��1 2
table
�� 
:
�� 
$str
�� '
,
��' (
column
�� 
:
�� 
$str
�� !
)
��! "
;
��" #
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 5
,
��5 6
table
�� 
:
�� 
$str
�� +
,
��+ ,
column
�� 
:
�� 
$str
�� !
)
��! "
;
��" #
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� )
,
��) *
table
�� 
:
�� 
$str
�� "
,
��" #
column
�� 
:
�� 
$str
�� 
,
�� 
unique
�� 
:
�� 
true
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 0
,
��0 1
table
�� 
:
�� 
$str
�� %
,
��% &
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 5
,
��5 6
table
�� 
:
�� 
$str
�� *
,
��* +
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 4
,
��4 5
table
�� 
:
�� 
$str
�� )
,
��) *
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 9
,
��9 :
table
�� 
:
�� 
$str
�� .
,
��. /
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� @
,
��@ A
table
�� 
:
�� 
$str
�� 5
,
��5 6
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 4
,
��4 5
table
�� 
:
�� 
$str
�� )
,
��) *
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 6
,
��6 7
table
�� 
:
�� 
$str
�� +
,
��+ ,
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� +
,
��+ ,
table
�� 
:
�� 
$str
��  
,
��  !
column
�� 
:
�� 
$str
�� "
,
��" #
unique
�� 
:
�� 
true
�� 
)
�� 
;
�� 
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 0
,
��0 1
table
�� 
:
�� 
$str
�� %
,
��% &
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 1
,
��1 2
table
�� 
:
�� 
$str
�� &
,
��& '
column
�� 
:
�� 
$str
�� "
)
��" #
;
��# $
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� D
,
��D E
table
�� 
:
�� 
$str
�� /
,
��/ 0
column
�� 
:
�� 
$str
�� ,
)
��, -
;
��- .
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� H
,
��H I
table
�� 
:
�� 
$str
�� 3
,
��3 4
column
�� 
:
�� 
$str
�� ,
)
��, -
;
��- .
migrationBuilder
�� 
.
�� 
CreateIndex
�� (
(
��( )
name
�� 
:
�� 
$str
�� 1
,
��1 2
table
�� 
:
�� 
$str
�� *
,
��* +
column
�� 
:
�� 
$str
�� 
,
�� 
unique
�� 
:
�� 
true
�� 
)
�� 
;
�� 
}
�� 	
	protected
�� 
override
�� 
void
�� 
Down
��  $
(
��$ %
MigrationBuilder
��% 5
migrationBuilder
��6 F
)
��F G
{
�� 	
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� )
)
��) *
;
��* +
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� -
)
��- .
;
��. /
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� )
)
��) *
;
��* +
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� *
)
��* +
;
��+ ,
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� &
)
��& '
;
��' (
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� *
)
��* +
;
��+ ,
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� $
)
��$ %
;
��% &
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� )
)
��) *
;
��* +
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� (
)
��( )
;
��) *
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� -
)
��- .
;
��. /
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� 4
)
��4 5
;
��5 6
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� (
)
��( )
;
��) *
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� *
)
��* +
;
��+ ,
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� $
)
��$ %
;
��% &
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� %
)
��% &
;
��& '
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� .
)
��. /
;
��/ 0
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� 2
)
��2 3
;
��3 4
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� $
)
��$ %
;
��% &
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� !
)
��! "
;
��" #
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� 
)
��  
;
��  !
migrationBuilder
�� 
.
�� 
	DropTable
�� &
(
��& '
name
�� 
:
�� 
$str
�� )
)
��) *
;
��* +
}
�� 	
}
�� 
}�� �N
�D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\IdentityServer\PersistedGrantDb\20210715060145_InitialPersistedGrantDbMigration.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Data !
.! "

Migrations" ,
., -
IdentityServer- ;
.; <
PersistedGrantDb< L
{ 
public 

partial 
class ,
 InitialPersistedGrantDbMigration 9
:: ;
	Migration< E
{ 
	protected 
override 
void 
Up  "
(" #
MigrationBuilder# 3
migrationBuilder4 D
)D E
{		 	
migrationBuilder

 
.

 
CreateTable

 (
(

( )
name 
: 
$str #
,# $
columns 
: 
table 
=> !
new" %
{ 
UserCode 
= 
table $
.$ %
Column% +
<+ ,
string, 2
>2 3
(3 4
	maxLength4 =
:= >
$num? B
,B C
nullableD L
:L M
falseN S
)S T
,T U

DeviceCode 
=  
table! &
.& '
Column' -
<- .
string. 4
>4 5
(5 6
	maxLength6 ?
:? @
$numA D
,D E
nullableF N
:N O
falseP U
)U V
,V W
	SubjectId 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
	SessionId 
= 
table  %
.% &
Column& ,
<, -
string- 3
>3 4
(4 5
	maxLength5 >
:> ?
$num@ C
,C D
nullableE M
:M N
trueO S
)S T
,T U
ClientId 
= 
table $
.$ %
Column% +
<+ ,
string, 2
>2 3
(3 4
	maxLength4 =
:= >
$num? B
,B C
nullableD L
:L M
falseN S
)S T
,T U
Description 
=  !
table" '
.' (
Column( .
<. /
string/ 5
>5 6
(6 7
	maxLength7 @
:@ A
$numB E
,E F
nullableG O
:O P
trueQ U
)U V
,V W
CreationTime  
=! "
table# (
.( )
Column) /
</ 0
DateTime0 8
>8 9
(9 :
nullable: B
:B C
falseD I
)I J
,J K

Expiration 
=  
table! &
.& '
Column' -
<- .
DateTime. 6
>6 7
(7 8
nullable8 @
:@ A
falseB G
)G H
,H I
Data 
= 
table  
.  !
Column! '
<' (
string( .
>. /
(/ 0
	maxLength0 9
:9 :
$num; @
,@ A
nullableB J
:J K
falseL Q
)Q R
} 
, 
constraints 
: 
table "
=># %
{ 
table 
. 

PrimaryKey $
($ %
$str% 5
,5 6
x7 8
=>9 ;
x< =
.= >
UserCode> F
)F G
;G H
} 
) 
; 
migrationBuilder 
. 
CreateTable (
(( )
name 
: 
$str '
,' (
columns 
: 
table 
=> !
new" %
{   
Key!! 
=!! 
table!! 
.!!  
Column!!  &
<!!& '
string!!' -
>!!- .
(!!. /
	maxLength!!/ 8
:!!8 9
$num!!: =
,!!= >
nullable!!? G
:!!G H
false!!I N
)!!N O
,!!O P
Type"" 
="" 
table""  
.""  !
Column""! '
<""' (
string""( .
>"". /
(""/ 0
	maxLength""0 9
:""9 :
$num""; =
,""= >
nullable""? G
:""G H
false""I N
)""N O
,""O P
	SubjectId## 
=## 
table##  %
.##% &
Column##& ,
<##, -
string##- 3
>##3 4
(##4 5
	maxLength##5 >
:##> ?
$num##@ C
,##C D
nullable##E M
:##M N
true##O S
)##S T
,##T U
	SessionId$$ 
=$$ 
table$$  %
.$$% &
Column$$& ,
<$$, -
string$$- 3
>$$3 4
($$4 5
	maxLength$$5 >
:$$> ?
$num$$@ C
,$$C D
nullable$$E M
:$$M N
true$$O S
)$$S T
,$$T U
ClientId%% 
=%% 
table%% $
.%%$ %
Column%%% +
<%%+ ,
string%%, 2
>%%2 3
(%%3 4
	maxLength%%4 =
:%%= >
$num%%? B
,%%B C
nullable%%D L
:%%L M
false%%N S
)%%S T
,%%T U
Description&& 
=&&  !
table&&" '
.&&' (
Column&&( .
<&&. /
string&&/ 5
>&&5 6
(&&6 7
	maxLength&&7 @
:&&@ A
$num&&B E
,&&E F
nullable&&G O
:&&O P
true&&Q U
)&&U V
,&&V W
CreationTime''  
=''! "
table''# (
.''( )
Column'') /
<''/ 0
DateTime''0 8
>''8 9
(''9 :
nullable'': B
:''B C
false''D I
)''I J
,''J K

Expiration(( 
=((  
table((! &
.((& '
Column((' -
<((- .
DateTime((. 6
>((6 7
(((7 8
nullable((8 @
:((@ A
true((B F
)((F G
,((G H
ConsumedTime))  
=))! "
table))# (
.))( )
Column))) /
<))/ 0
DateTime))0 8
>))8 9
())9 :
nullable)): B
:))B C
true))D H
)))H I
,))I J
Data** 
=** 
table**  
.**  !
Column**! '
<**' (
string**( .
>**. /
(**/ 0
	maxLength**0 9
:**9 :
$num**; @
,**@ A
nullable**B J
:**J K
false**L Q
)**Q R
}++ 
,++ 
constraints,, 
:,, 
table,, "
=>,,# %
{-- 
table.. 
... 

PrimaryKey.. $
(..$ %
$str..% 9
,..9 :
x..; <
=>..= ?
x..@ A
...A B
Key..B E
)..E F
;..F G
}// 
)// 
;// 
migrationBuilder11 
.11 
CreateIndex11 (
(11( )
name22 
:22 
$str22 1
,221 2
table33 
:33 
$str33 $
,33$ %
column44 
:44 
$str44 $
,44$ %
unique55 
:55 
true55 
)55 
;55 
migrationBuilder77 
.77 
CreateIndex77 (
(77( )
name88 
:88 
$str88 1
,881 2
table99 
:99 
$str99 $
,99$ %
column:: 
::: 
$str:: $
)::$ %
;::% &
migrationBuilder<< 
.<< 
CreateIndex<< (
(<<( )
name== 
:== 
$str== 5
,==5 6
table>> 
:>> 
$str>> (
,>>( )
column?? 
:?? 
$str?? $
)??$ %
;??% &
migrationBuilderAA 
.AA 
CreateIndexAA (
(AA( )
nameBB 
:BB 
$strBB B
,BBB C
tableCC 
:CC 
$strCC (
,CC( )
columnsDD 
:DD 
newDD 
[DD 
]DD 
{DD  
$strDD! ,
,DD, -
$strDD. 8
,DD8 9
$strDD: @
}DDA B
)DDB C
;DDC D
migrationBuilderFF 
.FF 
CreateIndexFF (
(FF( )
nameGG 
:GG 
$strGG C
,GGC D
tableHH 
:HH 
$strHH (
,HH( )
columnsII 
:II 
newII 
[II 
]II 
{II  
$strII! ,
,II, -
$strII. 9
,II9 :
$strII; A
}IIB C
)IIC D
;IID E
}JJ 	
	protectedLL 
overrideLL 
voidLL 
DownLL  $
(LL$ %
MigrationBuilderLL% 5
migrationBuilderLL6 F
)LLF G
{MM 	
migrationBuilderNN 
.NN 
	DropTableNN &
(NN& '
nameOO 
:OO 
$strOO #
)OO# $
;OO$ %
migrationBuilderQQ 
.QQ 
	DropTableQQ &
(QQ& '
nameRR 
:RR 
$strRR '
)RR' (
;RR( )
}SS 	
}TT 
}UU �E
AD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Seed\Config.cs
	namespace

 	
FJT


 
.

 
IdentityServer

 
.

 
Data

 !
.

! "
Seed

" &
{ 
public 

static 
class 
Config 
{ 
public 
static 
IEnumerable !
<! "
IdentityResource" 2
>2 3 
GetIdentityResources4 H
(H I
)I J
{ 	
return 
new 
List 
< 
IdentityResource ,
>, -
{ 
new 
IdentityResources %
.% &
OpenId& ,
(, -
)- .
,. /
new 
IdentityResources %
.% &
Profile& -
(- .
). /
,/ 0
} 
; 
} 	
public 
static 
IEnumerable !
<! "
ApiScope" *
>* +
GetApiScopes, 8
(8 9
)9 :
{ 	
return 
new 
List 
< 
ApiScope $
>$ %
{ 
new 
ApiScope 
( 
$str .
,. /
$str/ B
)B C
,C D
new 
ApiScope 
( 
$str 0
,0 1
$str1 F
)F G
,G H
new 
ApiScope 
( 
$str *
,* +
$str+ :
): ;
,; <
new 
ApiScope 
( 
$str 0
,0 1
$str1 F
)F G
}   
;   
}"" 	
public$$ 
static$$ 
IEnumerable$$ !
<$$! "
ApiResource$$" -
>$$- .
GetApis$$/ 6
($$6 7
)$$7 8
{%% 	
return&& 
new&& 
List&& 
<&& 
ApiResource&& '
>&&' (
{'' 
new(( 
ApiResource(( 
{((  
Name)) 
=)) 
ClientConstant)) )
.))) *
APIResource))* 5
.))5 6
IdentityServerAPI))6 G
.))G H
ToString))H P
())P Q
)))Q R
,))R S
DisplayName** 
=**  !
ClientConstant**" 0
.**0 1
	APIScopes**1 :
.**: ;
IdentityServerAPI**; L
.**L M
GetDisplayValue**M \
(**\ ]
)**] ^
,**^ _
Scopes++ 
=++ 
new++  
List++! %
<++% &
string++& ,
>++, -
{++- .
ClientConstant++/ =
.++= >
	APIScopes++> G
.++G H
IdentityServerAPI++H Y
.++Y Z
ToString++Z b
(++b c
)++c d
}++e f
},, 
,,, 
new-- 
ApiResource-- 
{.. 
Name// 
=// 
ClientConstant// )
.//) *
APIResource//* 5
.//5 6
Q2CAPI//6 <
.//< =
ToString//= E
(//E F
)//F G
,//G H
DisplayName00 
=00  !
ClientConstant00" 0
.000 1
APIResource001 <
.00< =
Q2CAPI00= C
.00C D
GetDisplayValue00D S
(00S T
)00T U
,00U V
Scopes11 
=11 
new11  
List11! %
<11% &
string11& ,
>11, -
{11- .
ClientConstant22 &
.22& '
	APIScopes22' 0
.220 1
Q2CFrontEnd221 <
.22< =
ToString22= E
(22E F
)22F G
,22G H
ClientConstant33 &
.33& '
	APIScopes33' 0
.330 1
Q2CReportDesigner331 B
.33B C
ToString33C K
(33K L
)33L M
,33M N
ClientConstant44 &
.44& '
	APIScopes44' 0
.440 1
Q2CReportViewer441 @
.44@ A
ToString44A I
(44I J
)44J K
}55 
,55 

ApiSecrets66 
=66  
new66! $
List66% )
<66) *
Secret66* 0
>660 1
{77 
new88 
Secret88 "
(88" #
ClientConstant88# 1
.881 2
Q2CAPISecret882 >
.88> ?
Sha25688? E
(88E F
)88F G
)88G H
}99 
}:: 
};; 
;;; 
}<< 	
public>> 
static>> 
IEnumerable>> !
<>>! "
Client>>" (
>>>( )

GetClients>>* 4
(>>4 5
)>>5 6
{?? 	
return@@ 
new@@ 
List@@ 
<@@ 
Client@@ "
>@@" #
{AA 
newBB 
ClientBB 
{CC 
ClientIdDD 
=DD 
$strDD '
,DD' (
AllowedGrantTypesGG %
=GG& '

GrantTypesGG( 2
.GG2 3
ClientCredentialsGG3 D
,GGD E
ClientSecretsJJ !
=JJ" #
{KK 
newLL 
SecretLL "
(LL" #
$strLL# +
.LL+ ,
Sha256LL, 2
(LL2 3
)LL3 4
)LL4 5
}MM 
,MM 
AllowedScopesPP !
=PP" #
{PP$ %
$strPP& /
}PP0 1
}QQ 
,QQ 
newSS 
ClientSS 
{TT 
ClientIdUU 
=UU 
$strUU *
,UU* +
AllowedGrantTypesVV %
=VV& '

GrantTypesVV( 2
.VV2 3!
ResourceOwnerPasswordVV3 H
,VVH I
ClientSecretsXX !
=XX" #
{YY 
newZZ 
SecretZZ "
(ZZ" #
$strZZ# +
.ZZ+ ,
Sha256ZZ, 2
(ZZ2 3
)ZZ3 4
)ZZ4 5
}[[ 
,[[ 
AllowedScopes\\ !
=\\" #
{\\$ %
$str\\& /
}\\0 1
}]] 
,]] 
new__ 
Client__ 
{`` 
ClientIdaa 
=aa 
$straa $
,aa$ %

ClientNamebb 
=bb  
$strbb! -
,bb- .
AllowedGrantTypescc %
=cc& '

GrantTypescc( 2
.cc2 3
Hybridcc3 9
,cc9 :
ClientSecretsee !
=ee" #
{ff 
newgg 
Secretgg "
(gg" #
$strgg# +
.gg+ ,
Sha256gg, 2
(gg2 3
)gg3 4
)gg4 5
}hh 
,hh 
RedirectUrisjj  
=jj+ ,
{jj- .
$strjj/ R
}jjS T
,jjT U"
PostLogoutRedirectUriskk *
=kk+ ,
{kk- .
$strkk/ \
}kk] ^
,kk^ _
AllowedScopesmm !
=mm" #
{nn #
IdentityServerConstantsoo /
.oo/ 0
StandardScopesoo0 >
.oo> ?
OpenIdoo? E
,ooE F#
IdentityServerConstantspp /
.pp/ 0
StandardScopespp0 >
.pp> ?
Profilepp? F
,ppF G
$strqq !
}rr 
,rr 
AllowOfflineAccesstt &
=tt' (
truett) -
}uu 
,uu 
newww 
Clientww 
{xx 
ClientIdyy 
=yy 
$stryy #
,yy# $

ClientNamezz 
=zz  
$strzz! 4
,zz4 5
AllowedGrantTypes{{ %
={{& '

GrantTypes{{( 2
.{{2 3
Code{{3 7
,{{7 8
RequirePkce|| 
=||  !
true||" &
,||& '
RequireClientSecret}} '
=}}( )
false}}* /
,}}/ 0
RedirectUris  
=! "
{- .
$str/ T
}U V
,V W$
PostLogoutRedirectUris
�� *
=
��+ ,
{
��- .
$str
��/ Q
}
��R S
,
��S T 
AllowedCorsOrigins
�� &
=
��' (
{
��- .
$str
��/ F
}
��G H
,
��H I#
FrontChannelLogoutUri
�� )
=
��* +
$str
��, V
,
��V W
AllowedScopes
�� !
=
��" #
{
�� %
IdentityServerConstants
�� /
.
��/ 0
StandardScopes
��0 >
.
��> ?
OpenId
��? E
,
��E F%
IdentityServerConstants
�� /
.
��/ 0
StandardScopes
��0 >
.
��> ?
Profile
��? F
,
��F G
$str
�� !
}
�� 
}
�� 
}
�� 
;
�� 
}
�� 	
}
�� 
}�� �R
@D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Seed\Users.cs
	namespace

 	
FJT


 
.

 
IdentityServer

 
.

 
Data

 !
.

! "
Seed

" &
{ 
public 

class 
Users 
{ 
public 
static 
void 
EnsureSeedData )
() *
string* 0
connectionString1 A
)A B
{ 	
var 
services 
= 
new 
ServiceCollection 0
(0 1
)1 2
;2 3
services 
. 
AddDbContext !
<! " 
FJTIdentityDbContext" 6
>6 7
(7 8
options8 ?
=>@ B
options 
. 
UseMySql 
(  
connectionString  0
)0 1
)1 2
;2 3
services 
. 
AddDefaultIdentity '
<' (
ApplicationUser( 7
>7 8
(8 9
)9 :
. 
AddRoles 
< 
ApplicationRole '
>' (
(( )
)) *
. $
AddEntityFrameworkStores '
<' ( 
FJTIdentityDbContext( <
>< =
(= >
)> ?
;? @
using 
( 
var 
serviceProvider &
=' (
services) 1
.1 2 
BuildServiceProvider2 F
(F G
)G H
)H I
{ 
using 
( 
var 
scope  
=! "
serviceProvider# 2
.2 3
GetRequiredService3 E
<E F 
IServiceScopeFactoryF Z
>Z [
([ \
)\ ]
.] ^
CreateScope^ i
(i j
)j k
)k l
{ 
var   
context   
=    !
scope  " '
.  ' (
ServiceProvider  ( 7
.  7 8

GetService  8 B
<  B C 
FJTIdentityDbContext  C W
>  W X
(  X Y
)  Y Z
;  Z [
context!! 
.!! 
Database!! $
.!!$ %
Migrate!!% ,
(!!, -
)!!- .
;!!. /
var## 
userMgr## 
=##  !
scope##" '
.##' (
ServiceProvider##( 7
.##7 8
GetRequiredService##8 J
<##J K
UserManager##K V
<##V W
ApplicationUser##W f
>##f g
>##g h
(##h i
)##i j
;##j k
var$$ 
alice$$ 
=$$ 
userMgr$$  '
.$$' (
FindByNameAsync$$( 7
($$7 8
$str$$8 ?
)$$? @
.$$@ A
Result$$A G
;$$G H
if%% 
(%% 
alice%% 
==%%  
null%%! %
)%%% &
{&& 
alice'' 
='' 
new''  #
ApplicationUser''$ 3
{(( 
UserName)) $
=))% &
$str))' .
,)). /
Email** !
=**" #
$str**$ :
,**: ;
EmailConfirmed++ *
=+++ ,
true++- 1
},, 
;,, 
var-- 
result-- "
=--# $
userMgr--% ,
.--, -
CreateAsync--- 8
(--8 9
alice--9 >
,--> ?
$str--@ W
)--W X
.--X Y
Result--Y _
;--_ `
if.. 
(.. 
!.. 
result.. #
...# $
	Succeeded..$ -
)..- .
{// 
throw00 !
new00" %
	Exception00& /
(00/ 0
result000 6
.006 7
Errors007 =
.00= >
First00> C
(00C D
)00D E
.00E F
Description00F Q
)00Q R
;00R S
}11 
result33 
=33  
userMgr33! (
.33( )
AddClaimsAsync33) 7
(337 8
alice338 =
,33= >
new33? B
Claim33C H
[33H I
]33I J
{33J K
new44 
Claim44 !
(44! "
JwtClaimTypes44" /
.44/ 0
Name440 4
,444 5
$str446 C
)44C D
,44D E
new55 
Claim55 !
(55! "
JwtClaimTypes55" /
.55/ 0
	GivenName550 9
,559 :
$str55; B
)55B C
,55C D
new66 
Claim66 !
(66! "
JwtClaimTypes66" /
.66/ 0

FamilyName660 :
,66: ;
$str66< C
)66C D
,66D E
new77 
Claim77 !
(77! "
JwtClaimTypes77" /
.77/ 0
Email770 5
,775 6
$str777 M
)77M N
,77N O
new88 
Claim88 !
(88! "
JwtClaimTypes88" /
.88/ 0
EmailVerified880 =
,88= >
$str88? E
,88E F
ClaimValueTypes88G V
.88V W
Boolean88W ^
)88^ _
,88_ `
new99 
Claim99 !
(99! "
JwtClaimTypes99" /
.99/ 0
WebSite990 7
,997 8
$str999 K
)99K L
,99L M
new:: 
Claim:: !
(::! "
JwtClaimTypes::" /
.::/ 0
Address::0 7
,::7 8
$str	::9 �
,
::� �
IdentityServer4
::� �
.
::� �%
IdentityServerConstants
::� �
.
::� �
ClaimValueTypes
::� �
.
::� �
Json
::� �
)
::� �
};; 
);; 
.;; 
Result;; 
;;; 
if<< 
(<< 
!<< 
result<< #
.<<# $
	Succeeded<<$ -
)<<- .
{== 
throw>> !
new>>" %
	Exception>>& /
(>>/ 0
result>>0 6
.>>6 7
Errors>>7 =
.>>= >
First>>> C
(>>C D
)>>D E
.>>E F
Description>>F Q
)>>Q R
;>>R S
}?? 
Console@@ 
.@@  
	WriteLine@@  )
(@@) *
$str@@* 9
)@@9 :
;@@: ;
}AA 
elseBB 
{CC 
ConsoleDD 
.DD  
	WriteLineDD  )
(DD) *
$strDD* @
)DD@ A
;DDA B
}EE 
varGG 
bobGG 
=GG 
userMgrGG %
.GG% &
FindByNameAsyncGG& 5
(GG5 6
$strGG6 ;
)GG; <
.GG< =
ResultGG= C
;GGC D
ifHH 
(HH 
bobHH 
==HH 
nullHH #
)HH# $
{II 
bobJJ 
=JJ 
newJJ !
ApplicationUserJJ" 1
{KK 
UserNameLL $
=LL% &
$strLL' ,
,LL, -
EmailMM !
=MM" #
$strMM$ 8
,MM8 9
EmailConfirmedNN *
=NN+ ,
trueNN- 1
}OO 
;OO 
varPP 
resultPP "
=PP# $
userMgrPP% ,
.PP, -
CreateAsyncPP- 8
(PP8 9
bobPP9 <
,PP< =
$strPP> U
)PPU V
.PPV W
ResultPPW ]
;PP] ^
ifQQ 
(QQ 
!QQ 
resultQQ #
.QQ# $
	SucceededQQ$ -
)QQ- .
{RR 
throwSS !
newSS" %
	ExceptionSS& /
(SS/ 0
resultSS0 6
.SS6 7
ErrorsSS7 =
.SS= >
FirstSS> C
(SSC D
)SSD E
.SSE F
DescriptionSSF Q
)SSQ R
;SSR S
}TT 
resultVV 
=VV  
userMgrVV! (
.VV( )
AddClaimsAsyncVV) 7
(VV7 8
bobVV8 ;
,VV; <
newVV= @
ClaimVVA F
[VVF G
]VVG H
{VVH I
newWW 
ClaimWW !
(WW! "
JwtClaimTypesWW" /
.WW/ 0
NameWW0 4
,WW4 5
$strWW6 A
)WWA B
,WWB C
newXX 
ClaimXX !
(XX! "
JwtClaimTypesXX" /
.XX/ 0
	GivenNameXX0 9
,XX9 :
$strXX; @
)XX@ A
,XXA B
newYY 
ClaimYY !
(YY! "
JwtClaimTypesYY" /
.YY/ 0

FamilyNameYY0 :
,YY: ;
$strYY< C
)YYC D
,YYD E
newZZ 
ClaimZZ !
(ZZ! "
JwtClaimTypesZZ" /
.ZZ/ 0
EmailZZ0 5
,ZZ5 6
$strZZ7 K
)ZZK L
,ZZL M
new[[ 
Claim[[ !
([[! "
JwtClaimTypes[[" /
.[[/ 0
EmailVerified[[0 =
,[[= >
$str[[? E
,[[E F
ClaimValueTypes[[G V
.[[V W
Boolean[[W ^
)[[^ _
,[[_ `
new\\ 
Claim\\ !
(\\! "
JwtClaimTypes\\" /
.\\/ 0
WebSite\\0 7
,\\7 8
$str\\9 I
)\\I J
,\\J K
new]] 
Claim]] !
(]]! "
JwtClaimTypes]]" /
.]]/ 0
Address]]0 7
,]]7 8
$str	]]9 �
,
]]� �
IdentityServer4
]]� �
.
]]� �%
IdentityServerConstants
]]� �
.
]]� �
ClaimValueTypes
]]� �
.
]]� �
Json
]]� �
)
]]� �
,
]]� �
new^^ 
Claim^^ !
(^^! "
$str^^" ,
,^^, -
$str^^. 9
)^^9 :
}__ 
)__ 
.__ 
Result__ 
;__ 
if`` 
(`` 
!`` 
result`` #
.``# $
	Succeeded``$ -
)``- .
{aa 
throwbb !
newbb" %
	Exceptionbb& /
(bb/ 0
resultbb0 6
.bb6 7
Errorsbb7 =
.bb= >
Firstbb> C
(bbC D
)bbD E
.bbE F
DescriptionbbF Q
)bbQ R
;bbR S
}cc 
Consoledd 
.dd  
	WriteLinedd  )
(dd) *
$strdd* 7
)dd7 8
;dd8 9
}ee 
elseff 
{gg 
Consolehh 
.hh  
	WriteLinehh  )
(hh) *
$strhh* >
)hh> ?
;hh? @
}ii 
}jj 
}kk 
}ll 	
}mm 
}nn �
FD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Enums\AgreementTypeId.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Enums "
{ 
public		 

enum		 
AgreementTypeId		 
{

 
UserSignUpAgreement 
= 
$num 
,  
[ 	
Display	 
( 
Name 
= 
$str )
)) *
]* +
ForgotPassword 
= 
$num 
} 
} �
BD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Enums\MessageType.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Enums "
{ 
public 

enum 
MessageType 
{		 
Error

 
,

 
Success 
, 
Warning 
, 
Information 
} 
} �
ED:\Development\FJT\FJT-DEV\FJT.IdentityServer\Enums\OrderDirection.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Enums "
{ 
public 

enum 
OrderDirection 
{		 
Asc

 
,

 
Desc 
} 
} �
ED:\Development\FJT\FJT-DEV\FJT.IdentityServer\Enums\SearchDataType.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Enums "
{ 
public 

enum 
SearchDataType 
{		 
StringContains

 
,

 
StringEquals 
, 
DateTime 
, 
Date 
, 
Number 
, 
Decimal 
, 

LongNumber 
, 
Boolean 
, 

Percentage 
, 
Grater 
} 
} �
<D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Enums\State.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Enums "
{ 
public		 

enum		 
State		 
{

 
SUCCESS 
, 
FAILED 
, 
EMPTY 
} 
} �
ID:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\CertificateHelper.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Helper #
{		 
public

 

class

 
CertificateHelper

 "
{ 
public 
static 
X509Certificate2 &'
LoadCertificateByThumbPrint' B
(B C
stringC I

thumbPrintJ T
)T U
{ 	

thumbPrint 
= 
Regex 
. 
Replace &
(& '

thumbPrint' 1
,1 2
$str3 A
,A B
stringC I
.I J
EmptyJ O
)O P
.P Q
ToUpperQ X
(X Y
)Y Z
;Z [
var 
storelocation 
= 
StoreLocation  -
.- .
LocalMachine. :
;: ;
if 
( 
Environment 
. "
GetEnvironmentVariable 2
(2 3
$str3 Y
)Y Z
==[ ]
$str^ k
)k l
{ 
storelocation 
= 
StoreLocation  -
.- .
CurrentUser. 9
;9 :
} 
using 
( 
	X509Store 
computerCaStore ,
=- .
new/ 2
	X509Store3 <
(< =
	StoreName= F
.F G
MyG I
,I J
storelocationK X
)X Y
)Y Z
{ 
computerCaStore 
.  
Open  $
($ %
	OpenFlags% .
.. /
ReadOnly/ 7
)7 8
;8 9
var !
certificateCollection )
=* +
computerCaStore, ;
.; <
Certificates< H
.H I
FindI M
(M N
X509FindTypeN Z
.Z [
FindByThumbprint[ k
,k l

thumbPrintm w
,w x
falsey ~
)~ 
;	 �
if 
( !
certificateCollection )
==* ,
null- 1
||2 4!
certificateCollection5 J
.J K
CountK P
==Q S
$numT U
)U V
{ 
throw 
new 
	Exception '
(' (
$str( C
)C D
;D E
} 
return !
certificateCollection ,
[, -
$num- .
]. /
;/ 0
} 
}!! 	
}"" 
}## �<
@D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\Constant.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Helper #
{ 
public		 

class		 
Constant		 
{

 
public 
static 
string +
USER_SIGNUP_AGREEMENT_TYPE_NAME <
== >
$str? T
;T U
public 
enum 
APIStatusCode !
{ 	
SUCCESS 
= 
$num 
, 
ERROR 
= 
$num 
, 
BAD_REQUEST 
= 
$num 
, 
UNAUTHORIZED 
= 
$num 
, 
PAGE_NOT_FOUND 
= 
$num  
,  !
ACCESS_DENIED 
= 
$num 
,  !
INTERNAL_SERVER_ERROR !
=" #
$num$ '
} 	
public 
enum 
APIState 
{ 	
[ 
Display 
( 
Name 
= 
$str %
)% &
]& '
SUCCESS 
, 
[ 
Display 
( 
Name 
= 
$str $
)$ %
]% &
FAILED 
} 	
public   
static   
string   
AGREEMENT_ENTITY   -
=  . /
$str  0 D
;  D E
public!! 
static!! 
string!! 
USER_ENTITY!! (
=!!) *
$str!!+ 1
;!!1 2
public"" 
static"" 
string"" 
	USER_NAME"" &
=""' (
$str"") 4
;""4 5
public## 
static## 
string## 
EMAIL## "
=### $
$str##% ,
;##, -
public$$ 
static$$ 
string$$ 
	REQUESTED$$ &
=$$' (
$str$$) 4
;$$4 5
public&& 
static&& 
string&& 
COMPANY_NAME&& )
=&&* +
$str&&, 6
;&&6 7
public'' 
static'' 
string'' 
COMPANY_LOGO_KEY'' -
=''. /
$str''0 =
;''= >
public(( 
static(( 
string(( 
ASSEMBLY_NAME(( *
=((+ ,
$str((- /
;((/ 0
public)) 
static)) 
string)) !
CUSTOMER_COMPANY_NAME)) 2
=))3 4
$str))5 7
;))7 8
public++ 
static++ 
string++ 
AESSecretKey++ )
=++* +
$str++, >
;++> ?
public,, 
static,, 
string,, 
	CLIENT_ID,, &
=,,' (
$str,,) 1
;,,1 2
public.. 
static.. 
string.. 0
$FORGOT_PASSWORD_MAIL_USERNAME_FORMAT.. A
=..B C
$str..D O
;..O P
public// 
static// 
string// )
FORGOT_PASSWORD_CALLBACK_LINK// :
=//; <
$str//= t
;//t u
public11 
static11 
string11 ,
 SYSTEM_VARIABLE_USERNAME_HTMLTAG11 =
=11> ?
$str11@ P
;11P Q
public22 
static22 
string22 /
#SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG22 @
=22A B
$str22C V
;22V W
public33 
static33 
string33 +
SYSTEM_VARIABLE_LINKURL_HTMLTAG33 <
=33= >
$str33? K
;33K L
public44 
static44 
string44 /
#SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG44 @
=44A B
$str44C V
;44V W
public55 
static55 
string55 0
$SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG55 A
=55B C
$str55D X
;55X Y
public66 
static66 
string66 7
+SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG66 H
=66I J
$str66K f
;66f g
public88 
const88 
string88 
	ERROR_MSG88 %
=88& '
$str88( /
;88/ 0
public99 
const99 
string99 
REQUIRED_INPUT_MSG99 .
=99/ 0
$str991 <
;99< =
public:: 
const:: 
string:: )
PASSWORD_VALIDATION_INPUT_MSG:: 9
=::: ;
$str	::< �
;
::� �
public;; 
const;; 
string;; '
PASSWORD_MISMATCH_INPUT_MSG;; 7
=;;8 9
$str;;: G
;;;G H
public>> 
const>> 
string>> 
INVALID_PARAMETER>> -
=>>. /
$str>>0 C
;>>C D
public?? 
const?? 
string?? 
SOMTHING_WRONG?? *
=??+ ,
$str??- =
;??= >
public@@ 
const@@ 
string@@ 
	NOT_FOUND@@ %
=@@& '
$str@@( 3
;@@3 4
publicAA 
constAA 
stringAA 
CREATEDAA #
=AA$ %
$strAA& /
;AA/ 0
publicBB 
constBB 
stringBB 
UPDATEDBB #
=BB$ %
$strBB& /
;BB/ 0
publicCC 
constCC 
stringCC 
DELETEDCC #
=CC$ %
$strCC& /
;CC/ 0
publicDD 
constDD 
stringDD 
SAVEDDD !
=DD" #
$strDD$ +
;DD+ ,
publicEE 
constEE 
stringEE 
ALREADY_EXISTSEE *
=EE+ ,
$strEE- =
;EE= >
publicFF 
constFF 
stringFF 
POPUP_ACCESS_DENIEDFF /
=FF0 1
$strFF2 G
;FFG H
publicGG 
constGG 
stringGG ,
 USER_USERNAME_PASSWORD_INCORRECTGG <
=GG= >
$strGG? a
;GGa b
publicHH 
constHH 
stringHH '
EMPLOYEE_CREDENTIAL_UPDATEDHH 7
=HH8 9
$strHH: W
;HHW X
publicII 
constII 
stringII 
FILE_FOLDER_RESTOREII /
=II0 1
$strII2 G
;IIG H
publicJJ 
constJJ 
stringJJ  
LOGIN_AGRREMENT_SIGNJJ 0
=JJ1 2
$strJJ3 I
;JJI J
publicKK 
constKK 
stringKK '
PASSWORD_RESET_LINK_EXPIREDKK 7
=KK8 9
$strKK: W
;KKW X
publicLL 
constLL 
stringLL -
!WITHOUT_SAVING_ALERT_BODY_MESSAGELL =
=LL> ?
$strLL@ c
;LLc d
publicMM 
constMM 
stringMM 
PROVIDE_SIGNATUREMM -
=MM. /
$strMM0 C
;MMC D
publicNN 
constNN 
stringNN "
DELETE_CONFIRM_MESSAGENN 2
=NN3 4
$strNN5 M
;NNM N
publicQQ 
staticQQ 
stringQQ 
INVALID_RETURN_URLQQ /
=QQ0 1
$strQQ2 F
;QQF G
publicRR 
staticRR 
stringRR '
INVALID_USERNAME_OR_EMAILIDRR 8
=RR9 :
$strRR; W
;RRW X
publicSS 
staticSS 
stringSS "
PASSWORD_DOSENOT_MATCHSS 3
=SS4 5
$strSS6 j
;SSj k
publicTT 
staticTT 
stringTT $
MONGODB_CONNECTION_ERRORTT 5
=TT6 7
$str	TT8 �
;
TT� �
}UU 
}VV �%
LD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\DataRecordExtensions.cs
	namespace		 	
FJT		
 
.		 
IdentityServer		 
.		 
Helper		 #
{

 
public 

static 
class  
DataRecordExtensions ,
{ 
private 
static 
readonly  
ConcurrentDictionary  4
<4 5
Type5 9
,9 :
object; A
>A B
_materializersC Q
=R S
newT W 
ConcurrentDictionaryX l
<l m
Typem q
,q r
objects y
>y z
(z {
){ |
;| }
public 
static 
IList 
< 
T 
> 
	Translate (
<( )
T) *
>* +
(+ ,
this, 0
DbDataReader1 =
reader> D
)D E
whereF K
TL M
:N O
newP S
(S T
)T U
{ 	
var 
materializer 
= 
(  
Func  $
<$ %
IDataRecord% 0
,0 1
T2 3
>3 4
)4 5
_materializers5 C
.C D
GetOrAddD L
(L M
typeofM S
(S T
TT U
)U V
,V W
(X Y
FuncY ]
<] ^
IDataRecord^ i
,i j
Tk l
>l m
)m n
Materializern z
.z {
Materialize	{ �
<
� �
T
� �
>
� �
)
� �
;
� �
return 
	Translate 
( 
reader #
,# $
materializer% 1
,1 2
out3 6
var7 :
hasNextResults; I
)I J
;J K
} 	
public 
static 
IList 
< 
T 
> 
	Translate (
<( )
T) *
>* +
(+ ,
this, 0
DbDataReader1 =
reader> D
,D E
FuncF J
<J K
IDataRecordK V
,V W
TX Y
>Y Z
objectMaterializer[ m
)m n
{ 	
return 
	Translate 
( 
reader #
,# $
objectMaterializer% 7
,7 8
out9 <
var= @
hasNextResultsA O
)O P
;P Q
} 	
public 
static 
IList 
< 
T 
> 
	Translate (
<( )
T) *
>* +
(+ ,
this, 0
DbDataReader1 =
reader> D
,D E
FuncF J
<J K
IDataRecordK V
,V W
TX Y
>Y Z
objectMaterializer[ m
,m n
out 
bool 
hasNextResult "
)" #
{ 	
var 
results 
= 
new 
List "
<" #
T# $
>$ %
(% &
)& '
;' (
while 
( 
reader 
. 
Read 
( 
)  
)  !
{ 
var   
record   
=   
(   
IDataRecord   )
)  ) *
reader  * 0
;  0 1
var!! 
obj!! 
=!! 
objectMaterializer!! ,
(!!, -
record!!- 3
)!!3 4
;!!4 5
results"" 
."" 
Add"" 
("" 
obj"" 
)""  
;""  !
}## 
hasNextResult%% 
=%% 
reader%% "
.%%" #

NextResult%%# -
(%%- .
)%%. /
;%%/ 0
return'' 
results'' 
;'' 
}(( 	
public** 
static** 
bool** 
Exists** !
(**! "
this**" &
IDataRecord**' 2
record**3 9
,**9 :
string**; A
propertyName**B N
)**N O
{++ 	
return,, 

Enumerable,, 
.,, 
Range,, #
(,,# $
$num,,$ %
,,,% &
record,,' -
.,,- .

FieldCount,,. 8
),,8 9
.,,9 :
Any,,: =
(,,= >
x,,> ?
=>,,@ B
record,,C I
.,,I J
GetName,,J Q
(,,Q R
x,,R S
),,S T
==,,U W
propertyName,,X d
),,d e
;,,e f
}-- 	
}.. 
}// �6
>D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\Helper.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Helper #
{ 
public 

static 
class 
Helper 
{ 
private 
static 
Random 
random $
=% &
new' *
Random+ 1
(1 2
)2 3
;3 4
public 
static 
string  
GenerateClientSecret 1
(1 2
)2 3
{ 	
var 
hmac 
= 
new 

HMACSHA256 %
(% &
)& '
;' (
var 
key 
= 
Convert 
. 
ToBase64String ,
(, -
hmac- 1
.1 2
Key2 5
)5 6
;6 7
return 
key 
; 
} 	
public 
static 
string 
GetFormatedString .
(. /
string/ 5
	PlainText6 ?
,? @
stringA G
FormatedStrignForH Y
)Y Z
{ 	
if 
( 
! 
string 
. 
IsNullOrEmpty %
(% &
	PlainText& /
)/ 0
&&1 3
!4 5
string5 ;
.; <
IsNullOrEmpty< I
(I J
FormatedStrignForJ [
)[ \
)\ ]
{ 
int 
StartingPosition $
=% &
$num' (
;( )
int 
EndPosition 
=  !
	PlainText" +
.+ ,
Length, 2
;2 3
switch!! 
(!! 
FormatedStrignFor!! )
)!!) *
{"" 
case## 
$str##  
:##  !
StartingPosition$$ (
=$$) *
$num$$+ ,
;$$, -
EndPosition%% #
=%%$ %
(%%& '
	PlainText%%' 0
.%%0 1
Length%%1 7
-%%8 9
StartingPosition%%: J
)%%J K
;%%K L
break&& 
;&& 
case'' 
$str''  
:''  !
StartingPosition(( (
=(() *
$num((+ ,
;((, -
EndPosition)) #
=))$ %
())& '
	PlainText))' 0
.))0 1
Length))1 7
-))8 9
StartingPosition)): J
)))J K
-))L M
$num))N O
;))O P
break** 
;** 
}++ 
string-- 
	substring--  
=--! "
	PlainText--# ,
.--, -
	Substring--- 6
(--6 7
StartingPosition--7 G
,--G H
EndPosition--I T
)--T U
;--U V
string.. 

starString.. !
=.." #
new..$ '
String..( .
(... /
$char../ 2
,..2 3
	substring..4 =
...= >
Length..> D
)..D E
;..E F
return// 
	PlainText//  
.//  !
Replace//! (
(//( )
	substring//) 2
,//2 3

starString//4 >
)//> ?
;//? @
}00 
return11 
string11 
.11 
Empty11 
;11  
}22 	
public44 
static44 
MediaTypeFormatter44 (
GetFormatter44) 5
(445 6
Uri446 9

requestUri44: D
,44D E
System44F L
.44L M
Web44M P
.44P Q
Http44Q U
.44U V
HttpConfiguration44V g
Configuration44h u
)44u v
{55 	
var66 
requestUriString66  
=66! "
Convert66# *
.66* +
ToString66+ 3
(663 4

requestUri664 >
)66> ?
;66? @
if77 
(77 
requestUriString77  
.77  !
Contains77! )
(77) *
$str77* 6
)776 7
)777 8
return88 
Configuration88 $
.88$ %

Formatters88% /
.88/ 0
XmlFormatter880 <
;88< =
else99 
return:: 
Configuration:: $
.::$ %

Formatters::% /
.::/ 0
JsonFormatter::0 =
;::= >
};; 	
public<< 
static<< 
string<< 
GetMediaType<< )
(<<) *
Uri<<+ .

requestUri<</ 9
)<<9 :
{== 	
var>> 
requestUriString>>  
=>>! "
Convert>># *
.>>* +
ToString>>+ 3
(>>3 4

requestUri>>4 >
)>>> ?
;>>? @
if?? 
(?? 
requestUriString??  
.??  !
Contains??! )
(??) *
$str??* 6
)??6 7
)??7 8
return@@ 
$str@@ (
;@@( )
elseAA 
returnBB 
$strBB )
;BB) *
}CC 	
publicDD 
staticDD 
stringDD 
GetDisplayValueDD ,
(DD, -
thisDD- 1
EnumDD2 6
instanceDD7 ?
)DD? @
{EE 	
varFF 
	fieldInfoFF 
=FF 
instanceFF $
.FF$ %
GetTypeFF% ,
(FF, -
)FF- .
.FF. /
	GetMemberFF/ 8
(FF8 9
instanceFF9 A
.FFA B
ToStringFFB J
(FFJ K
)FFK L
)FFL M
.FFM N
SingleFFN T
(FFT U
)FFU V
;FFV W
varGG !
descriptionAttributesGG %
=GG& '
	fieldInfoGG( 1
.GG1 2
GetCustomAttributesGG2 E
(GGE F
typeofGGF L
(GGL M
DisplayAttributeGGM ]
)GG] ^
,GG^ _
falseGG` e
)GGe f
asGGg i
DisplayAttributeGGj z
[GGz {
]GG{ |
;GG| }
ifHH 
(HH !
descriptionAttributesHH %
==HH& (
nullHH) -
)HH- .
returnHH/ 5
instanceHH6 >
.HH> ?
ToStringHH? G
(HHG H
)HHH I
;HHI J
returnII 
(II !
descriptionAttributesII )
.II) *
LengthII* 0
>II1 2
$numII3 4
)II4 5
?II6 7!
descriptionAttributesII8 M
[IIM N
$numIIN O
]IIO P
.IIP Q
GetNameIIQ X
(IIX Y
)IIY Z
:II[ \
instanceII] e
.IIe f
ToStringIIf n
(IIn o
)IIo p
;IIp q
}JJ 	
publicKK 
staticKK 
DateTimeKK 
GetDateTimeKK *
(KK* +
)KK+ ,
{LL 	
returnMM 
DateTimeMM 
.MM 
UtcNowMM "
;MM" #
}NN 	
}OO 
}PP �#
DD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\Materializer.cs
	namespace		 	
FJT		
 
.		 
IdentityServer		 
.		 
Helper		 #
{

 
public 

class 
Materializer 
{ 
public 
static 
T 
Materialize #
<# $
T$ %
>% &
(& '
IDataRecord' 2
record3 9
)9 :
where; @
TA B
:C D
newE H
(H I
)I J
{ 	
var 
t 
= 
new 
T 
( 
) 
; 
foreach 
( 
var 
prop 
in  
typeof! '
(' (
T( )
)) *
.* +
GetProperties+ 8
(8 9
)9 :
): ;
{ 
if 
( 
prop 
. 
PropertyType %
.% &
	Namespace& /
==0 2
typeof3 9
(9 :
T: ;
); <
.< =
	Namespace= F
)F G
{ 
continue 
; 
} 
if 
( 
prop 
. 
PropertyType %
!=& (
typeof) /
(/ 0
string0 6
)6 7
&&8 :
typeof; A
(A B
IEnumerableB M
)M N
.N O
IsAssignableFromO _
(_ `
prop` d
.d e
PropertyTypee q
)q r
)r s
{ 
continue 
; 
} 
if 
( 
	Attribute 
. 
	IsDefined '
(' (
prop( ,
,, -
typeof. 4
(4 5
NotMappedAttribute5 G
)G H
)H I
)I J
{   
continue!! 
;!! 
}"" 
if%% 
(%% 
!%% 
record%% 
.%% 
Exists%% "
(%%" #
prop%%# '
.%%' (
Name%%( ,
)%%, -
)%%- .
continue%%/ 7
;%%7 8
var'' 
dbValue'' 
='' 
record'' $
[''$ %
prop''% )
.'') *
Name''* .
]''. /
;''/ 0
if(( 
((( 
dbValue(( 
is(( 
DBNull(( %
)((% &
continue((' /
;((/ 0
if** 
(** 
prop** 
.** 
PropertyType** %
.**% &$
IsConstructedGenericType**& >
&&**? A
prop++ 
.++ 
PropertyType++ %
.++% &$
GetGenericTypeDefinition++& >
(++> ?
)++? @
==++A C
typeof++D J
(++J K
Nullable++K S
<++S T
>++T U
)++U V
)++V W
{,, 
var-- 
baseType--  
=--! "
prop--# '
.--' (
PropertyType--( 4
.--4 5
GetGenericArguments--5 H
(--H I
)--I J
[--J K
$num--K L
]--L M
;--M N
var.. 
	baseValue.. !
=.." #
Convert..$ +
...+ ,

ChangeType.., 6
(..6 7
dbValue..7 >
,..> ?
baseType..@ H
)..H I
;..I J
var// 
value// 
=// 
	Activator//  )
.//) *
CreateInstance//* 8
(//8 9
prop//9 =
.//= >
PropertyType//> J
,//J K
	baseValue//L U
)//U V
;//V W
prop00 
.00 
SetValue00 !
(00! "
t00" #
,00# $
value00% *
)00* +
;00+ ,
}11 
else22 
{33 
var44 
value44 
=44 
Convert44  '
.44' (

ChangeType44( 2
(442 3
dbValue443 :
,44: ;
prop44< @
.44@ A
PropertyType44A M
)44M N
;44N O
prop55 
.55 
SetValue55 !
(55! "
t55" #
,55# $
value55% *
)55* +
;55+ ,
}66 
}77 
return99 
t99 
;99 
}:: 	
};; 
}<< � 
ND:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\MemoryCacheTicketStore.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Helper #
{ 
public 

class "
MemoryCacheTicketStore '
:( )
ITicketStore* 6
{ 
private 
const 
string 
	KeyPrefix &
=' (
$str) <
;< =
private 
IMemoryCache 
_cache #
;# $
public "
MemoryCacheTicketStore %
(% &
)& '
{ 	
_cache 
= 
new 
MemoryCache $
($ %
new% (
MemoryCacheOptions) ;
(; <
)< =
)= >
;> ?
} 	
public 
async 
Task 
< 
string  
>  !

StoreAsync" ,
(, - 
AuthenticationTicket- A
ticketB H
)H I
{ 	
var 
guid 
= 
Guid 
. 
NewGuid #
(# $
)$ %
;% &
var 
key 
= 
	KeyPrefix 
+  !
guid" &
.& '
ToString' /
(/ 0
)0 1
;1 2
await 

RenewAsync 
( 
key  
,  !
ticket" (
)( )
;) *
return 
key 
; 
} 	
public!! 
Task!! 

RenewAsync!! 
(!! 
string!! %
key!!& )
,!!) * 
AuthenticationTicket!!+ ?
ticket!!@ F
)!!F G
{"" 	
var## 
options## 
=## 
new## #
MemoryCacheEntryOptions## 5
(##5 6
)##6 7
;##7 8
var$$ 

expiresUtc$$ 
=$$ 
ticket$$ #
.$$# $

Properties$$$ .
.$$. /

ExpiresUtc$$/ 9
;$$9 :
if%% 
(%% 

expiresUtc%% 
.%% 
HasValue%% #
)%%# $
{&& 
options'' 
.'' !
SetAbsoluteExpiration'' -
(''- .

expiresUtc''. 8
.''8 9
Value''9 >
)''> ?
;''? @
}(( 
options)) 
.))  
SetSlidingExpiration)) (
())( )
TimeSpan))) 1
.))1 2
	FromHours))2 ;
()); <
$num))< =
)))= >
)))> ?
;))? @
_cache++ 
.++ 
Set++ 
(++ 
key++ 
,++ 
ticket++ "
,++" #
options++$ +
)+++ ,
;++, -
return-- 
Task-- 
.-- 

FromResult-- "
(--" #
$num--# $
)--$ %
;--% &
}.. 	
public00 
Task00 
<00  
AuthenticationTicket00 (
>00( )
RetrieveAsync00* 7
(007 8
string008 >
key00? B
)00B C
{11 	 
AuthenticationTicket22  
ticket22! '
;22' (
_cache33 
.33 
TryGetValue33 
(33 
key33 "
,33" #
out33$ '
ticket33( .
)33. /
;33/ 0
return44 
Task44 
.44 

FromResult44 "
(44" #
ticket44# )
)44) *
;44* +
}55 	
public77 
Task77 
RemoveAsync77 
(77  
string77  &
key77' *
)77* +
{88 	
_cache99 
.99 
Remove99 
(99 
key99 
)99 
;99 
return:: 
Task:: 
.:: 

FromResult:: "
(::" #
$num::# $
)::$ %
;::% &
};; 	
}<< 
}>> �
?D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\OrderBy.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Helper #
{		 
public

 

class

 
OrderBy

 
{ 
public 
static 
string 
GenerateOrderBy ,
(, -
List- 1
<1 2
string2 8
[8 9
]9 :
>: ;
sortColumns< G
)G H
{ 	
string 
orderBy 
= 
string #
.# $
Empty$ )
;) *
var 
	applyComa 
= 
false !
;! "
foreach 
( 
var 
item 
in  
sortColumns! ,
), -
{ 
if 
( 
	applyComa 
==  
true! %
)% &
{ 
orderBy 
+= 
$str "
;" #
} 
orderBy 
+= 
string !
.! "
Format" (
(( )
$str) 5
,5 6
item7 ;
[; <
$num< =
]= >
,> ?
item@ D
[D E
$numE F
]F G
)G H
;H I
	applyComa 
= 
true  
;  !
} 
return 
orderBy 
; 
} 	
} 
}   �Q
CD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Helper\WhereClause.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Helper #
{ 
public		 

class		 
WhereClause		 
{

 
public 
static 
string 
GenerateWhereClause 0
(0 1
List1 5
<5 6
SearchColumn6 B
>B C
SearchColumnsD Q
)Q R
{ 	
string 
whereClause 
=  
string! '
.' (
Empty( -
;- .
foreach 
( 
var 
item 
in  
SearchColumns! .
). /
{ 
if 
( 
item 
. 
ColumnDataType &
!=' )
null* .
). /
{ 
if 
( 
item 
. 
ColumnDataType +
==, .
Enums/ 4
.4 5
SearchDataType5 C
.C D
StringEqualsD P
.P Q
ToStringQ Y
(Y Z
)Z [
)[ \
{ 
whereClause #
+=$ &
string' -
.- .
Format. 4
(4 5
$str5 I
,I J
itemK O
.O P

ColumnNameP Z
,Z [
item\ `
.` a
SearchStringa m
)m n
;n o
} 
else 
if 
( 
item !
.! "
ColumnDataType" 0
==1 3
Enums4 9
.9 :
SearchDataType: H
.H I
NumberI O
.O P
ToStringP X
(X Y
)Y Z
)Z [
{ 
int 
? 
value "
=# $
null% )
;) *
if 
( 
! 
string #
.# $
IsNullOrEmpty$ 1
(1 2
item2 6
.6 7
SearchString7 C
)C D
)D E
value !
=" #
int$ '
.' (
Parse( -
(- .
item. 2
.2 3
SearchString3 ?
)? @
;@ A
whereClause #
+=$ &
string' -
.- .
Format. 4
(4 5
$str5 G
,G H
itemI M
.M N

ColumnNameN X
,X Y
valueZ _
)_ `
;` a
} 
else 
if 
( 
item !
.! "
ColumnDataType" 0
==1 3
Enums4 9
.9 :
SearchDataType: H
.H I
DateTimeI Q
.Q R
ToStringR Z
(Z [
)[ \
)\ ]
{ 
if   
(   
!   
string   #
.  # $
IsNullOrEmpty  $ 1
(  1 2
item  2 6
.  6 7
SearchString  7 C
)  C D
)  D E
{!! 
try"" 
{## 
DateTime$$  (
?$$( )
value$$* /
=$$0 1
Convert$$2 9
.$$9 :

ToDateTime$$: D
($$D E
item$$E I
.$$I J
SearchString$$J V
)$$V W
;$$W X
whereClause%%  +
+=%%, .
string%%/ 5
.%%5 6
Format%%6 <
(%%< =
$str%%= O
,%%O P
item%%Q U
.%%U V

ColumnName%%V `
,%%` a
value%%b g
.%%g h
ToString%%h p
(%%p q
)%%q r
)%%r s
;%%s t
}&& 
catch'' !
{(( 
whereClause))  +
+=)), .
string))/ 5
.))5 6
Format))6 <
())< =
$str))= O
,))O P
item))Q U
.))U V

ColumnName))V `
,))` a
null))b f
)))f g
;))g h
}** 
}++ 
else,, 
{-- 
whereClause.. '
+=..( *
string..+ 1
...1 2
Format..2 8
(..8 9
$str..9 K
,..K L
item..M Q
...Q R

ColumnName..R \
,..\ ]
null..^ b
)..b c
;..c d
}// 
}00 
else11 
if11 
(11 
item11 !
.11! "
ColumnDataType11" 0
==111 3
Enums114 9
.119 :
SearchDataType11: H
.11H I
Date11I M
.11M N
ToString11N V
(11V W
)11W X
)11X Y
{22 
if33 
(33 
!33 
string33 #
.33# $
IsNullOrEmpty33$ 1
(331 2
item332 6
.336 7
SearchString337 C
)33C D
)33D E
{44 
try55 
{66 
DateTime77  (
?77( )
value77* /
=770 1
Convert772 9
.779 :

ToDateTime77: D
(77D E
item77E I
.77I J
SearchString77J V
)77V W
;77W X
whereClause88  +
+=88, .
string88/ 5
.885 6
Format886 <
(88< =
$str88= j
,88j k
item88l p
.88p q

ColumnName88q {
,88{ |
value	88} �
)
88� �
;
88� �
}99 
catch:: !
{;; 
whereClause<<  +
+=<<, .
string<</ 5
.<<5 6
Format<<6 <
(<<< =
$str<<= O
,<<O P
item<<Q U
.<<U V

ColumnName<<V `
,<<` a
$str<<b h
)<<h i
;<<i j
}== 
}>> 
else?? 
{@@ 
whereClauseAA '
+=AA( *
stringAA+ 1
.AA1 2
FormatAA2 8
(AA8 9
$strAA9 K
,AAK L
itemAAM Q
.AAQ R

ColumnNameAAR \
,AA\ ]
$strAA^ d
)AAd e
;AAe f
}BB 
}CC 
elseEE 
ifEE 
(EE 
itemEE !
.EE! "
ColumnDataTypeEE" 0
==EE1 3
EnumsEE4 9
.EE9 :
SearchDataTypeEE: H
.EEH I
DecimalEEI P
.EEP Q
ToStringEEQ Y
(EEY Z
)EEZ [
)EE[ \
{FF 
decimalGG 
?GG  
valueGG! &
=GG' (
nullGG) -
;GG- .
ifHH 
(HH 
!HH 
stringHH #
.HH# $
IsNullOrEmptyHH$ 1
(HH1 2
itemHH2 6
.HH6 7
SearchStringHH7 C
)HHC D
)HHD E
valueII !
=II" #
decimalII$ +
.II+ ,
ParseII, 1
(II1 2
itemII2 6
.II6 7
SearchStringII7 C
)IIC D
;IID E
whereClauseJJ #
+=JJ$ &
stringJJ' -
.JJ- .
FormatJJ. 4
(JJ4 5
$strJJ5 G
,JJG H
itemJJI M
.JJM N

ColumnNameJJN X
,JJX Y
valueJJZ _
)JJ_ `
;JJ` a
}KK 
elseLL 
ifLL 
(LL 
itemLL !
.LL! "
ColumnDataTypeLL" 0
==LL1 3
EnumsLL4 9
.LL9 :
SearchDataTypeLL: H
.LLH I

LongNumberLLI S
.LLS T
ToStringLLT \
(LL\ ]
)LL] ^
)LL^ _
{MM 
longNN 
?NN 
valueNN #
=NN$ %
nullNN& *
;NN* +
ifOO 
(OO 
!OO 
stringOO #
.OO# $
IsNullOrEmptyOO$ 1
(OO1 2
itemOO2 6
.OO6 7
SearchStringOO7 C
)OOC D
)OOD E
valuePP !
=PP" #
longPP$ (
.PP( )
ParsePP) .
(PP. /
itemPP/ 3
.PP3 4
SearchStringPP4 @
)PP@ A
;PPA B
whereClauseQQ #
+=QQ$ &
stringQQ' -
.QQ- .
FormatQQ. 4
(QQ4 5
$strQQ5 G
,QQG H
itemQQI M
.QQM N

ColumnNameQQN X
,QQX Y
valueQQZ _
)QQ_ `
;QQ` a
}RR 
elseSS 
ifSS 
(SS 
itemSS !
.SS! "
ColumnDataTypeSS" 0
==SS1 3
EnumsSS4 9
.SS9 :
SearchDataTypeSS: H
.SSH I
BooleanSSI P
.SSP Q
ToStringSSQ Y
(SSY Z
)SSZ [
)SS[ \
{TT 
intUU 
?UU 
valueUU "
=UU# $
nullUU% )
;UU) *
ifVV 
(VV 
!VV 
stringVV #
.VV# $
IsNullOrEmptyVV$ 1
(VV1 2
itemVV2 6
.VV6 7
SearchStringVV7 C
)VVC D
)VVD E
valueWW !
=WW" #
intWW$ '
.WW' (
ParseWW( -
(WW- .
itemWW. 2
.WW2 3
SearchStringWW3 ?
)WW? @
;WW@ A
whereClauseXX #
+=XX$ &
stringXX' -
.XX- .
FormatXX. 4
(XX4 5
$strXX5 G
,XXG H
itemXXI M
.XXM N

ColumnNameXXN X
,XXX Y
valueXXZ _
)XX_ `
;XX` a
}YY 
elseZZ 
{[[ 
whereClause]] #
+=]]$ &
string]]' -
.]]- .
Format]]. 4
(]]4 5
$str]]5 N
,]]N O
item]]P T
.]]T U

ColumnName]]U _
,]]_ `
item]]a e
.]]e f
SearchString]]f r
)]]r s
;]]s t
}^^ 
}__ 
else`` 
{aa 
whereClausebb 
+=bb  "
stringbb# )
.bb) *
Formatbb* 0
(bb0 1
$strbb1 J
,bbJ K
itembbL P
.bbP Q

ColumnNamebbQ [
,bb[ \
itembb] a
.bba b
SearchStringbbb n
)bbn o
;bbo p
}cc 
}dd 
returnee 
whereClauseee 
;ee 
}ff 	
}gg 
}hh �
_D:\Development\FJT\FJT-DEV\FJT.IdentityServer\ManualDbConnection\FJTIdentityManualConnection.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
ManualDbConnection /
{ 
public 

class '
FJTIdentityManualConnection ,
:- .(
IFJTIdentityManualConnection/ K
{ 
private 
readonly 
ConnectionStrings *
_connectionStrings+ =
;= >
public '
FJTIdentityManualConnection *
(* +
IOptions+ 3
<3 4
ConnectionStrings4 E
>E F
connectionStringsG X
)X Y
{ 	
_connectionStrings 
=  
connectionStrings! 2
.2 3
Value3 8
;8 9
} 	
public 
async 
Task 
< 
T 
> 
ExecuteReaderAsync /
</ 0
T0 1
>1 2
(2 3
Func3 7
<7 8
DbDataReader8 D
,D E
TF G
>G H
mapEntitiesI T
,T U
string 
exec 
, 
params #
object$ *
[* +
]+ ,

parameters- 7
)7 8
{   	
using!! 
(!! 
var!! 
conn!! 
=!! 
new!! !
MySqlConnection!!" 1
(!!1 2
_connectionStrings!!2 D
.!!D E
DefaultConnection!!E V
)!!V W
)!!W X
{"" 
using## 
(## 
var## 
command## "
=### $
new##% (
MySqlCommand##) 5
(##5 6
exec##6 :
,##: ;
conn##< @
)##@ A
)##A B
{$$ 
conn%% 
.%% 
Open%% 
(%% 
)%% 
;%%  
command&& 
.&& 

Parameters&& &
.&&& '
AddRange&&' /
(&&/ 0

parameters&&0 :
)&&: ;
;&&; <
command'' 
.'' 
CommandType'' '
=''( )
CommandType''* 5
.''5 6
StoredProcedure''6 E
;''E F
try(( 
{)) 
using** 
(** 
var** "
reader**# )
=*** +
await**, 1
command**2 9
.**9 :
ExecuteReaderAsync**: L
(**L M
)**M N
)**N O
{++ 
T,, 
data,, "
=,,# $
mapEntities,,% 0
(,,0 1
reader,,1 7
),,7 8
;,,8 9
return-- "
data--# '
;--' (
}.. 
}// 
finally00 
{11 
conn22 
.22 
Close22 "
(22" #
)22# $
;22$ %
}33 
}44 
}55 
}66 	
}77 
}88 �&
AD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\Agreement.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{		 
[

 
Table

 

(


 
$str

 
)

 
]

 
public 

class 
	Agreement 
{ 
public 
	Agreement 
( 
) 
{ 	
user_agreement 
= 
new  
HashSet! (
<( )
UserAgreement) 6
>6 7
(7 8
)8 9
;9 :
} 	
[ 	
key	 
] 
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
agreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
int 
? 
version 
{ 
get !
;! "
set# &
;& '
}( )
public 
string 
system_variables &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
bool 
? 
isPublished  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
DateTime 
? 
publishedDate &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public!! 
bool!! 
	isDeleted!! 
{!! 
get!!  #
;!!# $
set!!% (
;!!( )
}!!* +
[## 	
StringLength##	 
(## 
$num## 
)## 
]## 
public$$ 
string$$ 
	createdBy$$ 
{$$  !
get$$" %
;$$% &
set$$' *
;$$* +
}$$, -
[&& 	
StringLength&&	 
(&& 
$num&& 
)&& 
]&& 
public'' 
string'' 
	updatedBy'' 
{''  !
get''" %
;''% &
set''' *
;''* +
}'', -
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	deletedBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
public,, 
DateTime,, 
	createdAt,, !
{,," #
get,,$ '
;,,' (
set,,) ,
;,,, -
},,. /
public.. 
DateTime.. 
?.. 
	updatedAt.. "
{..# $
get..% (
;..( )
set..* -
;..- .
}../ 0
public00 
DateTime00 
?00 
	deletedAt00 "
{00# $
get00% (
;00( )
set00* -
;00- .
}00/ 0
[22 	
StringLength22	 
(22 
$num22 
)22 
]22 
public33 
string33 
agreementSubject33 &
{33' (
get33) ,
;33, -
set33. 1
;331 2
}333 4
[55 	
StringLength55	 
(55 
$num55 
)55 
]55 
public66 
string66 
createByRole66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
[88 	
StringLength88	 
(88 
$num88 
)88 
]88 
public99 
string99 
updateByRole99 "
{99# $
get99% (
;99( )
set99* -
;99- .
}99/ 0
[;; 	
StringLength;;	 
(;; 
$num;; 
);; 
];; 
public<< 
string<< 
deleteByRole<< "
{<<# $
get<<% (
;<<( )
set<<* -
;<<- .
}<</ 0
[>> 	

ForeignKey>>	 
(>> 
$str>> %
)>>% &
]>>& '
public?? 
virtual?? 
AgreementType?? $
agreement_type??% 3
{??4 5
get??6 9
;??9 :
set??; >
;??> ?
}??@ A
publicAA 
virtualAA 
ICollectionAA "
<AA" #
UserAgreementAA# 0
>AA0 1
user_agreementAA2 @
{AAA B
getAAC F
;AAF G
setAAH K
;AAK L
}AAM N
}BB 
}CC �$
ED:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\AgreementType.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{		 
[

 
Table

 

(


 
$str

 
)

 
]

 
public 

class 
AgreementType 
{ 
public 
AgreementType 
( 
) 
{ 	

agreements 
= 
new 
HashSet $
<$ %
	Agreement% .
>. /
(/ 0
)0 1
;1 2
} 	
[ 	
key	 
] 
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
agreementType #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[   	
StringLength  	 
(   
$num   
)   
]   
public!! 
string!! 
	deletedBy!! 
{!!  !
get!!" %
;!!% &
set!!' *
;!!* +
}!!, -
public## 
DateTime## 
	createdAt## !
{##" #
get##$ '
;##' (
set##) ,
;##, -
}##. /
public%% 
DateTime%% 
?%% 
	updatedAt%% "
{%%# $
get%%% (
;%%( )
set%%* -
;%%- .
}%%/ 0
public'' 
DateTime'' 
?'' 
	deletedAt'' "
{''# $
get''% (
;''( )
set''* -
;''- .
}''/ 0
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
templateType** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
[,, 	
StringLength,,	 
(,, 
$num,, 
),, 
],, 
public-- 
string-- 
createByRole-- "
{--# $
get--% (
;--( )
set--* -
;--- .
}--/ 0
[// 	
StringLength//	 
(// 
$num// 
)// 
]// 
public00 
string00 
updateByRole00 "
{00# $
get00% (
;00( )
set00* -
;00- .
}00/ 0
[22 	
StringLength22	 
(22 
$num22 
)22 
]22 
public33 
string33 
deleteByRole33 "
{33# $
get33% (
;33( )
set33* -
;33- .
}33/ 0
[55 	
StringLength55	 
(55 
$num55 
)55 
]55 
public66 
string66 
purpose66 
{66 
get66  #
;66# $
set66% (
;66( )
}66* +
[88 	
StringLength88	 
(88 
$num88 
)88 
]88 
public99 
string99 

where_used99  
{99! "
get99# &
;99& '
set99( +
;99+ ,
}99- .
[;; 	
StringLength;;	 
(;; 
$num;; 
);; 
];; 
public<< 
string<< 
displayName<< !
{<<" #
get<<$ '
;<<' (
set<<) ,
;<<, -
}<<. /
public>> 
virtual>> 
ICollection>> "
<>>" #
	Agreement>># ,
>>>, -

agreements>>. 8
{>>9 :
get>>; >
;>>> ?
set>>@ C
;>>C D
}>>E F
}?? 
}@@ �

@D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ApiScope.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public		 

class		 
ApiScope		 
{

 
public 
int 
Id 
{ 
get 
; 
set  
;  !
}" #
public 
string 
Name 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
DisplayName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
Description !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
bool 
Required 
{ 
get "
;" #
set$ '
;' (
}) *
public 
bool 
	Emphasize 
{ 
get  #
;# $
set% (
;( )
}* +
public 
bool #
ShowInDiscoveryDocument +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
} 
} �
GD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ApplicationRole.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public		 

class		 
ApplicationRole		  
:		! "
IdentityRole		# /
{

 
} 
} �	
GD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ApplicationUser.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public		 

class		 
ApplicationUser		  
:		! "
IdentityUser		# /
{

 
public 
string 
userPasswordDigest (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
bool 
passwordHashUpdated '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
bool 
isSuperAdmin  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
DateTime 
? 
changePasswordAt )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
} 
} �
CD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ClientScope.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public 

class 
ClientScope 
{		 
public

 
int

 
Id

 
{

 
get

 
;

 
set

  
;

  !
}

" #
public 
string 
Scope 
{ 
get !
;! "
set# &
;& '
}( )
public 
int 
ClientId 
{ 
get !
;! "
set# &
;& '
}( )
} 
} �

JD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ClientUsersMapping.cs
	namespace		 	
FJT		
 
.		 
IdentityServer		 
.		 
Models		 #
{

 
[ 
Table 

(
 
$str 
)  
]  !
public 

class 
ClientUsersMapping #
{ 
[ 	
Key	 
] 
public 
int 
Id 
{ 
get 
; 
set  
;  !
}" #
public 
string 
ClientId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
UserId 
{ 
get "
;" #
set$ '
;' (
}) *
[ 	

ForeignKey	 
( 
$str 
) 
] 
public 
ApplicationUser 
User #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
} 
} �
?D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\Company.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
[		 
Table		 

(		
 
$str		 
)		 
]		 
public

 

class

 
Company

 
{ 
} 
} �
?D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\Feature.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
[ 
Table 

(
 
$str 
) 
] 
public 

class 
Feature 
{		 
[

 	
Key

	 
]

 
public 
int 
Id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
Name 
{ 
get  
;  !
set" %
;% &
}' (
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
DataType 
{  
get! $
;$ %
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
DefaultValue "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
FeatureLevel "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
bool 
IsActive 
{ 
get "
;" #
set$ '
;' (
}) *
=+ ,
true- 1
;1 2
public 
bool 
	IsDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
=, -
false. 3
;3 4
public 
DateTime 
? 
	CreatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	CreatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
DateTime 
? 
	UpdatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	UpdatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
} 
} �
FD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ForgotPassword.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{		 
public

 

class

 
ForgotPassword

 
{ 
[ 	
Required	 
( 
AllowEmptyStrings #
=$ %
false& +
,+ ,
ErrorMessage- 9
=: ;
Constant< D
.D E
REQUIRED_INPUT_MSGE W
)W X
]X Y
public 
string 
EmailOrUserId #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool 
SuccessSendEmail $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 
IsUserHaveEmail #
{$ %
get& )
;) *
set+ .
;. /
}0 1
} 
} �
DD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\keyAttribute.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
internal 
class 
keyAttribute 
:  !
	Attribute" +
{ 
} 
} �	
ID:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\MvcClientResponse.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public 

class 
MvcClientResponse "
{		 
public

 
Response

 
response

  
{

! "
get

# &
;

& '
set

( +
;

+ ,
}

- .
} 
public 

class 
Response 
{ 
public 
string 
	apiStatus 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
status 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
object 
data 
{ 
get  
;  !
set" %
;% &
}' (
} 
} �
QD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\OtherUserPasswordUpdateVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public 

class %
OtherUserPasswordUpdateVM *
{		 
public

 
string

 
NewPassword

 !
{

" #
get

$ '
;

' (
set

) ,
;

, -
}

. /
public 
string 
ConfirmNewPassword (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
userId 
{ 
get "
;" #
set$ '
;' (
}) *
} 
} �
?D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\Product.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
[ 
Table 

(
 
$str 
) 
] 
public 

class 
Product 
{		 
[

 	
Key

	 
]

 
public 
int 
Id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
ProductName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
decimal 
? 
Price 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
Category 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
bool 
IsActive 
{ 
get "
;" #
set$ '
;' (
}) *
=+ ,
true- 1
;1 2
public 
bool 
	IsDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
=, -
false. 3
;3 4
public 
DateTime 
? 
	CreatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	CreatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
DateTime 
? 
	UpdatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	UpdatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
} 
} �
FD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\SendEmailModel.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public 

class 
SendEmailModel 
{		 
public

 
string

  
mailSendProviderType

 *
{

+ ,
get

- 0
;

0 1
set

2 5
;

5 6
}

7 8
public 
string 
From 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
To 
{ 
get 
; 
set  #
;# $
}% &
public 
string 
CC 
{ 
get 
; 
set  #
;# $
}% &
public 
string 
BCC 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 
Subject 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
Body 
{ 
get  
;  !
set" %
;% &
}' (
public 
List 
< 
string 
> 
Attachments '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} �"
KD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\Systemconfigrations.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{		 
[

 
Table

 

(


 
$str

  
)

  !
]

! "
public 

class 
Systemconfigrations $
{ 
[ 	
key	 
] 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
key 
{ 
get 
;  
set! $
;$ %
}& '
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
values 
{ 
get "
;" #
set$ '
;' (
}) *
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
clusterName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
bool 
? 
isEncrypted  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
bool 
? 
isActive 
{ 
get  #
;# $
set% (
;( )
}* +
public 
bool 
? 
	isDeleted 
{  
get! $
;$ %
set& )
;) *
}+ ,
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	createdBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public"" 
DateTime"" 
	createdAt"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
[$$ 	
StringLength$$	 
($$ 
$num$$ 
)$$ 
]$$ 
public%% 
string%% 
	updatedBy%% 
{%%  !
get%%" %
;%%% &
set%%' *
;%%* +
}%%, -
public'' 
DateTime'' 
	updatedAt'' !
{''" #
get''$ '
;''' (
set'') ,
;'', -
}''. /
[)) 	
StringLength))	 
()) 
$num)) 
))) 
])) 
public** 
string** 
	deletedBy** 
{**  !
get**" %
;**% &
set**' *
;*** +
}**, -
public,, 
DateTime,, 
?,, 
	deletedAt,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
public.. 
bool.. 

isEditable.. 
{..  
get..! $
;..$ %
set..& )
;..) *
}..+ ,
[00 	
StringLength00	 
(00 
$num00 
)00 
]00 
public11 
string11 
description11 !
{11" #
get11$ '
;11' (
set11) ,
;11, -
}11. /
[33 	
StringLength33	 
(33 
$num33 
)33 
]33 
public44 
string44 
displayName44 !
{44" #
get44$ '
;44' (
set44) ,
;44, -
}44. /
public66 
int66 
?66 
createByRoleId66 "
{66# $
get66% (
;66( )
set66* -
;66- .
}66/ 0
public88 
int88 
?88 
updateByRoleId88 "
{88# $
get88% (
;88( )
set88* -
;88- .
}88/ 0
public:: 
int:: 
?:: 
deleteByRoleId:: "
{::# $
get::% (
;::( )
set::* -
;::- .
}::/ 0
};; 
}<< � 
ED:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\UserAgreement.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{		 
[

 
Table

 

(


 
$str

 
)

 
]

 
public 

class 
UserAgreement 
{ 
[ 	
key	 
] 
public 
int 
userAgreementID "
{# $
get% (
;( )
set* -
;- .
}/ 0
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
userID 
{ 
get "
;" #
set$ '
;' (
}) *
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
? 

agreedDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
StringLength	 
( 
$num 
) 
] 
public   
string   
	deletedBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public"" 
DateTime"" 
	createdAt"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
public$$ 
DateTime$$ 
?$$ 
	updatedAt$$ "
{$$# $
get$$% (
;$$( )
set$$* -
;$$- .
}$$/ 0
public&& 
DateTime&& 
?&& 
	deletedAt&& "
{&&# $
get&&% (
;&&( )
set&&* -
;&&- .
}&&/ 0
[(( 	
StringLength((	 
((( 
$num(( 
)(( 
](( 
public)) 
string)) 
createByRole)) "
{))# $
get))% (
;))( )
set))* -
;))- .
}))/ 0
[++ 	
StringLength++	 
(++ 
$num++ 
)++ 
]++ 
public,, 
string,, 
updateByRole,, "
{,,# $
get,,% (
;,,( )
set,,* -
;,,- .
},,/ 0
[.. 	
StringLength..	 
(.. 
$num.. 
).. 
].. 
public// 
string// 
deleteByRole// "
{//# $
get//% (
;//( )
set//* -
;//- .
}/// 0
public11 
string11 
signaturevalue11 $
{11% &
get11' *
;11* +
set11, /
;11/ 0
}111 2
[33 	

ForeignKey33	 
(33 
$str33 !
)33! "
]33" #
public44 
virtual44 
	Agreement44  
	agreement44! *
{44+ ,
get44- 0
;440 1
set442 5
;445 6
}447 8
[66 	

ForeignKey66	 
(66 
$str66 
)66 
]66 
public77 
virtual77 
ApplicationUser77 &
aspnetusers77' 2
{773 4
get775 8
;778 9
set77: =
;77= >
}77? @
}88 
}99 �
LD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\UserPasswordUpdateVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public 

class  
UserPasswordUpdateVM %
{		 
public

 
string

 
OldPassword

 !
{

" #
get

$ '
;

' (
set

) ,
;

, -
}

. /
public 
string 
NewPassword !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
ConfirmNewPassword (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
userId 
{ 
get "
;" #
set$ '
;' (
}) *
} 
} �#
QD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\AgreementListVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
AgreementListVM  
{ 
public 
int 
id 
{ 
get 
; 
set  
;  !
}" #
public 
string 
agreementType #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
from_templateType '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 

where_used  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
purpose 
{ 
get  #
;# $
set% (
;( )
}* +
public 
Byte 
isPublished 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
agreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
string 
headerpublishedDate )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
string 
newpublishedDate &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
string 
publishedDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
version 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
draftversion "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string  
statusConvertedValue *
{+ ,
get- 0
;0 1
set2 5
;5 6
}7 8
public 
string 
	updatedby 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	createdby 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
createdbyRole #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
updatedbyRole #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
	createdAt 
{  !
get" %
;% &
set' *
;* +
}, -
public   
string   
	updatedAt   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
}!! 
public&& 

class&& 
AgreementListData&& "
{'' 
public(( 
List(( 
<(( 
AgreementListVM(( #
>((# $
TemplateList((% 1
{((2 3
get((4 7
;((7 8
set((9 <
;((< =
}((> ?
public)) 
int)) 
Count)) 
{)) 
get)) 
;)) 
set))  #
;))# $
}))% &
}** 
public// 

class//  
AgreementListDetails// %
{00 
public11 
IEnumerable11 
<11 
	SpCountVM11 $
>11$ %
	SpCountVM11& /
{110 1
get112 5
;115 6
set117 :
;11: ;
}11< =
public22 
IEnumerable22 
<22 
AgreementListVM22 *
>22* +
agreementListVMs22, <
{22= >
get22? B
;22B C
set22D G
;22G H
}22I J
}33 
}44 �
MD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\AgreementVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
AgreementVM 
{		 
public

 
int

 
agreementID

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
agreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
int 
? 
version 
{ 
get !
;! "
set# &
;& '
}( )
public 
string 
system_variables &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
bool 
? 
isPublished  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
DateTime 
? 
publishedDate &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public   
string   
	deletedBy   
{    !
get  " %
;  % &
set  ' *
;  * +
}  , -
public"" 
DateTime"" 
	createdAt"" !
{""" #
get""$ '
;""' (
set"") ,
;"", -
}"". /
public&& 
DateTime&& 
?&& 
	updatedAt&& "
{&&# $
get&&% (
;&&( )
set&&* -
;&&- .
}&&/ 0
public** 
DateTime** 
?** 
	deletedAt** "
{**# $
get**% (
;**( )
set*** -
;**- .
}**/ 0
public.. 
string.. 
agreementSubject.. &
{..' (
get..) ,
;.., -
set... 1
;..1 2
}..3 4
public00 
string00 
createByRole00 "
{00# $
get00% (
;00( )
set00* -
;00- .
}00/ 0
public22 
string22 
updateByRole22 "
{22# $
get22% (
;22( )
set22* -
;22- .
}22/ 0
public33 
string33 
deleteByRole33 "
{33# $
get33% (
;33( )
set33* -
;33- .
}33/ 0
}44 
}55 �
\D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\ArchieveVersionDetailsList.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class &
ArchieveVersionDetailsList +
{ 
public 
string 
	updatedby 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
bool 
isPublished 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
agreementName #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
newpublishedDate &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
string 
publishedDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
agreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
int 
version 
{ 
get  
;  !
set" %
;% &
}' (
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
} 
public 

class *
ArchieveVersionDetailsListData /
{ 
public 
List 
< &
ArchieveVersionDetailsList .
>. /
ArchieveList0 <
{= >
get? B
;B C
setD G
;G H
}I J
public   
int   
Count   
{   
get   
;   
set    #
;  # $
}  % &
}!! 
public&& 

class&& -
!ArchieveVersionDetailsListDetails&& 2
{'' 
public(( 
IEnumerable(( 
<(( 
	SpCountVM(( $
>(($ %
	SpCountVM((& /
{((0 1
get((2 5
;((5 6
set((7 :
;((: ;
}((< =
public)) 
IEnumerable)) 
<)) &
ArchieveVersionDetailsList)) 5
>))5 6'
ArchieveVersionDetailsLists))7 R
{))S T
get))U X
;))X Y
set))Z ]
;))] ^
}))_ `
}** 
}++ �
[D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\ClientUserMappingStatusVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public 

class %
ClientUserMappingStatusVM *
{		 
public

 
string

 
UserId

 
{

 
get

 "
;

" #
set

$ '
;

' (
}

) *
public 
string 
Claim 
{ 
get !
;! "
set# &
;& '
}( )
} 
} �
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\ClientUserMappingVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
{ 
public 

class 
ClientUserMappingVM $
{		 
public

 
string

 
ClientId

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
string 
UserId 
{ 
get "
;" #
set$ '
;' (
}) *
} 
} �
PD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\CommonResponse.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
CommonResponse 
{ 
public 
bool 
isDuplicate 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
updateByRole "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
displayName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
templateType "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
	updatedAt 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
userName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
userRoleName "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
bool 
isMatchPassword #
{$ %
get& )
;) *
set+ .
;. /
}0 1
} 
} �
\D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\DownloadAgreementDetailsVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class &
DownloadAgreementDetailsVM +
{ 
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
compLogo 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
agreementName #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
int 
version 
{ 
get  
;  !
set" %
;% &
}' (
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
agreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
string 
publishedDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
userAgreementID %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
public 
string 
signaturevalue $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
string 
agreedBy 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 

agreedDate  
{! "
get# &
;& '
set( +
;+ ,
}- .
} 
public 

class *
DownloadAgreementDetailsVMData /
{ 
public 
List 
< &
DownloadAgreementDetailsVM .
>. /
TemplateList0 <
{= >
get? B
;B C
setD G
;G H
}I J
}   
public%% 

class%% -
!DownloadAgreementDetailsVMDetails%% 2
{&& 
public'' 
IEnumerable'' 
<'' &
DownloadAgreementDetailsVM'' 5
>''5 6'
DownloadAgreementDetailsVMs''7 R
{''S T
get''U X
;''X Y
set''Z ]
;''] ^
}''_ `
}(( 
})) �
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\GetAgreedUserListVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
GetAgreedUserListVM $
{ 
public 
int 
userAgreementID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
imageURL 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
version 
{ 
get  
;  !
set" %
;% &
}' (
public 
bool 
isPublished 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
agreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
from_userID !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
userName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
newpublishedDate &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
string 
newagreedDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
publishedDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 

agreedDate  
{! "
get# &
;& '
set( +
;+ ,
}- .
} 
public 

class #
GetAgreedUserListVMData (
{   
public!! 
List!! 
<!! 
GetAgreedUserListVM!! '
>!!' (
AgreedUserList!!) 7
{!!8 9
get!!: =
;!!= >
set!!? B
;!!B C
}!!D E
public"" 
int"" 
Count"" 
{"" 
get"" 
;"" 
set""  #
;""# $
}""% &
}## 
public(( 

class(( &
GetAgreedUserListVMDetails(( +
{)) 
public** 
IEnumerable** 
<** 
	SpCountVM** $
>**$ %
	SpCountVM**& /
{**0 1
get**2 5
;**5 6
set**7 :
;**: ;
}**< =
public++ 
IEnumerable++ 
<++ 
GetAgreedUserListVM++ .
>++. / 
GetAgreedUserListVMs++0 D
{++E F
get++G J
;++J K
set++L O
;++O P
}++Q R
},, 
}-- �
TD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\GetAgreementDetail.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
GetAgreementDetail #
{ 
public 
string 
AgreementName #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
LastPublishedDate '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
LastPublishversion (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
draftversion "
{# $
get% (
;( )
set* -
;- .
}/ 0
} 
public 

class "
GetAgreementDetailData '
{ 
public 
List 
< 
GetAgreementDetail &
>& '
data( ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
} 
public 

class %
GetAgreementDetailDetails *
{ 
public   
IEnumerable   
<   
GetAgreementDetail   -
>  - .
GetAgreementDetails  / B
{  C D
get  E H
;  H I
set  J M
;  M N
}  O P
}!! 
}"" �
PD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\MailTemplateVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
MailTemplateVM 
{		 
public

 
string

 
LinkURL

 
{

 
get

  #
;

# $
set

% (
;

( )
}

* +
public 
int 
AgreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
UserName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
CompanyLogo !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
MailSubject !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
MailBody 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
CC 
{ 
get 
; 
set  #
;# $
}% &
public 
string 
BCC 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 
[ 
] 
ToSendEmailsAddress +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
public 
string 
AssemblyName "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
CustomerCompanyName )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
} 
} �
[D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\ManageClientUserMappingVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class %
ManageClientUserMappingVM *
{		 
public

 
string

 
UserId

 
{

 
get

 "
;

" #
set

$ '
;

' (
}

) *
public 
string 

ClientName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
bool 
toAdd 
{ 
get 
;  
set! $
;$ %
}& '
} 
} �
LD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\RegisterVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Quickstart '
.' (
UI( *
{ 
public		 

class		 

RegisterVM		 
{

 
[ 	
Required	 
] 
public 
string 
Username 
{  
get! $
;$ %
set& )
;) *
}+ ,
[ 	
Required	 
] 
public 
string 
Password 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
Email 
{ 
get !
;! "
set# &
;& '
}( )
public 
int 
Id 
{ 
get 
; 
set  
;  !
}" #
public 
string 

IdentityId  
{! "
get# &
;& '
set( +
;+ ,
}- .
} 
public 

class 
IdPair 
{ 
public 
int 
userId 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 

IdentityId  
{! "
get# &
;& '
set( +
;+ ,
}- .
} 
} �
ND:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\RemoveUserVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
RemoveUserVM 
{		 
public

 
List

 
<

 
string

 
>

 
UserIds

 #
{

$ %
get

& )
;

) *
set

+ .
;

. /
}

0 1
} 
} �
eD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\RequestDownloadAgreementParameterVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class /
#RequestDownloadAgreementParameterVM 4
{		 
public

 
int

 
?

 
agreementTypeID

 #
{

$ %
get

& )
;

) *
set

+ .
;

. /
}

0 1
public 
string 
userAgreementID %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} �	
TD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\RequestParameterVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
RequestParameterVM #
{		 
public

 
int

 
agreementTypeID

 "
{

# $
get

% (
;

( )
set

* -
;

- .
}

/ 0
public 
string 
displayName !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
templateType "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
userName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
userRoleName "
{# $
get% (
;( )
set* -
;- .
}/ 0
} 
} �
YD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\RequestSprocParameterVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class #
RequestSprocParameterVM (
{		 
public

 
int

 
Page

 
{

 
get

 
;

 
set

 "
;

" #
}

$ %
public 
int 
pageSize 
{ 
get !
;! "
set# &
;& '
}( )
public 
List 
< 
string 
[ 
] 
> 
SortColumns )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
List 
< 
SearchColumn  
>  !
SearchColumns" /
{0 1
get2 5
;5 6
set7 :
;: ;
}< =
public 
string 
templateType "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
userID 
{ 
get "
;" #
set$ '
;' (
}) *
} 
public 

class 
SearchColumn 
{ 
public 
string 

ColumnName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
ColumnDataType $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
string 
SearchString "
{# $
get% (
;( )
set* -
;- .
}/ 0
} 
} �
bD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\RequestUseridPasswordParameterVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class ,
 RequestUseridPasswordParameterVM 1
{		 
public

 
string

 
userId

 
{

 
get

 "
;

" #
set

$ '
;

' (
}

) *
public 
string 
password 
{  
get! $
;$ %
set& )
;) *
}+ ,
} 
} �
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\ResetUserPasswordVM.cs
	namespace		 	
FJT		
 
.		 
IdentityServer		 
.		 
Models		 #
.		# $
	ViewModel		$ -
{

 
public 

class 
ResetUserPasswordVM $
{ 
public 
string 
User 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
	UserToken 
{  !
get" %
;% &
set' *
;* +
}, -
[ 	
DisplayName	 
( 
$str #
)# $
]$ %
[ 	
Required	 
( 
AllowEmptyStrings #
=$ %
false& +
,+ ,
ErrorMessage- 9
=: ;
Constant< D
.D E
REQUIRED_INPUT_MSGE W
)W X
]X Y
[ 	
RegularExpression	 
( 
$str d
,d e
ErrorMessagef r
=s t
Constantu }
.} ~*
PASSWORD_VALIDATION_INPUT_MSG	~ �
)
� �
]
� �
public 
string 
NewPassword !
{" #
get$ '
;' (
set) ,
;, -
}. /
[ 	
DisplayName	 
( 
$str +
)+ ,
], -
[ 	
Required	 
( 
AllowEmptyStrings #
=$ %
false& +
,+ ,
ErrorMessage- 9
=: ;
Constant< D
.D E
REQUIRED_INPUT_MSGE W
)W X
]X Y
[ 	
Compare	 
( 
$str 
, 
ErrorMessage  ,
=- .
Constant/ 7
.7 8'
PASSWORD_MISMATCH_INPUT_MSG8 S
)S T
]T U
public 
string 
ConfirmPassword %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} �
LD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\ResponseVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 

ResponseVM 
{		 
public

 
string

 
status

 
{

 
get

 "
;

" #
set

$ '
;

' (
}

) *
public 
object 
data 
{ 
get  
;  !
set" %
;% &
}' (
public 
UserMessageVM 
userMessage (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
string 
message 
{  
get! $
;$ %
set& )
;) *
}+ ,
} 
public 

class 
UserMessageVM 
{ 
public 
string 
message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
messageCode !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
messageType !
{" #
get$ '
;' (
set) ,
;, -
}. /
} 
} �
KD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\SpCountVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
	SpCountVM 
{		 
public

 
int

 
TotalRecord

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
} 
} �
QD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\UserAgreementVM.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class 
UserAgreementVM  
{		 
public

 
int

 
userAgreementID

 "
{

# $
get

% (
;

( )
set

* -
;

- .
}

/ 0
public 
string 
userID 
{ 
get "
;" #
set$ '
;' (
}) *
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
DateTime 
? 

agreedDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
	createdBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	updatedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
	deletedBy 
{  !
get" %
;% &
set' *
;* +
}, -
public 
DateTime 
	createdAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
DateTime 
? 
	updatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
DateTime 
? 
	deletedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public   
string   
createByRole   "
{  # $
get  % (
;  ( )
set  * -
;  - .
}  / 0
public"" 
string"" 
updateByRole"" "
{""# $
get""% (
;""( )
set""* -
;""- .
}""/ 0
public$$ 
string$$ 
deleteByRole$$ "
{$$# $
get$$% (
;$$( )
set$$* -
;$$- .
}$$/ 0
public&& 
string&& 
signaturevalue&& $
{&&% &
get&&' *
;&&* +
set&&, /
;&&/ 0
}&&1 2
}'' 
}(( �
YD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Models\ViewModel\UserSignUpAgreementList.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Models #
.# $
	ViewModel$ -
{ 
public 

class #
UserSignUpAgreementList (
{ 
public 
bool 
isPublished 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
userAgreementID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
int 
agreementID 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
agreementTypeID "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 

agreedDate  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
agreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
string 
imageURL 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
int 
version 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
templateType "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
newpublishedDate &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
string 
latestversion #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
headerpublishedDate )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
string 
agreementName #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
	createdby 
{  !
get" %
;% &
set' *
;* +
}, -
public 
int 
rnk 
{ 
get 
; 
set !
;! "
}# $
} 
public!! 

class!! '
UserSignUpAgreementListData!! ,
{"" 
public## 
List## 
<## #
UserSignUpAgreementList## +
>##+ ,
AgreementUserList##- >
{##? @
get##A D
;##D E
set##F I
;##I J
}##K L
public$$ 
int$$ 
Count$$ 
{$$ 
get$$ 
;$$ 
set$$  #
;$$# $
}$$% &
}%% 
public** 

class** *
UserSignUpAgreementListDetails** /
{++ 
public,, 
IEnumerable,, 
<,, 
	SpCountVM,, $
>,,$ %
	SpCountVM,,& /
{,,0 1
get,,2 5
;,,5 6
set,,7 :
;,,: ;
},,< =
public-- 
IEnumerable-- 
<-- #
UserSignUpAgreementList-- 2
>--2 3$
UserSignUpAgreementLists--4 L
{--M N
get--O R
;--R S
set--T W
;--W X
}--Y Z
}.. 
}// �
LD:\Development\FJT\FJT-DEV\FJT.IdentityServer\MongoDbModel\DynamicMessage.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
MongoDbModel )
{		 
public

 

class

 
DynamicMessage

 
{ 
[ 	
BsonId	 
] 
[ 	
BsonRepresentation	 
( 
BsonType $
.$ %
ObjectId% -
)- .
]. /
public 
string 
_id 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 

messageKey  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
category 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
messageType !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
messageCode !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
createdByName #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
DateTime 
createdDate #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
modifiedByName $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
DateTime 
modifiedDate $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
bool 
	isDeleted 
{ 
get  #
;# $
set% (
;( )
}* +
public 
int 
versionNumber  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
	developer 
{  !
get" %
;% &
set' *
;* +
}, -
public 
object 
previousVersion %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} �.
8D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Program.cs
	namespace 	
FJT
 
. 
IdentityServer 
{ 
public 

class 
Program 
{ 
public 
static 
void 
Main 
(  
string  &
[& '
]' (
args) -
)- .
{ 	
try 
{ 
var 
host 
=  
CreateWebHostBuilder +
(+ ,
args, 0
)0 1
.1 2
Build2 7
(7 8
)8 9
;9 :
var 
config 
= 
host 
. 
Services &
.& '
GetRequiredService' 9
<9 :
IConfiguration: H
>H I
(I J
)J K
;K L
var 
connectionString  
=! "
config# )
.) *
GetConnectionString* =
(= >
$str> Q
)Q R
;R S!
IConfigurationSection !
dbNames" )
=* +
config, 2
.2 3

GetSection3 =
(= >
$str> M
)M N
;N O
Log 
. 
Logger 
= 
new  
LoggerConfiguration! 4
(4 5
)5 6
. 
Enrich 
. 
FromLogContext "
(" #
)# $
.!! 
WriteTo!! 
.!! 
File!! 
(!! 
$str!! )
)!!) *
.## 
CreateLogger## 
(## 
)## 
;## 
Log%% 
.%% 
Information%% 
(%%  
$str%%  -
)%%- .
;%%. /
Console&& 
.&& 
Title&& 
=&& 
$str&&  1
;&&1 2
bool(( 
seed(( 
=(( 
config(( "
.((" #

GetSection((# -
(((- .
$str((. 4
)((4 5
.((5 6
GetValue((6 >
<((> ?
bool((? C
>((C D
(((D E
$str((E K
)((K L
;((L M
if)) 
()) 
seed)) 
))) 
{** 
Users++ 
.++ 
EnsureSeedData++ (
(++( )
connectionString++) 9
)++9 :
;++: ;
},, 
using.. 
(.. 
var.. 
scope..  
=..! "
host..# '
...' (
Services..( 0
...0 1
CreateScope..1 <
(..< =
)..= >
)..> ?
{// 
var00 
services00  
=00! "
scope00# (
.00( )
ServiceProvider00) 8
;008 9
var11 
context11 
=11  !
services11" *
.11* +
GetRequiredService11+ =
<11= > 
FJTIdentityDbContext11> R
>11R S
(11S T
)11T U
;11U V
}33 
host55 
.55 
Run55 
(55 
)55 
;55 
}66 
catch77 
(77 
	Exception77 
ex77 
)77  
{88 
Log99 
.99 
Fatal99 
(99 
ex99 
,99 
$str99 ;
)99; <
;99< =
}:: 
finally;; 
{<< 
Log== 
.== 
CloseAndFlush== !
(==! "
)==" #
;==# $
}>> 
Log?? 
.?? 
Logger?? 
.?? 
Information?? "
(??" #
$str??# a
)??a b
;??b c
}AA 	
publicCC 
staticCC 
IWebHostBuilderCC % 
CreateWebHostBuilderCC& :
(CC: ;
stringCC; A
[CCA B
]CCB C
argsCCD H
)CCH I
{DD 	
returnEE 
WebHostEE 
.EE  
CreateDefaultBuilderEE /
(EE/ 0
argsEE0 4
)EE4 5
.FF 

UseSerilogFF 
(FF  
)FF  !
.GG 

UseStartupGG 
<GG  
StartupGG  '
>GG' (
(GG( )
)GG) *
.HH 

UseSerilogHH 
(HH  
(HH  !
contextHH! (
,HH( )
configurationHH* 7
)HH7 8
=>HH9 ;
{II 
configurationJJ %
.KK 
MinimumLevelKK )
.KK) *
DebugKK* /
(KK/ 0
)KK0 1
.LL 
MinimumLevelLL )
.LL) *
OverrideLL* 2
(LL2 3
$strLL3 >
,LL> ?
LogEventLevelLL@ M
.LLM N
WarningLLN U
)LLU V
.MM 
MinimumLevelMM )
.MM) *
OverrideMM* 2
(MM2 3
$strMM3 ;
,MM; <
LogEventLevelMM= J
.MMJ K
WarningMMK R
)MMR S
.NN 
MinimumLevelNN )
.NN) *
OverrideNN* 2
(NN2 3
$strNN3 X
,NNX Y
LogEventLevelNNZ g
.NNg h
InformationNNh s
)NNs t
.OO 
EnrichOO #
.OO# $
FromLogContextOO$ 2
(OO2 3
)OO3 4
.PP 
WriteToPP $
.PP$ %
FilePP% )
(PP) *
$strPP* D
)PPD E
.QQ 
WriteToQQ $
.QQ$ %
ConsoleQQ% ,
(QQ, -
outputTemplateQQ- ;
:QQ; <
$str	QQ= �
,
QQ� �
theme
QQ� �
:
QQ� �
AnsiConsoleTheme
QQ� �
.
QQ� �
Literate
QQ� �
)
QQ� �
;
QQ� �
}RR 
)RR 
;RR 
}SS 	
}TT 
}UU ��
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\AccountController.cs
	namespace)) 	
IdentityServerHost))
 
.)) 

Quickstart)) '
.))' (
UI))( *
{** 
[-- 
SecurityHeaders-- 
]-- 
[.. 
AllowAnonymous.. 
].. 
public00 

class00 
AccountController00 "
:00# $

Controller00% /
{11 
private22 
readonly22 
UserManager22 $
<22$ %
ApplicationUser22% 4
>224 5
_userManager226 B
;22B C
private33 
readonly33 
SignInManager33 &
<33& '
ApplicationUser33' 6
>336 7
_signInManager338 F
;33F G
private44 
readonly44 -
!IIdentityServerInteractionService44 :
_interaction44; G
;44G H
private55 
readonly55 
IClientStore55 %
_clientStore55& 2
;552 3
private66 
readonly66 )
IAuthenticationSchemeProvider66 6
_schemeProvider667 F
;66F G
private77 
readonly77 
IEventService77 &
_events77' .
;77. /
private88 
readonly88 !
IFJTIdentityDbContext88 .
_fjtDBContext88/ <
;88< =
private99 
readonly99 #
IConfigurationDbContext99 0#
_configurationDbContext991 H
;99H I
private:: 
readonly:: 
IUserRepository:: (
_iUserRepository::) 9
;::9 :
private;; 
readonly;; $
IHttpsResponseRepository;; 1%
_iHttpsResponseRepository;;2 K
;;;K L
private<< 
readonly<< 
PageURLs<< !
	_pageURLs<<" +
;<<+ ,
private== 
readonly== 
ILogger==  
<==  !
AccountController==! 2
>==2 3
_logger==4 ;
;==; <
private>> 
readonly>> "
IDynamicMessageService>> /"
_dynamicMessageService>>0 F
;>>F G
private?? 
readonly?? 
IEmailService?? &
_emailService??' 4
;??4 5
private@@ 
readonly@@ "
ITextAngularValueForDB@@ /"
_textAngularValueForDB@@0 F
;@@F G
privateBB 
stringBB 
_agreementContentBB (
;BB( )
privateCC 
intCC 
?CC 
_versionCC 
;CC 
privateDD 
DateTimeDD 
?DD 

_effectiveDD $
;DD$ %
publicFF 
AccountControllerFF  
(FF  !
UserManagerGG 
<GG 
ApplicationUserGG '
>GG' (
userManagerGG) 4
,GG4 5
SignInManagerHH 
<HH 
ApplicationUserHH )
>HH) *
signInManagerHH+ 8
,HH8 9-
!IIdentityServerInteractionServiceII -
interactionII. 9
,II9 :
IClientStoreJJ 
clientStoreJJ $
,JJ$ %)
IAuthenticationSchemeProviderKK )
schemeProviderKK* 8
,KK8 9
IEventServiceLL 
eventsLL  
,LL  !
IUserRepositoryMM 
iUserRepositoryMM +
,MM+ ,!
IFJTIdentityDbContextNN !
fjtDBContextNN" .
,NN. /$
IHttpsResponseRepositoryOO $$
iHttpsResponseRepositoryOO% =
,OO= >#
IConfigurationDbContextPP #"
configurationDbContextPP$ :
,PP: ;
IOptionsQQ 
<QQ 
PageURLsQQ 
>QQ 
pageURLsQQ '
,QQ' (
ILoggerRR 
<RR 
AccountControllerRR %
>RR% &
loggerRR' -
,RR- ."
IDynamicMessageServiceSS "!
dynamicMessageServiceSS# 8
,SS8 9
IEmailServiceTT 
emailServiceTT &
,TT& '"
ITextAngularValueForDBUU "!
textAngularValueForDBUU# 8
)UU8 9
{VV 	
_userManagerWW 
=WW 
userManagerWW &
;WW& '
_signInManagerXX 
=XX 
signInManagerXX *
;XX* +
_interactionYY 
=YY 
interactionYY &
;YY& '
_clientStoreZZ 
=ZZ 
clientStoreZZ &
;ZZ& '
_schemeProvider[[ 
=[[ 
schemeProvider[[ ,
;[[, -
_events\\ 
=\\ 
events\\ 
;\\ 
_fjtDBContext]] 
=]] 
fjtDBContext]] (
;]]( )#
_configurationDbContext^^ #
=^^$ %"
configurationDbContext^^& <
;^^< =
_iUserRepository__ 
=__ 
iUserRepository__ .
;__. /%
_iHttpsResponseRepository`` %
=``& '$
iHttpsResponseRepository``( @
;``@ A
	_pageURLsaa 
=aa 
pageURLsaa  
.aa  !
Valueaa! &
;aa& '
_loggerbb 
=bb 
loggerbb 
;bb "
_dynamicMessageServicecc "
=cc# $!
dynamicMessageServicecc% :
;cc: ;
_emailServicedd 
=dd 
emailServicedd (
;dd( )"
_textAngularValueForDBee "
=ee# $!
textAngularValueForDBee% :
;ee: ;
}ff 	
[ii 	
HttpGetii	 
]ii 
publicjj 
IActionResultjj 
Indexjj "
(jj" #
)jj# $
{kk 	
returnll 
RedirectToActionll #
(ll# $
$strll$ +
)ll+ ,
;ll, -
}mm 	
[rr 	
HttpGetrr	 
]rr 
publicss 
asyncss 
Taskss 
<ss 
IActionResultss '
>ss' (
Loginss) .
(ss. /
stringss/ 5
	returnUrlss6 ?
)ss? @
{tt 	
ifuu 
(uu 
	returnUrluu 
==uu 
nulluu !
)uu! "
{vv 
returnww 
Redirectww 
(ww  
	_pageURLsww  )
.ww) *
UIURLww* /
)ww/ 0
;ww0 1
}xx 
varyy 
isAuthenticatedUseryy #
=yy$ %
Useryy& *
?yy* +
.yy+ ,
Identityyy, 4
.yy4 5
IsAuthenticatedyy5 D
;yyD E
ifzz 
(zz 
isAuthenticatedUserzz #
==zz$ &
truezz' +
)zz+ ,
{{{ 
var|| 
context|| 
=|| 
await|| #
_interaction||$ 0
.||0 1(
GetAuthorizationContextAsync||1 M
(||M N
	returnUrl||N W
)||W X
;||X Y
string}} 
redirectUri}} "
=}}# $
context}}% ,
.}}, -
RedirectUri}}- 8
.}}8 9
Contains}}9 A
(}}A B
	_pageURLs}}B K
.}}K L
UIURL}}L Q
)}}Q R
?}}S T
(}}U V
context}}V ]
.}}] ^
RedirectUri}}^ i
.}}i j
Split}}j o
(}}o p
$str}}p t
)}}t u
)}}u v
[}}v w
$num}}w x
]}}x y
:}}z {
(}}| }
context	}}} �
.
}}� �
RedirectUri
}}� �
+
}}� �
$str
}}� �
)
}}� �
;
}}� �
return~~ 
Redirect~~ 
(~~  
redirectUri~~  +
)~~+ ,
;~~, -
} 
var
�� 
vm
�� 
=
�� 
await
�� &
BuildLoginViewModelAsync
�� 3
(
��3 4
	returnUrl
��4 =
)
��= >
;
��> ?
if
�� 
(
�� 
vm
�� 
.
�� !
IsExternalLoginOnly
�� &
)
��& '
{
�� 
return
�� 
RedirectToAction
�� '
(
��' (
$str
��( 3
,
��3 4
$str
��5 ?
,
��? @
new
��A D
{
��E F
provider
��G O
=
��P Q
vm
��R T
.
��T U!
ExternalLoginScheme
��U h
,
��h i
	returnUrl
��j s
}
��t u
)
��u v
;
��v w
}
�� 
return
�� 
View
�� 
(
�� 
vm
�� 
)
�� 
;
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
Login
��) .
(
��. /
LoginInputModel
��/ >
model
��? D
)
��D E
{
�� 	
var
�� 
context
�� 
=
�� 
await
�� 
_interaction
��  ,
.
��, -*
GetAuthorizationContextAsync
��- I
(
��I J
model
��J O
.
��O P
	ReturnUrl
��P Y
)
��Y Z
;
��Z [
if
�� 
(
�� 

ModelState
�� 
.
�� 
IsValid
�� "
)
��" #
{
�� 
var
�� 
user
�� 
=
�� 
await
��  
_userManager
��! -
.
��- .
FindByNameAsync
��. =
(
��= >
model
��> C
.
��C D
Username
��D L
)
��L M
;
��M N
var
�� 
result
�� 
=
�� 
await
�� "
_signInManager
��# 1
.
��1 2
UserManager
��2 =
.
��= > 
CheckPasswordAsync
��> P
(
��P Q
user
��Q U
,
��U V
model
��W \
.
��\ ]
Password
��] e
)
��e f
;
��f g
if
�� 
(
�� 
result
�� 
&&
�� 
user
�� "
.
��" #
	isDeleted
��# ,
==
��- /
false
��0 5
)
��5 6
{
�� 
if
�� 
(
�� 
context
�� 
!=
��  "
null
��# '
)
��' (
{
�� 
if
�� 
(
�� 
await
�� !
_clientStore
��" .
.
��. /
IsPkceClientAsync
��/ @
(
��@ A
context
��A H
.
��H I
Client
��I O
.
��O P
ClientId
��P X
)
��X Y
)
��Y Z
{
�� 
var
�� 
clientUSerMapping
��  1
=
��2 3
await
��4 9
_fjtDBContext
��: G
.
��G H 
ClientUsersMapping
��H Z
.
��Z [!
FirstOrDefaultAsync
��[ n
(
��n o
x
��o p
=>
��q s
x
��t u
.
��u v
UserId
��v |
==
��} 
user��� �
.��� �
Id��� �
&&��� �
x��� �
.��� �
ClientId��� �
==��� �
context��� �
.��� �
Client��� �
.��� �
ClientId��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
;��� �
if
�� 
(
��  
clientUSerMapping
��  1
==
��2 4
null
��5 9
)
��9 :
{
�� 
var
��  #
accessDeniedMSG
��$ 3
=
��4 5
await
��6 ;$
_dynamicMessageService
��< R
.
��R S
Get
��S V
(
��V W!
POPUP_ACCESS_DENIED
��W j
)
��j k
;
��k l
await
��  %
_events
��& -
.
��- .

RaiseAsync
��. 8
(
��8 9
new
��9 <#
UserLoginFailureEvent
��= R
(
��R S
model
��S X
.
��X Y
Username
��Y a
,
��a b
string
��c i
.
��i j
Format
��j p
(
��p q
accessDeniedMSG��q �
.��� �
message��� �
,��� �
	REQUESTED��� �
)��� �
)��� �
)��� �
;��� �
var
��  #
loginVM
��$ +
=
��, -
await
��. 3&
BuildLoginViewModelAsync
��4 L
(
��L M
model
��M R
)
��R S
;
��S T
var
��  #
dynamicMessages
��$ 3
=
��4 5
new
��6 9
DynamicMessage
��: H
(
��H I
)
��I J
{
��K L
messageType
��M X
=
��Y Z
	ERROR_MSG
��[ d
,
��d e
message
��f m
=
��n o
AccountOptions
��p ~
.
��~ ,
ClientUserMappingErrorMessage�� �
}��� �
;��� �
ViewBag
��  '
.
��' (
dynamicMessage
��( 6
=
��7 8
dynamicMessages
��9 H
;
��H I
return
��  &
View
��' +
(
��+ ,
loginVM
��, 3
)
��3 4
;
��4 5
}
�� 
int
�� '
lastUserSignedAgreementId
��  9
=
��: ;
await
��< A
_fjtDBContext
��B O
.
��O P
UserAgreement
��P ]
.
��] ^
Where
��^ c
(
��c d
x
��d e
=>
��f h
x
��i j
.
��j k
userID
��k q
==
��r t 
clientUSerMapping��u �
.��� �
UserId��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �!
OrderByDescending��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
userAgreementID��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
agreementID��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
var
�� 
agreemenTypeId
��  .
=
��/ 0
await
��1 6
_fjtDBContext
��7 D
.
��D E
AgreementType
��E R
.
��R S
Where
��S X
(
��X Y
x
��Y Z
=>
��[ ]
x
��^ _
.
��_ `
agreementType
��` m
==
��n p.
USER_SIGNUP_AGREEMENT_TYPE_NAME��q �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
agreementTypeID��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
int
�� (
letestPublishedAgreementId
��  :
=
��; <
await
��= B+
GetLetestPublishedAgreementId
��C `
(
��` a
agreemenTypeId
��a o
)
��o p
;
��p q
if
�� 
(
��  '
lastUserSignedAgreementId
��  9
!=
��: <
$num
��= >
&&
��? A
(
��B C'
lastUserSignedAgreementId
��C \
==
��] _(
letestPublishedAgreementId
��` z
)
��z {
)
��{ |
{
�� 
var
��  #

userSignIn
��$ .
=
��/ 0
await
��1 6
_signInManager
��7 E
.
��E F!
PasswordSignInAsync
��F Y
(
��Y Z
model
��Z _
.
��_ `
Username
��` h
,
��h i
model
��j o
.
��o p
Password
��p x
,
��x y
model
��z 
.�� �
RememberLogin��� �
,��� � 
lockoutOnFailure��� �
:��� �
true��� �
)��� �
;��� �
await
��  %
_events
��& -
.
��- .

RaiseAsync
��. 8
(
��8 9
new
��9 <#
UserLoginSuccessEvent
��= R
(
��R S
user
��S W
.
��W X
UserName
��X `
,
��` a
user
��b f
.
��f g
Id
��g i
,
��i j
user
��k o
.
��o p
UserName
��p x
)
��x y
)
��y z
;
��z {
return
��  &
View
��' +
(
��+ ,
$str
��, 6
,
��6 7
new
��8 ;
RedirectViewModel
��< M
{
��N O
RedirectUrl
��P [
=
��\ ]
model
��^ c
.
��c d
	ReturnUrl
��d m
}
��n o
)
��o p
;
��p q
}
�� 
else
��  
{
�� 
if
��  "
(
��# $
model
��$ )
.
��) *
AcceptAgreement
��* 9
==
��: <
true
��= A
)
��A B
{
��  !
try
��$ '
{
��$ %
UserAgreement
��( 5
userAgreement
��6 C
=
��D E
new
��F I
UserAgreement
��J W
(
��W X
)
��X Y
{
��( )
userID
��, 2
=
��3 4
user
��5 9
.
��9 :
Id
��: <
,
��< =
agreementID
��, 7
=
��8 9(
letestPublishedAgreementId
��: T
,
��T U

agreedDate
��, 6
=
��7 8
DateTime
��9 A
.
��A B
UtcNow
��B H
,
��H I
	isDeleted
��, 5
=
��6 7
false
��8 =
,
��= >
	createdBy
��, 5
=
��6 7
user
��8 <
.
��< =
UserName
��= E
,
��E F
	updatedBy
��, 5
=
��6 7
user
��8 <
.
��< =
UserName
��= E
,
��E F
	createdAt
��, 5
=
��6 7
DateTime
��8 @
.
��@ A
UtcNow
��A G
,
��G H
	updatedAt
��, 5
=
��6 7
DateTime
��8 @
.
��@ A
UtcNow
��A G
,
��G H
signaturevalue
��, :
=
��; <
model
��= B
.
��B C
FinalSignature
��C Q
}
��( )
;
��) *
_fjtDBContext
��( 5
.
��5 6
UserAgreement
��6 C
.
��C D
Add
��D G
(
��G H
userAgreement
��H U
)
��U V
;
��V W
await
��( -
_fjtDBContext
��. ;
.
��; <
CustomSaveChanges
��< M
(
��M N
)
��N O
;
��O P
var
��( +

userSignIn
��, 6
=
��7 8
await
��9 >
_signInManager
��? M
.
��M N!
PasswordSignInAsync
��N a
(
��a b
model
��b g
.
��g h
Username
��h p
,
��p q
model
��r w
.
��w x
Password��x �
,��� �
model��� �
.��� �
RememberLogin��� �
,��� � 
lockoutOnFailure��� �
:��� �
true��� �
)��� �
;��� �
await
��( -
_events
��. 5
.
��5 6

RaiseAsync
��6 @
(
��@ A
new
��A D#
UserLoginSuccessEvent
��E Z
(
��Z [
user
��[ _
.
��_ `
UserName
��` h
,
��h i
user
��j n
.
��n o
Id
��o q
,
��q r
user
��s w
.
��w x
UserName��x �
)��� �
)��� �
;��� �
return
��( .
View
��/ 3
(
��3 4
$str
��4 >
,
��> ?
new
��@ C
RedirectViewModel
��D U
{
��V W
RedirectUrl
��X c
=
��d e
model
��f k
.
��k l
	ReturnUrl
��l u
}
��v w
)
��w x
;
��x y
}
��$ %
catch
��$ )
(
��* +
	Exception
��+ 4
e
��5 6
)
��6 7
{
��$ %
_logger
��( /
.
��/ 0
LogError
��0 8
(
��8 9
e
��9 :
.
��: ;
ToString
��; C
(
��C D
)
��D E
)
��E F
;
��F G
return
��( .
View
��/ 3
(
��3 4
$str
��4 ;
,
��; <
new
��= @
ErrorViewModel
��A O
(
��O P
)
��P Q
{
��R S
Error
��T Y
=
��Z [
new
��\ _
ErrorMessage
��` l
(
��l m
)
��m n
{
��o p
Error
��q v
=
��w x
e
��y z
.
��z {
Message��{ �
}��� �
}��� �
)��� �
;��� �
}
��$ %
}
��  !
var
��  #
dynamicMessages
��$ 3
=
��4 5
await
��6 ;$
_dynamicMessageService
��< R
.
��R S
Get
��S V
(
��V W"
LOGIN_AGRREMENT_SIGN
��W k
)
��k l
;
��l m
ViewBag
��  '
.
��' (
dynamicMessage
��( 6
=
��7 8
dynamicMessages
��9 H
;
��H I
ViewBag
��  '
.
��' (
deleteConfirmMSG
��( 8
=
��9 :
await
��; @$
_dynamicMessageService
��A W
.
��W X
Get
��X [
(
��[ \$
DELETE_CONFIRM_MESSAGE
��\ r
)
��r s
;
��s t
ViewBag
��  '
.
��' (!
provideSignatureMSG
��( ;
=
��< =
await
��> C$
_dynamicMessageService
��D Z
.
��Z [
Get
��[ ^
(
��^ _
PROVIDE_SIGNATURE
��_ p
)
��p q
;
��q r
ViewBag
��  '
.
��' (&
leavePageConfirmationMSG
��( @
=
��A B
await
��C H$
_dynamicMessageService
��I _
.
��_ `
Get
��` c
(
��c d0
!WITHOUT_SAVING_ALERT_BODY_MESSAGE��d �
)��� �
;��� �
await
��  %
_events
��& -
.
��- .

RaiseAsync
��. 8
(
��8 9
new
��9 <#
UserLoginFailureEvent
��= R
(
��R S
model
��S X
.
��X Y
Username
��Y a
,
��a b
dynamicMessages
��c r
.
��r s
message
��s z
)
��z {
)
��{ |
;
��| }
model
��  %
.
��% &&
ShowAcceptAgreementPopUp
��& >
=
��? @
true
��A E
;
��E F
if
��  "
(
��# $
_version
��$ ,
==
��- /
null
��0 4
)
��4 5
{
��  !
	Agreement
��$ -
	agreement
��. 7
=
��8 9
await
��: ?+
RetrivePublishedAgreementById
��@ ]
(
��] ^(
letestPublishedAgreementId
��^ x
)
��x y
;
��y z
if
��$ &
(
��' (
	agreement
��( 1
!=
��2 4
null
��5 9
)
��9 :
{
��$ %
_version
��( 0
=
��1 2
	agreement
��3 <
.
��< =
version
��= D
;
��D E
_agreementContent
��( 9
=
��: ;
	agreement
��< E
.
��E F
agreementContent
��F V
;
��V W

_effective
��( 2
=
��3 4
	agreement
��5 >
.
��> ?
publishedDate
��? L
;
��L M
}
��$ %
}
��  !
var
��  #
loginVM
��$ +
=
��, -
await
��. 3&
BuildLoginViewModelAsync
��4 L
(
��L M
model
��M R
)
��R S
;
��S T
return
��  &
View
��' +
(
��+ ,
loginVM
��, 3
)
��3 4
;
��4 5
}
�� 
}
�� 
return
�� 
Redirect
�� '
(
��' (
model
��( -
.
��- .
	ReturnUrl
��. 7
)
��7 8
;
��8 9
}
�� 
if
�� 
(
�� 
Url
�� 
.
�� 

IsLocalUrl
�� &
(
��& '
model
��' ,
.
��, -
	ReturnUrl
��- 6
)
��6 7
)
��7 8
{
�� 
return
�� 
Redirect
�� '
(
��' (
model
��( -
.
��- .
	ReturnUrl
��. 7
)
��7 8
;
��8 9
}
�� 
else
�� 
if
�� 
(
�� 
string
�� #
.
��# $
IsNullOrEmpty
��$ 1
(
��1 2
model
��2 7
.
��7 8
	ReturnUrl
��8 A
)
��A B
)
��B C
{
�� 
return
�� 
Redirect
�� '
(
��' (
$str
��( ,
)
��, -
;
��- .
}
�� 
else
�� 
{
�� 
throw
�� 
new
�� !
	Exception
��" +
(
��+ , 
INVALID_RETURN_URL
��, >
)
��> ?
;
��? @
}
�� 
}
�� 
else
�� 
{
�� 
var
�� 
userTemp
��  
=
��! "
await
��# (
_userManager
��) 5
.
��5 6
FindByNameAsync
��6 E
(
��E F
model
��F K
.
��K L
Username
��L T
)
��T U
;
��U V
if
�� 
(
�� 
userTemp
��  
!=
��! #
null
��$ (
&&
��) +
!
��, -
userTemp
��- 5
.
��5 6!
passwordHashUpdated
��6 I
)
��I J
{
�� 
bool
�� "
verifyPasswordDigest
�� 1
=
��2 3
BCrypt
��4 :
.
��: ;
Net
��; >
.
��> ?
BCrypt
��? E
.
��E F
Verify
��F L
(
��L M
model
��M R
.
��R S
Password
��S [
,
��[ \
userTemp
��] e
.
��e f 
userPasswordDigest
��f x
)
��x y
;
��y z
if
�� 
(
�� "
verifyPasswordDigest
�� 0
)
��0 1
{
�� 
var
�� 
token
��  %
=
��& '
await
��( -
_userManager
��. :
.
��: ;-
GeneratePasswordResetTokenAsync
��; Z
(
��Z [
userTemp
��[ c
)
��c d
;
��d e
var
�� 

resultTest
��  *
=
��+ ,
await
��- 2
_userManager
��3 ?
.
��? @ 
ResetPasswordAsync
��@ R
(
��R S
userTemp
��S [
,
��[ \
token
��] b
,
��b c
model
��d i
.
��i j
Password
��j r
)
��r s
;
��s t
if
�� 
(
��  

resultTest
��  *
.
��* +
	Succeeded
��+ 4
)
��4 5
{
�� 
userTemp
��  (
.
��( )!
passwordHashUpdated
��) <
=
��= >
true
��? C
;
��C D
await
��  %
_userManager
��& 2
.
��2 3
UpdateAsync
��3 >
(
��> ?
userTemp
��? G
)
��G H
;
��H I
await
��  %
Login
��& +
(
��+ ,
model
��, 1
)
��1 2
;
��2 3
return
��  &
View
��' +
(
��+ ,
$str
��, 6
,
��6 7
new
��8 ;
RedirectViewModel
��< M
{
��N O
RedirectUrl
��P [
=
��\ ]
model
��^ c
.
��c d
	ReturnUrl
��d m
}
��n o
)
��o p
;
��p q
}
�� 
}
�� 
}
�� 
}
�� 
ViewBag
�� 
.
�� 
dynamicMessage
�� &
=
��' (
await
��) .$
_dynamicMessageService
��/ E
.
��E F
Get
��F I
(
��I J.
 USER_USERNAME_PASSWORD_INCORRECT
��J j
)
��j k
;
��k l
await
�� 
_events
�� 
.
�� 

RaiseAsync
�� (
(
��( )
new
��) ,#
UserLoginFailureEvent
��- B
(
��B C
model
��C H
.
��H I
Username
��I Q
,
��Q R
AccountOptions
��S a
.
��a b-
InvalidCredentialsErrorMessage��b �
)��� �
)��� �
;��� �
}
�� 
var
�� 
vm
�� 
=
�� 
await
�� &
BuildLoginViewModelAsync
�� 3
(
��3 4
model
��4 9
)
��9 :
;
��: ;
return
�� 
View
�� 
(
�� 
vm
�� 
)
�� 
;
�� 
}
�� 	
[
�� 	
HttpGet
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
Logout
��) /
(
��/ 0
string
��0 6
logoutId
��7 ?
)
��? @
{
�� 	
var
�� 
vm
�� 
=
�� 
await
�� '
BuildLogoutViewModelAsync
�� 4
(
��4 5
logoutId
��5 =
)
��= >
;
��> ?
return
�� 
await
�� 
Logout
�� 
(
��  
vm
��  "
)
��" #
;
��# $
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
[
�� 	&
ValidateAntiForgeryToken
��	 !
]
��! "
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
Logout
��) /
(
��/ 0
LogoutInputModel
��0 @
model
��A F
)
��F G
{
�� 	
var
�� 
vm
�� 
=
�� 
await
�� *
BuildLoggedOutViewModelAsync
�� 7
(
��7 8
model
��8 =
.
��= >
LogoutId
��> F
)
��F G
;
��G H
if
�� 
(
�� 
User
�� 
?
�� 
.
�� 
Identity
�� 
.
�� 
IsAuthenticated
�� .
==
��/ 1
true
��2 6
)
��6 7
{
�� 
await
�� 
HttpContext
�� !
.
��! "
SignOutAsync
��" .
(
��. /%
IdentityServerConstants
��/ F
.
��F G/
!DefaultCookieAuthenticationScheme
��G h
)
��h i
;
��i j
await
�� 
_signInManager
�� $
.
��$ %
SignOutAsync
��% 1
(
��1 2
)
��2 3
;
��3 4
await
�� 
_events
�� 
.
�� 

RaiseAsync
�� (
(
��( )
new
��) ,$
UserLogoutSuccessEvent
��- C
(
��C D
User
��D H
.
��H I
GetSubjectId
��I U
(
��U V
)
��V W
,
��W X
User
��Y ]
.
��] ^
GetDisplayName
��^ l
(
��l m
)
��m n
)
��n o
)
��o p
;
��p q
}
�� 
if
�� 
(
�� 
vm
�� 
.
�� $
TriggerExternalSignout
�� )
)
��) *
{
�� 
string
�� 
url
�� 
=
�� 
Url
��  
.
��  !
Action
��! '
(
��' (
$str
��( 0
,
��0 1
new
��2 5
{
��6 7
logoutId
��8 @
=
��A B
vm
��C E
.
��E F
LogoutId
��F N
}
��O P
)
��P Q
;
��Q R
return
�� 
SignOut
�� 
(
�� 
new
�� "&
AuthenticationProperties
��# ;
{
��< =
RedirectUri
��> I
=
��J K
url
��L O
}
��P Q
,
��Q R
vm
��S U
.
��U V*
ExternalAuthenticationScheme
��V r
)
��r s
;
��s t
}
�� 
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
��% &
vm
��& (
.
��( )#
PostLogoutRedirectUri
��) >
)
��> ?
)
��? @
{
�� 
ViewBag
�� 
.
�� 
	returnURL
�� !
=
��" #
vm
��$ &
.
��& '#
PostLogoutRedirectUri
��' <
;
��< =
}
�� 
else
�� 
{
�� 
var
�� 
referer
�� 
=
�� 
Request
�� %
.
��% &
Headers
��& -
[
��- .
$str
��. 7
]
��7 8
;
��8 9
if
�� 
(
�� 
!
�� 
string
�� 
.
�� 
IsNullOrEmpty
�� )
(
��) *
referer
��* 1
)
��1 2
)
��2 3
{
�� 
var
�� 
refererString
�� %
=
��& '
referer
��( /
.
��/ 0
ToString
��0 8
(
��8 9
)
��9 :
;
��: ;
PropertyInfo
��  
[
��  !
]
��! "
propertyInfos
��# 0
=
��1 2
	_pageURLs
��3 <
.
��< =
GetType
��= D
(
��D E
)
��E F
.
��F G
GetProperties
��G T
(
��T U
)
��U V
;
��V W
ViewBag
�� 
.
�� 
	returnURL
�� %
=
��& '
propertyInfos
��( 5
.
��5 6
Where
��6 ;
(
��; <
x
��< =
=>
��> @
refererString
��A N
.
��N O
Contains
��O W
(
��W X
x
��X Y
.
��Y Z
GetValue
��Z b
(
��b c
	_pageURLs
��c l
)
��l m
.
��m n
ToString
��n v
(
��v w
)
��w x
)
��x y
)
��y z
.
��z {
Select��{ �
(��� �
x��� �
=>��� �
x��� �
.��� �
GetValue��� �
(��� �
	_pageURLs��� �
)��� �
.��� �
ToString��� �
(��� �
)��� �
)��� �
.��� �
FirstOrDefault��� �
(��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
ViewBag
�� 
.
�� 
	returnURL
�� %
=
��& '
	_pageURLs
��( 1
.
��1 2
UIURL
��2 7
;
��7 8
}
�� 
}
�� 
return
�� 
View
�� 
(
�� 
$str
�� #
,
��# $
vm
��% '
)
��' (
;
��( )
}
�� 	
[
�� 	
HttpGet
��	 
]
�� 
public
�� 
IActionResult
�� 
ForgotPassword
�� +
(
��+ ,
)
��, -
{
�� 	
ForgotPassword
�� 
forgotPassword
�� )
=
��* +
new
��, /
ForgotPassword
��0 >
(
��> ?
)
��? @
;
��@ A
return
�� 
View
�� 
(
�� 
forgotPassword
�� &
)
��& '
;
��' (
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (!
ForgotPasswordAsync
��) <
(
��< =
ForgotPassword
��= K
forgotPassword
��L Z
)
��Z [
{
�� 	
try
�� 
{
�� 
MailTemplateVM
�� 
mailTemplateVM
�� -
=
��. /
new
��0 3
MailTemplateVM
��4 B
(
��B C
)
��C D
{
�� 
AgreementTypeID
�� #
=
��$ %
(
��& '
int
��' *
)
��* +
AgreementTypeId
��+ :
.
��: ;
ForgotPassword
��; I
}
�� 
;
�� 
List
�� 
<
�� 
string
�� 
>
�� 
	emailList
�� &
=
��' (
new
��) ,
List
��- 1
<
��1 2
string
��2 8
>
��8 9
(
��9 :
)
��: ;
;
��; <
string
�� 
token
�� 
=
�� 
string
�� %
.
��% &
Empty
��& +
;
��+ ,
string
�� 
userName
�� 
=
��  !
string
��" (
.
��( )
Empty
��) .
;
��. /
bool
�� 
isUserHaveEmail
�� $
=
��% &
false
��' ,
;
��, -
var
�� 
userByEmail
�� 
=
��  !
await
��" '
_userManager
��( 4
.
��4 5
Users
��5 :
.
��: ;
Where
��; @
(
��@ A
x
��A B
=>
��C E
x
��F G
.
��G H
Email
��H M
==
��N P
forgotPassword
��Q _
.
��_ `
EmailOrUserId
��` m
&&
��n p
x
��q r
.
��r s
	isDeleted
��s |
==
��} 
false��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
if
�� 
(
�� 
userByEmail
�� 
==
��  "
null
��# '
)
��' (
{
�� 
var
�� 
userByUserName
�� &
=
��' (
await
��) .
_userManager
��/ ;
.
��; <
Users
��< A
.
��A B
Where
��B G
(
��G H
x
��H I
=>
��J L
x
��M N
.
��N O
UserName
��O W
==
��X Z
forgotPassword
��[ i
.
��i j
EmailOrUserId
��j w
&&
��x z
x
��{ |
.
��| }
	isDeleted��} �
==��� �
false��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
if
�� 
(
�� 
userByUserName
�� &
==
��' )
null
��* .
)
��. /
{
�� 
ViewBag
�� 
.
��  
dynamicMessage
��  .
=
��/ 0
await
��1 6$
_dynamicMessageService
��7 M
.
��M N
Get
��N Q
(
��Q R
$str
��R o
)
��o p
;
��p q
return
�� 
View
�� #
(
��# $
forgotPassword
��$ 2
)
��2 3
;
��3 4
}
�� 
token
�� 
=
�� 
await
�� !
_userManager
��" .
.
��. /-
GeneratePasswordResetTokenAsync
��/ N
(
��N O
userByUserName
��O ]
)
��] ^
;
��^ _
if
�� 
(
�� 
userByUserName
�� &
.
��& '
Email
��' ,
.
��, -
IsNullOrEmpty
��- :
(
��: ;
)
��; <
)
��< =
{
�� 
userName
��  
=
��! "
userByUserName
��# 1
.
��1 2
UserName
��2 :
;
��: ;
	emailList
�� !
=
��" #
await
��$ )
_userManager
��* 6
.
��6 7
Users
��7 <
.
��< =
Where
��= B
(
��B C
x
��C D
=>
��E G
x
��H I
.
��I J
isSuperAdmin
��J V
==
��W Y
true
��Z ^
&&
��_ a
x
��b c
.
��c d
	isDeleted
��d m
==
��n p
false
��q v
)
��v w
.
��w x
Select
��x ~
(
��~ 
x�� �
=>��� �
x��� �
.��� �
Email��� �
)��� �
.��� �
ToListAsync��� �
(��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
isUserHaveEmail
�� '
=
��( )
true
��* .
;
��. /
userName
��  
=
��! "
string
��# )
.
��) *
Format
��* 0
(
��0 12
$FORGOT_PASSWORD_MAIL_USERNAME_FORMAT
��1 U
,
��U V
userByUserName
��W e
.
��e f
UserName
��f n
,
��n o
userByUserName
��p ~
.
��~ 
Email�� �
)��� �
;��� �
	emailList
�� !
.
��! "
Add
��" %
(
��% &
userByUserName
��& 4
.
��4 5
Email
��5 :
)
��: ;
;
��; <
}
�� 
}
�� 
else
�� 
{
�� 
isUserHaveEmail
�� #
=
��$ %
true
��& *
;
��* +
token
�� 
=
�� 
await
�� !
_userManager
��" .
.
��. /-
GeneratePasswordResetTokenAsync
��/ N
(
��N O
userByEmail
��O Z
)
��Z [
;
��[ \
userName
�� 
=
�� 
string
�� %
.
��% &
Format
��& ,
(
��, -2
$FORGOT_PASSWORD_MAIL_USERNAME_FORMAT
��- Q
,
��Q R
userByEmail
��S ^
.
��^ _
UserName
��_ g
,
��g h
userByEmail
��i t
.
��t u
Email
��u z
)
��z {
;
��{ |
	emailList
�� 
.
�� 
Add
�� !
(
��! "
userByEmail
��" -
.
��- .
Email
��. 3
)
��3 4
;
��4 5
}
�� 
var
�� 
tokenEncrypted
�� "
=
��# $
CryptoJs
��% -
.
��- .
Encrypt
��. 5
(
��5 6
token
��6 ;
)
��; <
;
��< =
var
�� 
encryptedUserName
�� %
=
��& '
CryptoJs
��( 0
.
��0 1
Encrypt
��1 8
(
��8 9
userName
��9 A
)
��A B
;
��B C
mailTemplateVM
�� 
.
�� 
UserName
�� '
=
��( )
userName
��* 2
;
��2 3
mailTemplateVM
�� 
.
�� !
ToSendEmailsAddress
�� 2
=
��3 4
	emailList
��5 >
.
��> ?
ToArray
��? F
(
��F G
)
��G H
;
��H I
mailTemplateVM
�� 
.
�� 
LinkURL
�� &
=
��' (
string
��) /
.
��/ 0
Format
��0 6
(
��6 7+
FORGOT_PASSWORD_CALLBACK_LINK
��7 T
,
��T U
	_pageURLs
��V _
.
��_ `
IdentityServerURL
��` q
,
��q r 
encryptedUserName��s �
,��� �
tokenEncrypted��� �
)��� �
;��� �

ResponseVM
�� 

responseVM
�� %
=
��& '
await
��( -
SendMailTemplate
��. >
(
��> ?
mailTemplateVM
��? M
)
��M N
;
��N O
if
�� 
(
�� 

responseVM
�� 
.
�� 
status
�� %
==
��& (
State
��) .
.
��. /
SUCCESS
��/ 6
.
��6 7
ToString
��7 ?
(
��? @
)
��@ A
)
��A B
{
�� 
forgotPassword
�� "
.
��" #
SuccessSendEmail
��# 3
=
��4 5
true
��6 :
;
��: ;
forgotPassword
�� "
.
��" #
IsUserHaveEmail
��# 2
=
��3 4
isUserHaveEmail
��5 D
;
��D E
return
�� 
View
�� 
(
��  
forgotPassword
��  .
)
��. /
;
��/ 0
}
�� 
else
�� 
{
�� 
var
�� 
dynamicMessage
�� &
=
��' (
new
��) ,
DynamicMessage
��- ;
(
��; <
)
��< =
{
��> ?
messageType
��@ K
=
��L M
	ERROR_MSG
��N W
,
��W X
message
��Y `
=
��a b

responseVM
��c m
.
��m n
message
��n u
}
��v w
;
��w x
ViewBag
�� 
.
�� 
dynamicMessage
�� *
=
��+ ,
dynamicMessage
��- ;
;
��; <
return
�� 
View
�� 
(
��  
forgotPassword
��  .
)
��. /
;
��/ 0
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
var
�� 
dynamicMessage
�� "
=
��# $
new
��% (
DynamicMessage
��) 7
(
��7 8
)
��8 9
{
��: ;
messageType
��< G
=
��H I
	ERROR_MSG
��J S
,
��S T
message
��U \
=
��] ^
e
��_ `
.
��` a
Message
��a h
}
��i j
;
��j k
ViewBag
�� 
.
�� 
dynamicMessage
�� &
=
��' (
dynamicMessage
��) 7
;
��7 8
return
�� 
View
�� 
(
�� 
forgotPassword
�� *
)
��* +
;
��+ ,
}
�� 
}
�� 	
[
�� 	
HttpGet
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
ResetUserPassword
��) :
(
��: ;
string
��; A
userName
��B J
,
��J K
string
��L R
token
��S X
)
��X Y
{
�� 	
if
�� 
(
�� 
userName
�� 
==
�� 
null
��  
||
��! #
token
��$ )
==
��* ,
null
��- 1
)
��1 2
{
�� 
var
�� 
somethingWrongMSG
�� %
=
��& '
await
��( -$
_dynamicMessageService
��. D
.
��D E
Get
��E H
(
��H I
SOMTHING_WRONG
��I W
)
��W X
;
��X Y
return
�� 
View
�� 
(
�� 
$str
�� #
,
��# $
new
��% (
ErrorViewModel
��) 7
(
��7 8
)
��8 9
{
��: ;
Error
��< A
=
��B C
new
��D G
ErrorMessage
��H T
(
��T U
)
��U V
{
��W X
Error
��Y ^
=
��_ `
somethingWrongMSG
��a r
.
��r s
message
��s z
}
��{ |
}
��} ~
)
��~ 
;�� �
}
�� 
try
�� 
{
�� 
var
�� "
usernameWithoutSpace
�� (
=
��) *
userName
��+ 3
.
��3 4
Replace
��4 ;
(
��; <
$str
��< ?
,
��? @
$str
��A D
)
��D E
;
��E F
var
�� 
decryptedUserName
�� %
=
��& '
CryptoJs
��( 0
.
��0 1
DecryptStringAES
��1 A
(
��A B"
usernameWithoutSpace
��B V
)
��V W
;
��W X
var
�� 
userNameArray
�� !
=
��" #
decryptedUserName
��$ 5
.
��5 6
Split
��6 ;
(
��; <
$str
��< ?
)
��? @
;
��@ A
if
�� 
(
�� 
userNameArray
�� !
.
��! "
Length
��" (
>
��) *
$num
��+ ,
)
��, -
{
�� 
userName
�� 
=
�� 
userNameArray
�� ,
[
��, -
$num
��- .
]
��. /
;
��/ 0
}
�� 
var
�� 
user
�� 
=
�� 
await
��  
_userManager
��! -
.
��- .
FindByNameAsync
��. =
(
��= >
userName
��> F
)
��F G
;
��G H
var
��  
resetPasswordToken
�� &
=
��' (
token
��) .
.
��. /
Replace
��/ 6
(
��6 7
$str
��7 :
,
��: ;
$str
��< ?
)
��? @
;
��@ A
var
�� 
deCreptedToken
�� "
=
��# $
CryptoJs
��% -
.
��- .
DecryptStringAES
��. >
(
��> ? 
resetPasswordToken
��? Q
)
��Q R
;
��R S
var
�� 
isValidToken
��  
=
��! "
await
��# (
_userManager
��) 5
.
��5 6"
VerifyUserTokenAsync
��6 J
(
��J K
user
��K O
,
��O P
TokenOptions
��Q ]
.
��] ^
DefaultProvider
��^ m
,
��m n
UserManager
��o z
<
��z {
ApplicationUser��{ �
>��� �
.��� �)
ResetPasswordTokenPurpose��� �
,��� �
deCreptedToken��� �
)��� �
;��� �
if
�� 
(
�� 
!
�� 
isValidToken
�� !
)
��! "
{
�� 
var
�� 
linkExpiredMSG
�� &
=
��' (
await
��) .$
_dynamicMessageService
��/ E
.
��E F
Get
��F I
(
��I J)
PASSWORD_RESET_LINK_EXPIRED
��J e
)
��e f
;
��f g
return
�� 
View
�� 
(
��  
$str
��  '
,
��' (
new
��) ,
ErrorViewModel
��- ;
(
��; <
)
��< =
{
��> ?
Error
��@ E
=
��F G
new
��H K
ErrorMessage
��L X
(
��X Y
)
��Y Z
{
��[ \
Error
��] b
=
��c d
linkExpiredMSG
��e s
.
��s t
message
��t {
}
��| }
}
��~ 
)�� �
;��� �
}
�� !
ResetUserPasswordVM
�� #!
resetUserPasswordVM
��$ 7
=
��8 9
new
��: =!
ResetUserPasswordVM
��> Q
(
��Q R
)
��R S
{
�� 
User
�� 
=
�� 
userName
�� #
,
��# $
	UserToken
�� 
=
�� 
deCreptedToken
��  .
}
�� 
;
�� 
return
�� 
View
�� 
(
�� !
resetUserPasswordVM
�� /
)
��/ 0
;
��0 1
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
View
�� 
(
�� 
$str
�� #
,
��# $
new
��% (
ErrorViewModel
��) 7
(
��7 8
)
��8 9
{
��: ;
Error
��< A
=
��B C
new
��D G
ErrorMessage
��H T
(
��T U
)
��U V
{
��W X
Error
��Y ^
=
��_ `
e
��a b
.
��b c
Message
��c j
}
��k l
}
��m n
)
��n o
;
��o p
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
ResetUserPassword
��) :
(
��: ;!
ResetUserPasswordVM
��; N!
resetUserPasswordVM
��O b
)
��b c
{
�� 	
if
�� 
(
�� !
resetUserPasswordVM
�� #
==
��$ &
null
��' +
)
��+ ,
{
�� 
ViewBag
�� 
.
�� 
dynamicMessage
�� &
=
��' (
await
��) .$
_dynamicMessageService
��/ E
.
��E F
Get
��F I
(
��I J
SOMTHING_WRONG
��J X
)
��X Y
;
��Y Z
return
�� 
View
�� 
(
�� !
resetUserPasswordVM
�� /
)
��/ 0
;
��0 1
}
�� 
try
�� 
{
�� 
var
�� 
newPassword
�� 
=
��  !!
resetUserPasswordVM
��" 5
.
��5 6
NewPassword
��6 A
;
��A B
var
�� 
confirmPassword
�� #
=
��$ %!
resetUserPasswordVM
��& 9
.
��9 :
ConfirmPassword
��: I
;
��I J
if
�� 
(
�� 
newPassword
�� 
!=
��  "
confirmPassword
��# 2
)
��2 3
{
�� 
var
�� 
dynamicMessage
�� &
=
��' (
new
��) ,
DynamicMessage
��- ;
(
��; <
)
��< =
{
��> ?
messageType
��@ K
=
��L M
	ERROR_MSG
��N W
,
��W X
message
��Y `
=
��a b$
PASSWORD_DOSENOT_MATCH
��c y
}
��z {
;
��{ |
ViewBag
�� 
.
�� 
dynamicMessage
�� *
=
��+ ,
dynamicMessage
��- ;
;
��; <
return
�� 
View
�� 
(
��  !
resetUserPasswordVM
��  3
)
��3 4
;
��4 5
}
�� 
var
�� 
user
�� 
=
�� 
await
��  
_userManager
��! -
.
��- .
FindByNameAsync
��. =
(
��= >!
resetUserPasswordVM
��> Q
.
��Q R
User
��R V
)
��V W
;
��W X
user
�� 
.
�� 
changePasswordAt
�� %
=
��& '
Helper
��( .
.
��. /
GetDateTime
��/ :
(
��: ;
)
��; <
;
��< =
var
�� 

resultTest
�� 
=
��  
await
��! &
_userManager
��' 3
.
��3 4 
ResetPasswordAsync
��4 F
(
��F G
user
��G K
,
��K L!
resetUserPasswordVM
��M `
.
��` a
	UserToken
��a j
,
��j k!
resetUserPasswordVM
��l 
.�� �
NewPassword��� �
)��� �
;��� �
if
�� 
(
�� 
!
�� 

resultTest
�� 
.
��  
	Succeeded
��  )
)
��) *
{
�� 
return
�� 
View
�� 
(
��  
$str
��  '
,
��' (
new
��) ,
ErrorViewModel
��- ;
(
��; <
)
��< =
{
��> ?
Error
��@ E
=
��F G
new
��H K
ErrorMessage
��L X
(
��X Y
)
��Y Z
{
��[ \
Error
��] b
=
��c d

resultTest
��e o
.
��o p
Errors
��p v
.
��v w
FirstOrDefault��w �
(��� �
)��� �
.��� �
Code��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
return
�� 
Redirect
�� 
(
��  
	_pageURLs
��  )
.
��) *
UIURL
��* /
)
��/ 0
;
��0 1
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
View
�� 
(
�� 
$str
�� #
,
��# $
new
��% (
ErrorViewModel
��) 7
(
��7 8
)
��8 9
{
��: ;
Error
��< A
=
��B C
new
��D G
ErrorMessage
��H T
(
��T U
)
��U V
{
��W X
Error
��Y ^
=
��_ `
$str
��a k
+
��l m
e
��n o
.
��o p
Message
��p w
}
��x y
}
��z {
)
��{ |
;
��| }
}
�� 
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
HttpPost
��	 
]
�� 
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' ( 
UpdateUserPassword
��) ;
(
��; <
[
��< =
FromBody
��= E
]
��E F"
UserPasswordUpdateVM
��G [
model
��\ a
)
��a b
{
�� 	
var
�� 
decrptNewPassword
�� !
=
��" #
CryptoJs
��$ ,
.
��, -
DecryptStringAES
��- =
(
��= >
model
��> C
.
��C D
NewPassword
��D O
)
��O P
;
��P Q
var
�� &
decrptConfirmNewPassword
�� (
=
��) *
CryptoJs
��+ 3
.
��3 4
DecryptStringAES
��4 D
(
��D E
model
��E J
.
��J K 
ConfirmNewPassword
��K ]
)
��] ^
;
��^ _
var
�� 
decrptuserId
�� 
=
�� 
CryptoJs
�� '
.
��' (
DecryptStringAES
��( 8
(
��8 9
model
��9 >
.
��> ?
userId
��? E
)
��E F
;
��F G
var
�� 
decrptOldPassword
�� !
=
��" #
$str
��$ &
;
��& '
if
�� 
(
�� 
!
�� 
model
�� 
.
�� 
OldPassword
�� "
.
��" #
IsNullOrEmpty
��# 0
(
��0 1
)
��1 2
)
��2 3
{
�� 
decrptOldPassword
�� !
=
��" #
CryptoJs
��$ ,
.
��, -
DecryptStringAES
��- =
(
��= >
model
��> C
.
��C D
OldPassword
��D O
)
��O P
;
��P Q
}
�� 
try
�� 
{
�� 
if
�� 
(
�� 
decrptNewPassword
�� %
!=
��& (&
decrptConfirmNewPassword
��) A
)
��A B
{
�� 
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
message��� �
=��� �&
PASSWORD_DOSENOT_MATCH��� �
}��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
var
�� 
user
�� 
=
�� 
await
�� $
_userManager
��% 1
.
��1 2
FindByIdAsync
��2 ?
(
��? @
decrptuserId
��@ L
)
��L M
;
��M N
if
�� 
(
�� 
!
�� 
decrptOldPassword
�� *
.
��* +
IsNullOrEmpty
��+ 8
(
��8 9
)
��9 :
)
��: ;
{
�� 
var
�� 
authenticateUser
�� ,
=
��- .
await
��/ 4
_signInManager
��5 C
.
��C D
UserManager
��D O
.
��O P 
CheckPasswordAsync
��P b
(
��b c
user
��c g
,
��g h
decrptOldPassword
��i z
)
��z {
;
��{ |
if
�� 
(
�� 
!
�� 
authenticateUser
�� -
)
��- .
{
�� 
var
�� 
somethingWrongMSG
��  1
=
��2 3
await
��4 9$
_dynamicMessageService
��: P
.
��P Q
Get
��Q T
(
��T U
SOMTHING_WRONG
��U c
)
��c d
;
��d e
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
ERROR
��X ]
,
��] ^
APIState
��_ g
.
��g h
FAILED
��h n
,
��n o
null
��p t
,
��t u
new
��v y
UserMessage��z �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
user
�� 
.
�� 
changePasswordAt
�� )
=
��* +
Helper
��, 2
.
��2 3
GetDateTime
��3 >
(
��> ?
)
��? @
;
��@ A
var
�� 
token
�� 
=
�� 
await
��  %
_userManager
��& 2
.
��2 3-
GeneratePasswordResetTokenAsync
��3 R
(
��R S
user
��S W
)
��W X
;
��X Y
var
�� 

resultTest
�� "
=
��# $
await
��% *
_userManager
��+ 7
.
��7 8 
ResetPasswordAsync
��8 J
(
��J K
user
��K O
,
��O P
token
��Q V
,
��V W
decrptNewPassword
��X i
)
��i j
;
��j k
if
�� 
(
�� 
!
�� 

resultTest
�� #
.
��# $
	Succeeded
��$ -
)
��- .
{
�� 
var
�� 
somethingWrongMSG
�� -
=
��. /
await
��0 5$
_dynamicMessageService
��6 L
.
��L M
Get
��M P
(
��P Q
SOMTHING_WRONG
��Q _
)
��_ `
;
��` a
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
var
�� !
passwwordUpdatedMSG
�� +
=
��, -
await
��. 3$
_dynamicMessageService
��4 J
.
��J K
Get
��K N
(
��N O)
EMPLOYEE_CREDENTIAL_UPDATED
��O j
)
��j k
;
��k l
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
null
��k o
,
��o p
new
��q t
UserMessage��u �
(��� �
)��� �
{��� �
message��� �
=��� �#
passwwordUpdatedMSG��� �
.��� �
message��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
HttpPost
��	 
]
�� 
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (%
UpdateOtherUserPassword
��) @
(
��@ A
[
��A B
FromBody
��B J
]
��J K'
OtherUserPasswordUpdateVM
��L e
model
��f k
)
��k l
{
�� 	
var
�� 
decrptNewPassword
�� !
=
��" #
CryptoJs
��$ ,
.
��, -
DecryptStringAES
��- =
(
��= >
model
��> C
.
��C D
NewPassword
��D O
)
��O P
;
��P Q
var
�� &
decrptConfirmNewPassword
�� (
=
��) *
CryptoJs
��+ 3
.
��3 4
DecryptStringAES
��4 D
(
��D E
model
��E J
.
��J K 
ConfirmNewPassword
��K ]
)
��] ^
;
��^ _
var
�� 
decrptuserId
�� 
=
�� 
CryptoJs
�� '
.
��' (
DecryptStringAES
��( 8
(
��8 9
model
��9 >
.
��> ?
userId
��? E
)
��E F
;
��F G
try
�� 
{
�� 
if
�� 
(
�� 
decrptNewPassword
�� %
!=
��& (&
decrptConfirmNewPassword
��) A
)
��A B
{
�� 
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
message��� �
=��� �&
PASSWORD_DOSENOT_MATCH��� �
}��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
var
�� 
user
�� 
=
�� 
await
�� $
_userManager
��% 1
.
��1 2
FindByIdAsync
��2 ?
(
��? @
decrptuserId
��@ L
)
��L M
;
��M N
user
�� 
.
�� 
changePasswordAt
�� )
=
��* +
Helper
��, 2
.
��2 3
GetDateTime
��3 >
(
��> ?
)
��? @
;
��@ A
var
�� 
token
�� 
=
�� 
await
��  %
_userManager
��& 2
.
��2 3-
GeneratePasswordResetTokenAsync
��3 R
(
��R S
user
��S W
)
��W X
;
��X Y
var
�� 

resultTest
�� "
=
��# $
await
��% *
_userManager
��+ 7
.
��7 8 
ResetPasswordAsync
��8 J
(
��J K
user
��K O
,
��O P
token
��Q V
,
��V W
decrptNewPassword
��X i
)
��i j
;
��j k
if
�� 
(
�� 
!
�� 

resultTest
�� #
.
��# $
	Succeeded
��$ -
)
��- .
{
�� 
var
�� 
somethingWrongMSG
�� -
=
��. /
await
��0 5$
_dynamicMessageService
��6 L
.
��L M
Get
��M P
(
��P Q
SOMTHING_WRONG
��Q _
)
��_ `
;
��` a
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
var
�� !
passwwordUpdatedMSG
�� +
=
��, -
await
��. 3$
_dynamicMessageService
��4 J
.
��J K
Get
��K N
(
��N O)
EMPLOYEE_CREDENTIAL_UPDATED
��O j
)
��j k
;
��k l
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
null
��k o
,
��o p
new
��q t
UserMessage��u �
(��� �
)��� �
{��� �
message��� �
=��� �#
passwwordUpdatedMSG��� �
.��� �
message��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
HttpPost
��	 
]
�� 
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
Register
��) 1
(
��1 2
[
��2 3
FromBody
��3 ;
]
��; <

RegisterVM
��= G
model
��H M
)
��M N
{
�� 	
try
�� 
{
�� 
if
�� 
(
�� 

ModelState
�� 
.
�� 
IsValid
�� &
)
��& '
{
�� 
ApplicationUser
�� #
	existUser
��$ -
=
��. /
null
��0 4
;
��4 5
if
�� 
(
�� 
!
�� 
String
�� 
.
��  
IsNullOrEmpty
��  -
(
��- .
model
��. 3
.
��3 4
Username
��4 <
)
��< =
)
��= >
{
�� 
	existUser
�� !
=
��" #
await
��$ )
_userManager
��* 6
.
��6 7
FindByNameAsync
��7 F
(
��F G
model
��G L
.
��L M
Username
��M U
)
��U V
;
��V W
}
�� 
if
�� 
(
�� 
!
�� 
String
�� 
.
��  
IsNullOrEmpty
��  -
(
��- .
model
��. 3
.
��3 4
Email
��4 9
)
��9 :
&&
��; =
	existUser
��> G
==
��H J
null
��K O
)
��O P
{
�� 
	existUser
�� !
=
��" #
await
��$ )
_userManager
��* 6
.
��6 7
FindByEmailAsync
��7 G
(
��G H
model
��H M
.
��M N
Email
��N S
)
��S T
;
��T U
}
�� 
if
�� 
(
�� 
	existUser
�� !
==
��" $
null
��% )
)
��) *
{
�� 
bool
�� 

existEmail
�� '
=
��( )
false
��* /
;
��/ 0
if
�� 
(
�� 
model
�� !
.
��! "
Email
��" '
!=
��( *
null
��+ /
)
��/ 0
{
�� 

existEmail
�� &
=
��' (
await
��) .
_fjtDBContext
��/ <
.
��< =
ApplicationUsers
��= M
.
��M N
AnyAsync
��N V
(
��V W
x
��W X
=>
��Y [
x
��\ ]
.
��] ^
Email
��^ c
==
��d f
model
��g l
.
��l m
Email
��m r
)
��r s
;
��s t
}
�� 
if
�� 
(
�� 
!
�� 

existEmail
�� '
)
��' (
{
�� 
var
�� 
user
��  $
=
��% &
new
��' *
ApplicationUser
��+ :
{
�� 
UserName
��  (
=
��) *
model
��+ 0
.
��0 1
Username
��1 9
,
��9 :
Email
��  %
=
��& '
model
��( -
.
��- .
Email
��. 3
,
��3 4!
passwordHashUpdated
��  3
=
��4 5
true
��6 :
,
��: ;
}
�� 
;
�� 
var
�� 
result
��  &
=
��' (
await
��) .
_userManager
��/ ;
.
��; <
CreateAsync
��< G
(
��G H
user
��H L
,
��L M
model
��N S
.
��S T
Password
��T \
)
��\ ]
;
��] ^
if
�� 
(
��  
result
��  &
.
��& '
	Succeeded
��' 0
)
��0 1
{
�� 
var
��  # 
objApplicationUser
��$ 6
=
��7 8
await
��9 >
_fjtDBContext
��? L
.
��L M
ApplicationUsers
��M ]
.
��] ^!
FirstOrDefaultAsync
��^ q
(
��q r
x
��r s
=>
��t v
x
��w x
.
��x y
UserName��y �
==��� �
model��� �
.��� �
Username��� �
)��� �
;��� �
var
��  #"
userIdentityServerID
��$ 8
=
��9 : 
objApplicationUser
��; M
.
��M N
Id
��N P
;
��P Q
var
��  #
ClientId
��$ ,
=
��- .
await
��/ 4%
_configurationDbContext
��5 L
.
��L M
Clients
��M T
.
��T U
Where
��U Z
(
��Z [
x
��[ \
=>
��] _
x
��` a
.
��a b
ClientId
��b j
==
��k m
ClientConstant
��n |
.
��| }

Q2CClients��} �
.��� �
Q2CUI��� �
.��� �
GetDisplayValue��� �
(��� �
)��� �
&&��� �
x��� �
.��� �
Enabled��� �
==��� �
true��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
ClientId��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �!
ClientUserMappingVM
��  3#
newClientUsersMapping
��4 I
=
��J K
new
��L O!
ClientUserMappingVM
��P c
(
��c d
)
��d e
{
��  !
ClientId
��$ ,
=
��- .
ClientId
��/ 7
,
��7 8
UserId
��$ *
=
��+ ,"
userIdentityServerID
��- A
}
��  !
;
��! "
var
��  #
mappingSuccess
��$ 2
=
��3 4
await
��5 :
_iUserRepository
��; K
.
��K L
AddClientUserMap
��L \
(
��\ ]#
newClientUsersMapping
��] r
)
��r s
;
��s t
var
��  #
	encryptId
��$ -
=
��. /
CryptoJs
��0 8
.
��8 9
Encrypt
��9 @
(
��@ A"
userIdentityServerID
��A U
)
��U V
;
��V W
var
��  #
resObj
��$ *
=
��+ ,
new
��- 0
{
��1 2
userID
��3 9
=
��: ;
	encryptId
��< E
}
��F G
;
��G H
var
��  #

createdMSG
��$ .
=
��/ 0
await
��1 6$
_dynamicMessageService
��7 M
.
��M N
Get
��N Q
(
��Q R
CREATED
��R Y
)
��Y Z
;
��Z [
return
��  &'
_iHttpsResponseRepository
��' @
.
��@ A
ReturnResult
��A M
(
��M N
APIStatusCode
��N [
.
��[ \
SUCCESS
��\ c
,
��c d
APIState
��e m
.
��m n
SUCCESS
��n u
,
��u v
resObj
��w }
,
��} ~
new�� �
UserMessage��� �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �

createdMSG��� �
.��� �
message��� �
,��� �
USER_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
else
��  
{
�� 
var
��  #
resMSG
��$ *
=
��+ ,
await
��- 2$
_dynamicMessageService
��3 I
.
��I J
Get
��J M
(
��M N
INVALID_PARAMETER
��N _
)
��_ `
;
��` a
return
��  &'
_iHttpsResponseRepository
��' @
.
��@ A
ReturnResult
��A M
(
��M N
APIStatusCode
��N [
.
��[ \
ERROR
��\ a
,
��a b
APIState
��c k
.
��k l
FAILED
��l r
,
��r s
null
��t x
,
��x y
new
��z }
UserMessage��~ �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
resMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
resMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
resMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
var
�� 
	existsMSG
�� %
=
��& '
await
��( -$
_dynamicMessageService
��. D
.
��D E
Get
��E H
(
��H I
ALREADY_EXISTS
��I W
)
��W X
;
��X Y
return
�� '
_iHttpsResponseRepository
�� 8
.
��8 9
ReturnResult
��9 E
(
��E F
APIStatusCode
��F S
.
��S T
ERROR
��T Y
,
��Y Z
APIState
��[ c
.
��c d
FAILED
��d j
,
��j k
null
��l p
,
��p q
new
��r u
UserMessage��v �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
	existsMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
	existsMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
	existsMSG��� �
.��� �
message��� �
,��� �
EMAIL��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
if
�� 
(
�� 
	existUser
�� %
.
��% &
	isDeleted
��& /
)
��/ 0
{
�� 
	existUser
�� %
.
��% &
UserName
��& .
=
��/ 0
model
��1 6
.
��6 7
Username
��7 ?
;
��? @
	existUser
�� %
.
��% &
Email
��& +
=
��, -
model
��. 3
.
��3 4
Email
��4 9
;
��9 :
	existUser
�� %
.
��% &!
passwordHashUpdated
��& 9
=
��: ;
true
��< @
;
��@ A
	existUser
�� %
.
��% &
	isDeleted
��& /
=
��0 1
false
��2 7
;
��7 8
var
�� 
result
��  &
=
��' (
await
��) .
_userManager
��/ ;
.
��; <
UpdateAsync
��< G
(
��G H
	existUser
��H Q
)
��Q R
;
��R S
var
�� 
token
��  %
=
��& '
await
��( -
_userManager
��. :
.
��: ;-
GeneratePasswordResetTokenAsync
��; Z
(
��Z [
	existUser
��[ d
)
��d e
;
��e f
var
�� 

resultTest
��  *
=
��+ ,
await
��- 2
_userManager
��3 ?
.
��? @ 
ResetPasswordAsync
��@ R
(
��R S
	existUser
��S \
,
��\ ]
token
��^ c
,
��c d
model
��e j
.
��j k
Password
��k s
)
��s t
;
��t u
var
�� "
userIdentityServerID
��  4
=
��5 6
	existUser
��7 @
.
��@ A
Id
��A C
;
��C D!
ClientUserMappingVM
�� /#
newClientUsersMapping
��0 E
=
��F G
new
��H K!
ClientUserMappingVM
��L _
(
��_ `
)
��` a
{
�� 
ClientId
��  (
=
��) *
	CLIENT_ID
��+ 4
,
��4 5
UserId
��  &
=
��' ("
userIdentityServerID
��) =
}
�� 
;
�� 
var
�� 
mappingSuccess
��  .
=
��/ 0
await
��1 6
_iUserRepository
��7 G
.
��G H
AddClientUserMap
��H X
(
��X Y#
newClientUsersMapping
��Y n
)
��n o
;
��o p
var
�� 
	encryptId
��  )
=
��* +
CryptoJs
��, 4
.
��4 5
Encrypt
��5 <
(
��< ="
userIdentityServerID
��= Q
)
��Q R
;
��R S
var
�� 
resObj
��  &
=
��' (
new
��) ,
{
��- .
userID
��/ 5
=
��6 7
	encryptId
��8 A
}
��B C
;
��C D
var
�� 
userResoteMSG
��  -
=
��. /
await
��0 5$
_dynamicMessageService
��6 L
.
��L M
Get
��M P
(
��P Q!
FILE_FOLDER_RESTORE
��Q d
)
��d e
;
��e f
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
SUCCESS
��X _
,
��_ `
APIState
��a i
.
��i j
SUCCESS
��j q
,
��q r
resObj
��s y
,
��y z
new
��{ ~
UserMessage�� �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
userResoteMSG��� �
.��� �
message��� �
,��� �
USER_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
var
�� 
	existsMSG
��  )
=
��* +
await
��, 1$
_dynamicMessageService
��2 H
.
��H I
Get
��I L
(
��L M
ALREADY_EXISTS
��M [
)
��[ \
;
��\ ]
return
�� "'
_iHttpsResponseRepository
��# <
.
��< =
ReturnResult
��= I
(
��I J
APIStatusCode
��J W
.
��W X
ERROR
��X ]
,
��] ^
APIState
��_ g
.
��g h
FAILED
��h n
,
��n o
null
��p t
,
��t u
new
��v y
UserMessage��z �
(��� �
)��� �
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
	existsMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
	existsMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
	existsMSG��� �
.��� �
message��� �
,��� �
	existUser��� �
.��� �
UserName��� �
==��� �
model��� �
.��� �
Username��� �
?��� �
	USER_NAME��� �
:��� �
EMAIL��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
}
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
HttpPost
��	 
]
�� 
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (

UpdateUser
��) 3
(
��3 4
[
��4 5
FromBody
��5 =
]
��= >

RegisterVM
��? I
model
��J O
)
��O P
{
�� 	
if
�� 
(
�� 
model
�� 
==
�� 
null
�� 
)
�� 
{
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
null
��j n
)
��n o
;
��o p
}
�� 
try
�� 
{
�� 
var
�� 
user
�� 
=
�� 
await
��  
_userManager
��! -
.
��- .
Users
��. 3
.
��3 4
Where
��4 9
(
��9 :
x
��: ;
=>
��< >
x
��? @
.
��@ A
UserName
��A I
==
��J L
model
��M R
.
��R S
Username
��S [
&&
��\ ^
x
��_ `
.
��` a
	isDeleted
��a j
==
��k m
false
��n s
)
��s t
.
��t u"
FirstOrDefaultAsync��u �
(��� �
)��� �
;��� �
var
�� 
token
�� 
=
�� 
await
�� !
_userManager
��" .
.
��. /+
GenerateChangeEmailTokenAsync
��/ L
(
��L M
user
��M Q
,
��Q R
model
��S X
.
��X Y
Email
��Y ^
)
��^ _
;
��_ `
var
�� 
result
�� 
=
�� 
await
�� "
_userManager
��# /
.
��/ 0
ChangeEmailAsync
��0 @
(
��@ A
user
��A E
,
��E F
model
��G L
.
��L M
Email
��M R
,
��R S
token
��T Y
)
��Y Z
;
��Z [
if
�� 
(
�� 
result
�� 
.
�� 
	Succeeded
�� $
)
��$ %
{
�� 
var
�� 

updatedMSG
�� "
=
��# $
await
��% *$
_dynamicMessageService
��+ A
.
��A B
Get
��B E
(
��E F
UPDATED
��F M
)
��M N
;
��N O
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
null
��k o
,
��o p
new
��q t
UserMessage��u �
(��� �
)��� �
{��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �

updatedMSG��� �
.��� �
message��� �
,��� �
USER_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
var
�� 
somethingWrongMSG
�� %
=
��& '
await
��( -$
_dynamicMessageService
��. D
.
��D E
Get
��E H
(
��H I
SOMTHING_WRONG
��I W
)
��W X
;
��X Y
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
HttpPost
��	 
]
�� 
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (

RemoveUser
��) 3
(
��3 4
[
��4 5
FromBody
��5 =
]
��= >
RemoveUserVM
��? K
model
��L Q
)
��Q R
{
�� 	
try
�� 
{
�� 
if
�� 
(
�� 
!
�� 

ModelState
�� 
.
��  
IsValid
��  '
)
��' (
{
�� 
var
�� !
invalidParameterMSG
�� +
=
��, -
await
��. 3$
_dynamicMessageService
��4 J
.
��J K
Get
��K N
(
��N O
INVALID_PARAMETER
��O `
)
��` a
;
��a b
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
var
�� 
result
�� 
=
�� 
await
�� "
_iUserRepository
��# 3
.
��3 4

RemoveUser
��4 >
(
��> ?
model
��? D
.
��D E
UserIds
��E L
)
��L M
;
��M N
if
�� 
(
�� 
!
�� 
result
�� 
)
�� 
{
�� 
var
�� 
somethingWrongMSG
�� )
=
��* +
await
��, 1$
_dynamicMessageService
��2 H
.
��H I
Get
��I L
(
��L M
SOMTHING_WRONG
��M [
)
��[ \
;
��\ ]
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
var
�� 

deletedMSG
�� 
=
��  
await
��! &$
_dynamicMessageService
��' =
.
��= >
Get
��> A
(
��A B
DELETED
��B I
)
��I J
;
��J K
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
null
��g k
,
��k l
new
��m p
UserMessage
��q |
(
��| }
)
��} ~
{�� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �

deletedMSG��� �
.��� �
message��� �
,��� �
USER_ENTITY��� �
)��� �
}��� �
)��� �
;��� �
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
public
�� 
async
�� 
Task
�� 
<
�� 

ResponseVM
�� $
>
��$ %
SendMailTemplate
��& 6
(
��6 7
MailTemplateVM
��7 E
mailTemplateVM
��F T
)
��T U
{
�� 	
try
�� 
{
�� 
	Agreement
�� 
	agreement
�� #
=
��$ %
await
��& +
_fjtDBContext
��, 9
.
��9 :
	Agreement
��: C
.
��C D
Where
��D I
(
��I J
x
��J K
=>
��L N
x
��O P
.
��P Q
agreementTypeID
��Q `
==
��a c
mailTemplateVM
��d r
.
��r s
AgreementTypeID��s �
&&��� �
x��� �
.��� �
isPublished��� �
==��� �
true��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �!
OrderByDescending��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
version��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
if
�� 
(
�� 
	agreement
�� 
==
��  
null
��! %
)
��% &
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� 
new
�� 

ResponseVM
�� )
(
��) *
)
��* +
{
��, -
status
��. 4
=
��5 6
State
��7 <
.
��< =
FAILED
��= C
.
��C D
ToString
��D L
(
��L M
)
��M N
,
��N O
message
��P W
=
��X Y
string
��Z `
.
��` a
Format
��a g
(
��g h
notFoundMSG
��h s
.
��s t
message
��t {
,
��{ |
AGREEMENT_ENTITY��} �
)��� �
}��� �
;��� �
}
�� 
var
�� 
companyLogo
�� 
=
��  !
await
��" '
_fjtDBContext
��( 5
.
��5 6!
Systemconfigrations
��6 I
.
��I J
Where
��J O
(
��O P
x
��P Q
=>
��R T
x
��U V
.
��V W
key
��W Z
==
��[ ]
COMPANY_LOGO_KEY
��^ n
)
��n o
.
��o p
Select
��p v
(
��v w
x
��w x
=>
��y {
x
��| }
.
��} ~
values��~ �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
var
�� 
mailBody
�� 
=
�� 
	agreement
�� (
.
��( )
agreementContent
��) 9
.
��9 :
Replace
��: A
(
��A B.
 SYSTEM_VARIABLE_USERNAME_HTMLTAG
��B b
,
��b c
mailTemplateVM
��d r
.
��r s
UserName
��s {
)
��{ |
.
�� 
Replace
�� 
(
�� 1
#SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG
�� @
,
��@ A
COMPANY_NAME
��B N
)
��N O
.
�� 
Replace
�� 
(
�� -
SYSTEM_VARIABLE_LINKURL_HTMLTAG
�� <
,
��< =
mailTemplateVM
��> L
.
��L M
LinkURL
��M T
)
��T U
.
�� 
Replace
�� 
(
�� 1
#SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG
�� @
,
��@ A
companyLogo
��B M
)
��M N
.
�� 
Replace
�� 
(
�� 2
$SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG
�� A
,
��A B
mailTemplateVM
��C Q
.
��Q R
AssemblyName
��R ^
)
��^ _
.
�� 
Replace
�� 
(
�� 9
+SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG
�� H
,
��H I
mailTemplateVM
��J X
.
��X Y!
CustomerCompanyName
��Y l
)
��l m
;
��m n
var
�� 
mailSubject
�� 
=
��  !
	agreement
��" +
.
��+ ,
agreementSubject
��, <
.
��< =
Replace
��= D
(
��D E.
 SYSTEM_VARIABLE_USERNAME_HTMLTAG
��E e
,
��e f
mailTemplateVM
��g u
.
��u v
UserName
��v ~
)
��~ 
.
�� 
Replace
�� 
(
�� 1
#SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG
�� @
,
��@ A
COMPANY_NAME
��B N
)
��N O
.
�� 
Replace
�� 
(
�� -
SYSTEM_VARIABLE_LINKURL_HTMLTAG
�� <
,
��< =
mailTemplateVM
��> L
.
��L M
LinkURL
��M T
)
��T U
.
�� 
Replace
�� 
(
�� 1
#SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG
�� @
,
��@ A
companyLogo
��B M
)
��M N
.
�� 
Replace
�� 
(
�� 2
$SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG
�� A
,
��A B
mailTemplateVM
��C Q
.
��Q R
AssemblyName
��R ^
)
��^ _
.
�� 
Replace
�� 
(
�� 9
+SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG
�� H
,
��H I
mailTemplateVM
��J X
.
��X Y!
CustomerCompanyName
��Y l
)
��l m
;
��m n
foreach
�� 
(
�� 
var
�� 
email
�� "
in
��# %
mailTemplateVM
��& 4
.
��4 5!
ToSendEmailsAddress
��5 H
)
��H I
{
�� 
SendEmailModel
�� "

emailModel
��# -
=
��. /
new
��0 3
SendEmailModel
��4 B
(
��B C
)
��C D
{
�� 
To
�� 
=
�� 
email
�� "
,
��" #
Subject
�� 
=
��  !
mailSubject
��" -
,
��- .
Body
�� 
=
�� 
mailBody
�� '
,
��' (
CC
�� 
=
�� 
mailTemplateVM
�� +
.
��+ ,
CC
��, .
,
��. /
BCC
�� 
=
�� 
mailTemplateVM
�� ,
.
��, -
BCC
��- 0
}
�� 
;
�� 
_emailService
�� !
.
��! "
	SendEmail
��" +
(
��+ ,

emailModel
��, 6
)
��6 7
;
��7 8
}
�� 
return
�� 
new
�� 

ResponseVM
�� %
(
��% &
)
��& '
{
��( )
status
��* 0
=
��1 2
State
��3 8
.
��8 9
SUCCESS
��9 @
.
��@ A
ToString
��A I
(
��I J
)
��J K
}
��L M
;
��M N
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
new
�� 

ResponseVM
�� %
(
��% &
)
��& '
{
��( )
status
��* 0
=
��1 2
State
��3 8
.
��8 9
FAILED
��9 ?
.
��? @
ToString
��@ H
(
��H I
)
��I J
,
��J K
message
��L S
=
��T U
e
��V W
.
��W X
Message
��X _
}
��` a
;
��a b
}
�� 
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� 
LoginViewModel
�� )
>
��) *&
BuildLoginViewModelAsync
��+ C
(
��C D
string
��D J
	returnUrl
��K T
)
��T U
{
�� 	
var
�� 
context
�� 
=
�� 
await
�� 
_interaction
��  ,
.
��, -*
GetAuthorizationContextAsync
��- I
(
��I J
	returnUrl
��J S
)
��S T
;
��T U
if
�� 
(
�� 
context
�� 
?
�� 
.
�� 
IdP
�� 
!=
�� 
null
��  $
)
��$ %
{
�� 
return
�� 
new
�� 
LoginViewModel
�� )
{
�� 
EnableLocalLogin
�� $
=
��% &
false
��' ,
,
��, -
	ReturnUrl
�� 
=
�� 
	returnUrl
��  )
,
��) *
Username
�� 
=
�� 
context
�� &
?
��& '
.
��' (
	LoginHint
��( 1
,
��1 2
ExternalProviders
�� %
=
��& '
new
��( +
ExternalProvider
��, <
[
��< =
]
��= >
{
��? @
new
��A D
ExternalProvider
��E U
{
��V W"
AuthenticationScheme
��X l
=
��m n
context
��o v
.
��v w
IdP
��w z
}
��{ |
}
��} ~
}
�� 
;
�� 
}
�� 
var
�� 
schemes
�� 
=
�� 
await
�� 
_schemeProvider
��  /
.
��/ 0 
GetAllSchemesAsync
��0 B
(
��B C
)
��C D
;
��D E
var
�� 
	providers
�� 
=
�� 
schemes
�� #
.
�� 
Where
�� 
(
�� 
x
�� 
=>
�� 
x
�� 
.
�� 
DisplayName
�� )
!=
��* ,
null
��- 1
||
��2 4
(
�� 
x
�� 
.
�� 
Name
�� #
.
��# $
Equals
��$ *
(
��* +
AccountOptions
��+ 9
.
��9 :-
WindowsAuthenticationSchemeName
��: Y
,
��Y Z
StringComparison
��[ k
.
��k l
OrdinalIgnoreCase
��l }
)
��} ~
)
��~ 
)
�� 
.
�� 
Select
�� 
(
�� 
x
�� 
=>
�� 
new
��  
ExternalProvider
��! 1
{
�� 
DisplayName
�� 
=
��  !
x
��" #
.
��# $
DisplayName
��$ /
,
��/ 0"
AuthenticationScheme
�� (
=
��) *
x
��+ ,
.
��, -
Name
��- 1
}
�� 
)
�� 
.
�� 
ToList
�� 
(
�� 
)
�� 
;
�� 
var
�� 

allowLocal
�� 
=
�� 
true
�� !
;
��! "
if
�� 
(
�� 
context
�� 
?
�� 
.
�� 
Client
�� 
.
��  
ClientId
��  (
!=
��) +
null
��, 0
)
��0 1
{
�� 
var
�� 
client
�� 
=
�� 
await
�� "
_clientStore
��# /
.
��/ 0(
FindEnabledClientByIdAsync
��0 J
(
��J K
context
��K R
.
��R S
Client
��S Y
.
��Y Z
ClientId
��Z b
)
��b c
;
��c d
if
�� 
(
�� 
client
�� 
!=
�� 
null
�� "
)
��" #
{
�� 

allowLocal
�� 
=
��  
client
��! '
.
��' (
EnableLocalLogin
��( 8
;
��8 9
if
�� 
(
�� 
client
�� 
.
�� *
IdentityProviderRestrictions
�� ;
!=
��< >
null
��? C
&&
��D F
client
��G M
.
��M N*
IdentityProviderRestrictions
��N j
.
��j k
Any
��k n
(
��n o
)
��o p
)
��p q
{
�� 
	providers
�� !
=
��" #
	providers
��$ -
.
��- .
Where
��. 3
(
��3 4
provider
��4 <
=>
��= ?
client
��@ F
.
��F G*
IdentityProviderRestrictions
��G c
.
��c d
Contains
��d l
(
��l m
provider
��m u
.
��u v#
AuthenticationScheme��v �
)��� �
)��� �
.��� �
ToList��� �
(��� �
)��� �
;��� �
}
�� 
}
�� 
}
�� 
return
�� 
new
�� 
LoginViewModel
�� %
{
��  
AllowRememberLogin
�� "
=
��# $
AccountOptions
��% 3
.
��3 4 
AllowRememberLogin
��4 F
,
��F G
EnableLocalLogin
��  
=
��! "

allowLocal
��# -
&&
��. 0
AccountOptions
��1 ?
.
��? @
AllowLocalLogin
��@ O
,
��O P
	ReturnUrl
�� 
=
�� 
	returnUrl
�� %
,
��% &
Username
�� 
=
�� 
context
�� "
?
��" #
.
��# $
	LoginHint
��$ -
,
��- .
ExternalProviders
�� !
=
��" #
	providers
��$ -
.
��- .
ToArray
��. 5
(
��5 6
)
��6 7
}
�� 
;
�� 
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� 
LoginViewModel
�� )
>
��) *&
BuildLoginViewModelAsync
��+ C
(
��C D
LoginInputModel
��D S
model
��T Y
)
��Y Z
{
�� 	
var
�� 
vm
�� 
=
�� 
await
�� &
BuildLoginViewModelAsync
�� 3
(
��3 4
model
��4 9
.
��9 :
	ReturnUrl
��: C
)
��C D
;
��D E
vm
�� 
.
�� 
Username
�� 
=
�� 
model
�� 
.
��  
Username
��  (
;
��( )
vm
�� 
.
�� 
RememberLogin
�� 
=
�� 
model
�� $
.
��$ %
RememberLogin
��% 2
;
��2 3
if
�� 
(
�� 
model
�� 
.
�� &
ShowAcceptAgreementPopUp
�� .
)
��. /
{
�� 
vm
�� 
.
�� &
ShowAcceptAgreementPopUp
�� +
=
��, -
model
��. 3
.
��3 4&
ShowAcceptAgreementPopUp
��4 L
;
��L M
vm
�� 
.
�� 
Password
�� 
=
�� 
model
�� #
.
��# $
Password
��$ ,
;
��, -
vm
�� 
.
�� 
Version
�� 
=
�� 
_version
�� %
;
��% &
vm
�� 
.
�� 
AgreementContent
�� #
=
��$ %
_agreementContent
��& 7
;
��7 8
vm
�� 
.
�� 
	Effective
�� 
=
�� 

_effective
�� )
;
��) *
}
�� 
return
�� 
vm
�� 
;
�� 
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� 
LogoutViewModel
�� *
>
��* +'
BuildLogoutViewModelAsync
��, E
(
��E F
string
��F L
logoutId
��M U
)
��U V
{
�� 	
var
�� 
vm
�� 
=
�� 
new
�� 
LogoutViewModel
�� (
{
��) *
LogoutId
��+ 3
=
��4 5
logoutId
��6 >
,
��> ?
ShowLogoutPrompt
��@ P
=
��Q R
AccountOptions
��S a
.
��a b
ShowLogoutPrompt
��b r
}
��s t
;
��t u
if
�� 
(
�� 
User
�� 
?
�� 
.
�� 
Identity
�� 
.
�� 
IsAuthenticated
�� .
!=
��/ 1
true
��2 6
)
��6 7
{
�� 
vm
�� 
.
�� 
ShowLogoutPrompt
�� #
=
��$ %
false
��& +
;
��+ ,
return
�� 
vm
�� 
;
�� 
}
�� 
var
�� 
context
�� 
=
�� 
await
�� 
_interaction
��  ,
.
��, -#
GetLogoutContextAsync
��- B
(
��B C
logoutId
��C K
)
��K L
;
��L M
if
�� 
(
�� 
context
�� 
?
�� 
.
�� 
ShowSignoutPrompt
�� *
==
��+ -
false
��. 3
)
��3 4
{
�� 
vm
�� 
.
�� 
ShowLogoutPrompt
�� #
=
��$ %
false
��& +
;
��+ ,
return
�� 
vm
�� 
;
�� 
}
�� 
return
�� 
vm
�� 
;
�� 
}
�� 	
private
�� 
async
�� 
Task
�� 
<
��  
LoggedOutViewModel
�� -
>
��- .*
BuildLoggedOutViewModelAsync
��/ K
(
��K L
string
��L R
logoutId
��S [
)
��[ \
{
�� 	
var
�� 
logout
�� 
=
�� 
await
�� 
_interaction
�� +
.
��+ ,#
GetLogoutContextAsync
��, A
(
��A B
logoutId
��B J
)
��J K
;
��K L
var
�� 
vm
�� 
=
�� 
new
��  
LoggedOutViewModel
�� +
{
�� +
AutomaticRedirectAfterSignOut
�� -
=
��. /
AccountOptions
��0 >
.
��> ?+
AutomaticRedirectAfterSignOut
��? \
,
��\ ]#
PostLogoutRedirectUri
�� %
=
��& '
logout
��( .
?
��. /
.
��/ 0#
PostLogoutRedirectUri
��0 E
,
��E F

ClientName
�� 
=
�� 
string
�� #
.
��# $
IsNullOrEmpty
��$ 1
(
��1 2
logout
��2 8
?
��8 9
.
��9 :

ClientName
��: D
)
��D E
?
��F G
logout
��H N
?
��N O
.
��O P
ClientId
��P X
:
��Y Z
logout
��[ a
?
��a b
.
��b c

ClientName
��c m
,
��m n
SignOutIframeUrl
��  
=
��! "
logout
��# )
?
��) *
.
��* +
SignOutIFrameUrl
��+ ;
,
��; <
LogoutId
�� 
=
�� 
logoutId
�� #
}
�� 
;
�� 
if
�� 
(
�� 
User
�� 
?
�� 
.
�� 
Identity
�� 
.
�� 
IsAuthenticated
�� .
==
��/ 1
true
��2 6
)
��6 7
{
�� 
var
�� 
idp
�� 
=
�� 
User
�� 
.
�� 
	FindFirst
�� (
(
��( )
JwtClaimTypes
��) 6
.
��6 7
IdentityProvider
��7 G
)
��G H
?
��H I
.
��I J
Value
��J O
;
��O P
if
�� 
(
�� 
idp
�� 
!=
�� 
null
�� 
&&
��  "
idp
��# &
!=
��' )
IdentityServer4
��* 9
.
��9 :%
IdentityServerConstants
��: Q
.
��Q R#
LocalIdentityProvider
��R g
)
��g h
{
�� 
var
�� %
providerSupportsSignout
�� /
=
��0 1
await
��2 7
HttpContext
��8 C
.
��C D+
GetSchemeSupportsSignOutAsync
��D a
(
��a b
idp
��b e
)
��e f
;
��f g
if
�� 
(
�� %
providerSupportsSignout
�� /
)
��/ 0
{
�� 
if
�� 
(
�� 
vm
�� 
.
�� 
LogoutId
�� '
==
��( *
null
��+ /
)
��/ 0
{
�� 
vm
�� 
.
�� 
LogoutId
�� '
=
��( )
await
��* /
_interaction
��0 <
.
��< =&
CreateLogoutContextAsync
��= U
(
��U V
)
��V W
;
��W X
}
�� 
vm
�� 
.
�� *
ExternalAuthenticationScheme
�� 7
=
��8 9
idp
��: =
;
��= >
}
�� 
}
�� 
}
�� 
return
�� 
vm
�� 
;
�� 
}
�� 	
public
�� 
async
�� 
Task
�� 
<
�� 
int
�� 
>
�� +
GetLetestPublishedAgreementId
�� <
(
��< =
int
��= @
agreementTypeID
��A P
)
��P Q
{
�� 	
int
�� (
letestPublishedAgreementId
�� *
=
��+ ,
await
��- 2
_fjtDBContext
��3 @
.
��@ A
	Agreement
��A J
.
��J K
Where
��K P
(
��P Q
x
��Q R
=>
��S U
x
��V W
.
��W X
agreementTypeID
��X g
==
��h j
agreementTypeID
��k z
&&
��{ }
x
��~ 
.�� �
isPublished��� �
==��� �
true��� �
&&��� �
x��� �
.��� �
	isDeleted��� �
==��� �
false��� �
)��� �
.��� �!
OrderByDescending��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
version��� �
)��� �
.��� �
Select��� �
(��� �
x��� �
=>��� �
x��� �
.��� �
agreementID��� �
)��� �
.��� �#
FirstOrDefaultAsync��� �
(��� �
)��� �
;��� �
return
�� (
letestPublishedAgreementId
�� -
;
��- .
}
�� 	
public
�� 
async
�� 
Task
�� 
<
�� 
	Agreement
�� #
>
��# $+
RetrivePublishedAgreementById
��% B
(
��B C
int
��C F
agreementID
��G R
)
��R S
{
�� 	
try
�� 
{
�� 
	Agreement
�� 
	agreement
�� #
=
��$ %
await
��& +
_fjtDBContext
��, 9
.
��9 :
	Agreement
��: C
.
��C D
Where
��D I
(
��I J
x
��J K
=>
��L N
x
��O P
.
��P Q
agreementID
��Q \
==
��] _
agreementID
��` k
)
��k l
.
��l m"
FirstOrDefaultAsync��m �
(��� �
)��� �
;��� �
if
�� 
(
�� 
!
�� 
string
�� 
.
�� 
IsNullOrEmpty
�� )
(
��) *
	agreement
��* 3
.
��3 4
agreementContent
��4 D
)
��D E
)
��E F
{
�� 
	agreement
�� 
.
�� 
agreementContent
�� .
=
��/ 0$
_textAngularValueForDB
��1 G
.
��G H&
GetTextAngularValueForDB
��H `
(
��` a
	agreement
��a j
.
��j k
agreementContent
��k {
)
��{ |
;
��| }
if
�� 
(
�� 
	agreement
�� !
.
��! "
agreementContent
��" 2
==
��3 5
null
��6 :
)
��: ;
{
�� 
return
�� 
new
�� "
	Agreement
��# ,
(
��, -
)
��- .
{
��/ 0
}
��1 2
;
��2 3
}
�� 
}
�� 
if
�� 
(
�� 
!
�� 
string
�� 
.
�� 
IsNullOrEmpty
�� )
(
��) *
	agreement
��* 3
.
��3 4
agreementSubject
��4 D
)
��D E
)
��E F
{
�� 
	agreement
�� 
.
�� 
agreementSubject
�� .
=
��/ 0$
_textAngularValueForDB
��1 G
.
��G H&
GetTextAngularValueForDB
��H `
(
��` a
	agreement
��a j
.
��j k
agreementSubject
��k {
)
��{ |
;
��| }
if
�� 
(
�� 
	agreement
�� !
.
��! "
agreementSubject
��" 2
==
��3 5
null
��6 :
)
��: ;
{
�� 
return
�� 
new
�� "
	Agreement
��# ,
(
��, -
)
��- .
{
��/ 0
}
��1 2
;
��2 3
}
�� 
}
�� 
return
�� 
	agreement
��  
;
��  !
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
new
�� 
	Agreement
�� $
(
��$ %
)
��% &
{
��' (
}
��) *
;
��* +
}
�� 
}
�� 	
[
�� 	
Route
��	 
(
�� 
$str
�� *
)
��* +
]
��+ ,
[
�� 	
	Authorize
��	 
(
�� #
AuthenticationSchemes
�� (
=
��) *
JwtBearerDefaults
��+ <
.
��< ="
AuthenticationScheme
��= Q
)
��Q R
]
��R S
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (
ValidatePassword
��) 9
(
��9 :
[
��: ;
FromBody
��; C
]
��C D.
 RequestUseridPasswordParameterVM
��E e
model
��f k
)
��k l
{
�� 	
if
�� 
(
�� 
model
�� 
==
�� 
null
�� 
)
�� 
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
bool
�� 
isMatchPassword
�� $
=
��% &
false
��' ,
;
��, -
var
�� 
userId
�� 
=
�� 
CryptoJs
�� %
.
��% &
DecryptStringAES
��& 6
(
��6 7
model
��7 <
.
��< =
userId
��= C
)
��C D
;
��D E
var
�� 
password
�� 
=
�� 
CryptoJs
�� '
.
��' (
DecryptStringAES
��( 8
(
��8 9
model
��9 >
.
��> ?
password
��? G
)
��G H
;
��H I
var
�� 
user
�� 
=
�� 
await
��  
_userManager
��! -
.
��- .
FindByIdAsync
��. ;
(
��; <
userId
��< B
)
��B C
;
��C D
var
�� 
result
�� 
=
�� 
await
�� "
_signInManager
��# 1
.
��1 2
UserManager
��2 =
.
��= > 
CheckPasswordAsync
��> P
(
��P Q
user
��Q U
,
��U V
password
��W _
)
��_ `
;
��` a
if
�� 
(
�� 
result
�� 
)
�� 
{
�� 
isMatchPassword
�� #
=
��$ %
true
��& *
;
��* +
}
�� 
CommonResponse
�� 
commonResponse
�� -
=
��. /
new
��0 3
CommonResponse
��4 B
(
��B C
)
��C D
{
�� 
isMatchPassword
�� #
=
��$ %
isMatchPassword
��& 5
}
�� 
;
�� 
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
SUCCESS
��L S
,
��S T
APIState
��U ]
.
��] ^
SUCCESS
��^ e
,
��e f
commonResponse
��g u
,
��u v
null
��w {
)
��{ |
;
��| }
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
}
�� 
}�� �
RD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\AccountOptions.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public		 

class		 
AccountOptions		 
{

 
public 
static 
bool 
AllowLocalLogin *
=+ ,
true- 1
;1 2
public 
static 
bool 
AllowRememberLogin -
=. /
true0 4
;4 5
public 
static 
TimeSpan #
RememberMeLoginDuration 6
=7 8
TimeSpan9 A
.A B
FromDaysB J
(J K
$numK M
)M N
;N O
public 
static 
bool 
ShowLogoutPrompt +
=, -
true. 2
;2 3
public 
static 
bool )
AutomaticRedirectAfterSignOut 8
=9 :
true; ?
;? @
public 
static 
readonly 
string %+
WindowsAuthenticationSchemeName& E
=F G
	MicrosoftH Q
.Q R

AspNetCoreR \
.\ ]
Server] c
.c d
IISIntegrationd r
.r s
IISDefaultss ~
.~ !
AuthenticationScheme	 �
;
� �
public 
static 
bool  
IncludeWindowsGroups /
=0 1
false2 7
;7 8
public 
static 
string *
InvalidCredentialsErrorMessage ;
=< =
$str> \
;\ ]
public 
static 
string )
ClientUserMappingErrorMessage :
=; <
$str= v
;v w
} 
} ��
VD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\ExternalController.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
[ 
SecurityHeaders 
] 
[ 
AllowAnonymous 
] 
public 

class 
ExternalController #
:$ %

Controller& 0
{ 
private 
readonly 
UserManager $
<$ %
ApplicationUser% 4
>4 5
_userManager6 B
;B C
private 
readonly 
SignInManager &
<& '
ApplicationUser' 6
>6 7
_signInManager8 F
;F G
private 
readonly -
!IIdentityServerInteractionService :
_interaction; G
;G H
private 
readonly 
IClientStore %
_clientStore& 2
;2 3
private 
readonly 
IEventService &
_events' .
;. /
public 
ExternalController !
(! "
UserManager 
< 
ApplicationUser '
>' (
userManager) 4
,4 5
SignInManager   
<   
ApplicationUser   )
>  ) *
signInManager  + 8
,  8 9-
!IIdentityServerInteractionService!! -
interaction!!. 9
,!!9 :
IClientStore"" 
clientStore"" $
,""$ %
IEventService## 
events##  
)##  !
{$$ 	
_userManager%% 
=%% 
userManager%% &
;%%& '
_signInManager&& 
=&& 
signInManager&& *
;&&* +
_interaction'' 
='' 
interaction'' &
;''& '
_clientStore(( 
=(( 
clientStore(( &
;((& '
_events)) 
=)) 
events)) 
;)) 
}** 	
[// 	
HttpGet//	 
]// 
public00 
async00 
Task00 
<00 
IActionResult00 '
>00' (
	Challenge00) 2
(002 3
string003 9
provider00: B
,00B C
string00D J
	returnUrl00K T
)00T U
{11 	
if22 
(22 
string22 
.22 
IsNullOrEmpty22 $
(22$ %
	returnUrl22% .
)22. /
)22/ 0
	returnUrl221 :
=22; <
$str22= A
;22A B
if55 
(55 
Url55 
.55 

IsLocalUrl55 
(55 
	returnUrl55 (
)55( )
==55* ,
false55- 2
&&553 5
_interaction556 B
.55B C
IsValidReturnUrl55C S
(55S T
	returnUrl55T ]
)55] ^
==55_ a
false55b g
)55g h
{66 
throw88 
new88 
	Exception88 #
(88# $
$str88$ 8
)888 9
;889 :
}99 
if;; 
(;; 
AccountOptions;; 
.;; +
WindowsAuthenticationSchemeName;; >
==;;? A
provider;;B J
);;J K
{<< 
return>> 
await>> $
ProcessWindowsLoginAsync>> 5
(>>5 6
	returnUrl>>6 ?
)>>? @
;>>@ A
}?? 
else@@ 
{AA 
varCC 
propsCC 
=CC 
newCC $
AuthenticationPropertiesCC  8
{DD 
RedirectUriEE 
=EE  !
UrlEE" %
.EE% &
ActionEE& ,
(EE, -
nameofEE- 3
(EE3 4
CallbackEE4 <
)EE< =
)EE= >
,EE> ?
ItemsFF 
=FF 
{GG 
{HH 
$strHH %
,HH% &
	returnUrlHH' 0
}HH1 2
,HH2 3
{II 
$strII "
,II" #
providerII$ ,
}II- .
,II. /
}JJ 
}KK 
;KK 
returnMM 
	ChallengeMM  
(MM  !
propsMM! &
,MM& '
providerMM( 0
)MM0 1
;MM1 2
}NN 
}OO 	
[TT 	
HttpGetTT	 
]TT 
publicUU 
asyncUU 
TaskUU 
<UU 
IActionResultUU '
>UU' (
CallbackUU) 1
(UU1 2
)UU2 3
{VV 	
varXX 
resultXX 
=XX 
awaitXX 
HttpContextXX *
.XX* +
AuthenticateAsyncXX+ <
(XX< =
IdentityConstantsXX= N
.XXN O
ExternalSchemeXXO ]
)XX] ^
;XX^ _
ifYY 
(YY 
resultYY 
?YY 
.YY 
	SucceededYY !
!=YY" $
trueYY% )
)YY) *
{ZZ 
throw[[ 
new[[ 
	Exception[[ #
([[# $
$str[[$ C
)[[C D
;[[D E
}\\ 
var__ 
(__ 
user__ 
,__ 
provider__ 
,__  
providerUserId__! /
,__/ 0
claims__1 7
)__7 8
=__9 :
await__; @-
!FindUserFromExternalProviderAsync__A b
(__b c
result__c i
)__i j
;__j k
if`` 
(`` 
user`` 
==`` 
null`` 
)`` 
{aa 
useree 
=ee 
awaitee "
AutoProvisionUserAsyncee 3
(ee3 4
provideree4 <
,ee< =
providerUserIdee> L
,eeL M
claimseeN T
)eeT U
;eeU V
}ff 
varkk !
additionalLocalClaimskk %
=kk& '
newkk( +
Listkk, 0
<kk0 1
Claimkk1 6
>kk6 7
(kk7 8
)kk8 9
;kk9 :
varll 
localSignInPropsll  
=ll! "
newll# &$
AuthenticationPropertiesll' ?
(ll? @
)ll@ A
;llA B'
ProcessLoginCallbackForOidcmm '
(mm' (
resultmm( .
,mm. /!
additionalLocalClaimsmm0 E
,mmE F
localSignInPropsmmG W
)mmW X
;mmX Y(
ProcessLoginCallbackForWsFednn (
(nn( )
resultnn) /
,nn/ 0!
additionalLocalClaimsnn1 F
,nnF G
localSignInPropsnnH X
)nnX Y
;nnY Z)
ProcessLoginCallbackForSaml2poo )
(oo) *
resultoo* 0
,oo0 1!
additionalLocalClaimsoo2 G
,ooG H
localSignInPropsooI Y
)ooY Z
;ooZ [
vartt 
	principaltt 
=tt 
awaittt !
_signInManagertt" 0
.tt0 1$
CreateUserPrincipalAsynctt1 I
(ttI J
userttJ N
)ttN O
;ttO P!
additionalLocalClaimsuu !
.uu! "
AddRangeuu" *
(uu* +
	principaluu+ 4
.uu4 5
Claimsuu5 ;
)uu; <
;uu< =
varvv 
namevv 
=vv 
	principalvv  
.vv  !
	FindFirstvv! *
(vv* +
JwtClaimTypesvv+ 8
.vv8 9
Namevv9 =
)vv= >
?vv> ?
.vv? @
Valuevv@ E
??vvF H
uservvI M
.vvM N
IdvvN P
;vvP Q
awaitww 
_eventsww 
.ww 

RaiseAsyncww $
(ww$ %
newww% (!
UserLoginSuccessEventww) >
(ww> ?
providerww? G
,wwG H
providerUserIdwwI W
,wwW X
userwwY ]
.ww] ^
Idww^ `
,ww` a
namewwb f
)wwf g
)wwg h
;wwh i
awaitxx 
HttpContextxx 
.xx 
SignInAsyncxx )
(xx) *
	principalxx* 3
)xx3 4
;xx4 5
await{{ 
HttpContext{{ 
.{{ 
SignOutAsync{{ *
({{* +
IdentityConstants{{+ <
.{{< =
ExternalScheme{{= K
){{K L
;{{L M
var~~ 
	returnUrl~~ 
=~~ 
result~~ "
.~~" #

Properties~~# -
.~~- .
Items~~. 3
[~~3 4
$str~~4 ?
]~~? @
;~~@ A
if 
( 
_interaction 
. 
IsValidReturnUrl -
(- .
	returnUrl. 7
)7 8
||9 ;
Url< ?
.? @

IsLocalUrl@ J
(J K
	returnUrlK T
)T U
)U V
{
�� 
return
�� 
Redirect
�� 
(
��  
	returnUrl
��  )
)
��) *
;
��* +
}
�� 
return
�� 
Redirect
�� 
(
�� 
$str
��  
)
��  !
;
��! "
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� (
>
��( )&
ProcessWindowsLoginAsync
��* B
(
��B C
string
��C I
	returnUrl
��J S
)
��S T
{
�� 	
var
�� 
result
�� 
=
�� 
await
�� 
HttpContext
�� *
.
��* +
AuthenticateAsync
��+ <
(
��< =
AccountOptions
��= K
.
��K L-
WindowsAuthenticationSchemeName
��L k
)
��k l
;
��l m
if
�� 
(
�� 
result
�� 
?
�� 
.
�� 
	Principal
�� !
is
��" $
WindowsPrincipal
��% 5
wp
��6 8
)
��8 9
{
�� 
var
�� 
props
�� 
=
�� 
new
�� &
AuthenticationProperties
��  8
(
��8 9
)
��9 :
{
�� 
RedirectUri
�� 
=
��  !
Url
��" %
.
��% &
Action
��& ,
(
��, -
$str
��- 7
)
��7 8
,
��8 9
Items
�� 
=
�� 
{
�� 
{
�� 
$str
�� %
,
��% &
	returnUrl
��' 0
}
��1 2
,
��2 3
{
�� 
$str
�� "
,
��" #
AccountOptions
��$ 2
.
��2 3-
WindowsAuthenticationSchemeName
��3 R
}
��S T
,
��T U
}
�� 
}
�� 
;
�� 
var
�� 
id
�� 
=
�� 
new
�� 
ClaimsIdentity
�� +
(
��+ ,
AccountOptions
��, :
.
��: ;-
WindowsAuthenticationSchemeName
��; Z
)
��Z [
;
��[ \
id
�� 
.
�� 
AddClaim
�� 
(
�� 
new
�� 
Claim
��  %
(
��% &
JwtClaimTypes
��& 3
.
��3 4
Subject
��4 ;
,
��; <
wp
��= ?
.
��? @
Identity
��@ H
.
��H I
Name
��I M
)
��M N
)
��N O
;
��O P
id
�� 
.
�� 
AddClaim
�� 
(
�� 
new
�� 
Claim
��  %
(
��% &
JwtClaimTypes
��& 3
.
��3 4
Name
��4 8
,
��8 9
wp
��: <
.
��< =
Identity
��= E
.
��E F
Name
��F J
)
��J K
)
��K L
;
��L M
if
�� 
(
�� 
AccountOptions
�� "
.
��" #"
IncludeWindowsGroups
��# 7
)
��7 8
{
�� 
var
�� 
wi
�� 
=
�� 
wp
�� 
.
��  
Identity
��  (
as
��) +
WindowsIdentity
��, ;
;
��; <
var
�� 
groups
�� 
=
��  
wi
��! #
.
��# $
Groups
��$ *
.
��* +
	Translate
��+ 4
(
��4 5
typeof
��5 ;
(
��; <
	NTAccount
��< E
)
��E F
)
��F G
;
��G H
var
�� 
roles
�� 
=
�� 
groups
��  &
.
��& '
Select
��' -
(
��- .
x
��. /
=>
��0 2
new
��3 6
Claim
��7 <
(
��< =
JwtClaimTypes
��= J
.
��J K
Role
��K O
,
��O P
x
��Q R
.
��R S
Value
��S X
)
��X Y
)
��Y Z
;
��Z [
id
�� 
.
�� 
	AddClaims
��  
(
��  !
roles
��! &
)
��& '
;
��' (
}
�� 
await
�� 
HttpContext
�� !
.
��! "
SignInAsync
��" -
(
��- .
IdentityServer4
�� #
.
��# $%
IdentityServerConstants
��$ ;
.
��; <0
"ExternalCookieAuthenticationScheme
��< ^
,
��^ _
new
�� 
ClaimsPrincipal
�� '
(
��' (
id
��( *
)
��* +
,
��+ ,
props
�� 
)
�� 
;
�� 
return
�� 
Redirect
�� 
(
��  
props
��  %
.
��% &
RedirectUri
��& 1
)
��1 2
;
��2 3
}
�� 
else
�� 
{
�� 
return
�� 
	Challenge
��  
(
��  !
AccountOptions
��! /
.
��/ 0-
WindowsAuthenticationSchemeName
��0 O
)
��O P
;
��P Q
}
�� 
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� 
(
�� 
ApplicationUser
�� +
user
��, 0
,
��0 1
string
��2 8
provider
��9 A
,
��A B
string
��C I
providerUserId
��J X
,
��X Y
IEnumerable
��Z e
<
��e f
Claim
��f k
>
��k l
claims
��m s
)
��s t
>
��t u/
!FindUserFromExternalProviderAsync
�� -
(
��- . 
AuthenticateResult
��. @
result
��A G
)
��G H
{
�� 	
var
�� 
externalUser
�� 
=
�� 
result
�� %
.
��% &
	Principal
��& /
;
��/ 0
var
�� 
userIdClaim
�� 
=
�� 
externalUser
�� *
.
��* +
	FindFirst
��+ 4
(
��4 5
JwtClaimTypes
��5 B
.
��B C
Subject
��C J
)
��J K
??
��L N
externalUser
�� *
.
��* +
	FindFirst
��+ 4
(
��4 5

ClaimTypes
��5 ?
.
��? @
NameIdentifier
��@ N
)
��N O
??
��P R
throw
�� #
new
��$ '
	Exception
��( 1
(
��1 2
$str
��2 B
)
��B C
;
��C D
var
�� 
claims
�� 
=
�� 
externalUser
�� %
.
��% &
Claims
��& ,
.
��, -
ToList
��- 3
(
��3 4
)
��4 5
;
��5 6
claims
�� 
.
�� 
Remove
�� 
(
�� 
userIdClaim
�� %
)
��% &
;
��& '
var
�� 
provider
�� 
=
�� 
result
�� !
.
��! "

Properties
��" ,
.
��, -
Items
��- 2
[
��2 3
$str
��3 ;
]
��; <
;
��< =
var
�� 
providerUserId
�� 
=
��  
userIdClaim
��! ,
.
��, -
Value
��- 2
;
��2 3
var
�� 
user
�� 
=
�� 
await
�� 
_userManager
�� )
.
��) *
FindByLoginAsync
��* :
(
��: ;
provider
��; C
,
��C D
providerUserId
��E S
)
��S T
;
��T U
if
�� 
(
�� 
user
�� 
==
�� 
null
�� 
)
�� 
{
�� 
var
�� 
name
�� 
=
�� 
claims
�� !
.
��! "
FirstOrDefault
��" 0
(
��0 1
x
��1 2
=>
��3 5
x
��6 7
.
��7 8
Type
��8 <
==
��= ?
JwtClaimTypes
��@ M
.
��M N
Name
��N R
)
��R S
?
��S T
.
��T U
Value
��U Z
??
��[ ]
claims
��^ d
.
��d e
FirstOrDefault
��e s
(
��s t
x
��t u
=>
��v x
x
��y z
.
��z {
Type
��{ 
==��� �

ClaimTypes��� �
.��� �
Name��� �
)��� �
?��� �
.��� �
Value��� �
;��� �
if
�� 
(
�� 
name
�� 
!=
�� 
null
��  
)
��  !
{
�� 
user
�� 
=
�� 
await
��  
_userManager
��! -
.
��- .
FindByNameAsync
��. =
(
��= >
name
��> B
)
��B C
;
��C D
}
�� 
if
�� 
(
�� 
user
�� 
==
�� 
null
��  
)
��  !
{
�� 
var
�� 
prefname
��  
=
��! "
claims
��# )
.
��) *
FirstOrDefault
��* 8
(
��8 9
x
��9 :
=>
��; =
x
��> ?
.
��? @
Type
��@ D
==
��E G
JwtClaimTypes
��H U
.
��U V
PreferredUserName
��V g
)
��g h
?
��h i
.
��i j
Value
��j o
;
��o p
if
�� 
(
�� 
prefname
��  
!=
��! #
null
��$ (
)
��( )
{
�� 
user
�� 
=
�� 
await
�� $
_userManager
��% 1
.
��1 2
FindByNameAsync
��2 A
(
��A B
prefname
��B J
)
��J K
;
��K L
}
�� 
}
�� 
if
�� 
(
�� 
user
�� 
==
�� 
null
��  
)
��  !
{
�� 
var
�� 
email
�� 
=
�� 
claims
��  &
.
��& '
FirstOrDefault
��' 5
(
��5 6
x
��6 7
=>
��8 :
x
��; <
.
��< =
Type
��= A
==
��B D
JwtClaimTypes
��E R
.
��R S
Email
��S X
)
��X Y
?
��Y Z
.
��Z [
Value
��[ `
??
��a c
claims
��d j
.
��j k
FirstOrDefault
��k y
(
��y z
x
��z {
=>
��| ~
x�� �
.��� �
Type��� �
==��� �

ClaimTypes��� �
.��� �
Email��� �
)��� �
?��� �
.��� �
Value��� �
;��� �
if
�� 
(
�� 
email
�� 
!=
��  
null
��! %
)
��% &
{
�� 
user
�� 
=
�� 
await
�� $
_userManager
��% 1
.
��1 2
FindByEmailAsync
��2 B
(
��B C
email
��C H
)
��H I
;
��I J
}
�� 
}
�� 
if
�� 
(
�� 
user
�� 
!=
�� 
null
��  
)
��  !
{
�� 
var
�� 
identityResult
�� &
=
��' (
await
��) .
_userManager
��/ ;
.
��; <
AddLoginAsync
��< I
(
��I J
user
��J N
,
��N O
new
��P S
UserLoginInfo
��T a
(
��a b
provider
��b j
,
��j k
providerUserId
��l z
,
��z {
provider��| �
)��� �
)��� �
;��� �
if
�� 
(
�� 
!
�� 
identityResult
�� '
.
��' (
	Succeeded
��( 1
)
��1 2
throw
��3 8
new
��9 <
	Exception
��= F
(
��F G
identityResult
��G U
.
��U V
Errors
��V \
.
��\ ]
First
��] b
(
��b c
)
��c d
.
��d e
Description
��e p
)
��p q
;
��q r
}
�� 
}
�� 
return
�� 
(
�� 
user
�� 
,
�� 
provider
�� "
,
��" #
providerUserId
��$ 2
,
��2 3
claims
��4 :
)
��: ;
;
��; <
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� 
ApplicationUser
�� *
>
��* +$
AutoProvisionUserAsync
��, B
(
��B C
string
��C I
provider
��J R
,
��R S
string
��T Z
providerUserId
��[ i
,
��i j
IEnumerable
��k v
<
��v w
Claim
��w |
>
��| }
claims��~ �
)��� �
{
�� 	
var
�� 
filtered
�� 
=
�� 
new
�� 
List
�� #
<
��# $
Claim
��$ )
>
��) *
(
��* +
)
��+ ,
;
��, -
var
�� 
name
�� 
=
�� 
claims
�� 
.
�� 
FirstOrDefault
�� ,
(
��, -
x
��- .
=>
��/ 1
x
��2 3
.
��3 4
Type
��4 8
==
��9 ;
JwtClaimTypes
��< I
.
��I J
Name
��J N
)
��N O
?
��O P
.
��P Q
Value
��Q V
??
��W Y
claims
�� 
.
�� 
FirstOrDefault
�� %
(
��% &
x
��& '
=>
��( *
x
��+ ,
.
��, -
Type
��- 1
==
��2 4

ClaimTypes
��5 ?
.
��? @
Name
��@ D
)
��D E
?
��E F
.
��F G
Value
��G L
;
��L M
if
�� 
(
�� 
name
�� 
!=
�� 
null
�� 
)
�� 
{
�� 
filtered
�� 
.
�� 
Add
�� 
(
�� 
new
��  
Claim
��! &
(
��& '
JwtClaimTypes
��' 4
.
��4 5
Name
��5 9
,
��9 :
name
��; ?
)
��? @
)
��@ A
;
��A B
}
�� 
else
�� 
{
�� 
var
�� 
first
�� 
=
�� 
claims
�� "
.
��" #
FirstOrDefault
��# 1
(
��1 2
x
��2 3
=>
��4 6
x
��7 8
.
��8 9
Type
��9 =
==
��> @
JwtClaimTypes
��A N
.
��N O
	GivenName
��O X
)
��X Y
?
��Y Z
.
��Z [
Value
��[ `
??
��a c
claims
�� 
.
�� 
FirstOrDefault
�� )
(
��) *
x
��* +
=>
��, .
x
��/ 0
.
��0 1
Type
��1 5
==
��6 8

ClaimTypes
��9 C
.
��C D
	GivenName
��D M
)
��M N
?
��N O
.
��O P
Value
��P U
;
��U V
var
�� 
last
�� 
=
�� 
claims
�� !
.
��! "
FirstOrDefault
��" 0
(
��0 1
x
��1 2
=>
��3 5
x
��6 7
.
��7 8
Type
��8 <
==
��= ?
JwtClaimTypes
��@ M
.
��M N

FamilyName
��N X
)
��X Y
?
��Y Z
.
��Z [
Value
��[ `
??
��a c
claims
�� 
.
�� 
FirstOrDefault
�� )
(
��) *
x
��* +
=>
��, .
x
��/ 0
.
��0 1
Type
��1 5
==
��6 8

ClaimTypes
��9 C
.
��C D
Surname
��D K
)
��K L
?
��L M
.
��M N
Value
��N S
;
��S T
if
�� 
(
�� 
first
�� 
!=
�� 
null
�� !
&&
��" $
last
��% )
!=
��* ,
null
��- 1
)
��1 2
{
�� 
filtered
�� 
.
�� 
Add
��  
(
��  !
new
��! $
Claim
��% *
(
��* +
JwtClaimTypes
��+ 8
.
��8 9
Name
��9 =
,
��= >
first
��? D
+
��E F
$str
��G J
+
��K L
last
��M Q
)
��Q R
)
��R S
;
��S T
}
�� 
else
�� 
if
�� 
(
�� 
first
�� 
!=
�� !
null
��" &
)
��& '
{
�� 
filtered
�� 
.
�� 
Add
��  
(
��  !
new
��! $
Claim
��% *
(
��* +
JwtClaimTypes
��+ 8
.
��8 9
Name
��9 =
,
��= >
first
��? D
)
��D E
)
��E F
;
��F G
}
�� 
else
�� 
if
�� 
(
�� 
last
�� 
!=
��  
null
��! %
)
��% &
{
�� 
filtered
�� 
.
�� 
Add
��  
(
��  !
new
��! $
Claim
��% *
(
��* +
JwtClaimTypes
��+ 8
.
��8 9
Name
��9 =
,
��= >
last
��? C
)
��C D
)
��D E
;
��E F
}
�� 
}
�� 
var
�� 
email
�� 
=
�� 
claims
�� 
.
�� 
FirstOrDefault
�� -
(
��- .
x
��. /
=>
��0 2
x
��3 4
.
��4 5
Type
��5 9
==
��: <
JwtClaimTypes
��= J
.
��J K
Email
��K P
)
��P Q
?
��Q R
.
��R S
Value
��S X
??
��Y [
claims
�� 
.
�� 
FirstOrDefault
�� $
(
��$ %
x
��% &
=>
��' )
x
��* +
.
��+ ,
Type
��, 0
==
��1 3

ClaimTypes
��4 >
.
��> ?
Email
��? D
)
��D E
?
��E F
.
��F G
Value
��G L
;
��L M
if
�� 
(
�� 
email
�� 
!=
�� 
null
�� 
)
�� 
{
�� 
filtered
�� 
.
�� 
Add
�� 
(
�� 
new
��  
Claim
��! &
(
��& '
JwtClaimTypes
��' 4
.
��4 5
Email
��5 :
,
��: ;
email
��< A
)
��A B
)
��B C
;
��C D
}
�� 
var
�� 
user
�� 
=
�� 
new
�� 
ApplicationUser
�� *
{
�� 
UserName
�� 
=
�� 
Guid
�� 
.
��  
NewGuid
��  '
(
��' (
)
��( )
.
��) *
ToString
��* 2
(
��2 3
)
��3 4
,
��4 5
}
�� 
;
�� 
var
�� 
identityResult
�� 
=
��  
await
��! &
_userManager
��' 3
.
��3 4
CreateAsync
��4 ?
(
��? @
user
��@ D
)
��D E
;
��E F
if
�� 
(
�� 
!
�� 
identityResult
�� 
.
��  
	Succeeded
��  )
)
��) *
throw
��+ 0
new
��1 4
	Exception
��5 >
(
��> ?
identityResult
��? M
.
��M N
Errors
��N T
.
��T U
First
��U Z
(
��Z [
)
��[ \
.
��\ ]
Description
��] h
)
��h i
;
��i j
if
�� 
(
�� 
filtered
�� 
.
�� 
Any
�� 
(
�� 
)
�� 
)
�� 
{
�� 
identityResult
�� 
=
��  
await
��! &
_userManager
��' 3
.
��3 4
AddClaimsAsync
��4 B
(
��B C
user
��C G
,
��G H
filtered
��I Q
)
��Q R
;
��R S
if
�� 
(
�� 
!
�� 
identityResult
�� #
.
��# $
	Succeeded
��$ -
)
��- .
throw
��/ 4
new
��5 8
	Exception
��9 B
(
��B C
identityResult
��C Q
.
��Q R
Errors
��R X
.
��X Y
First
��Y ^
(
��^ _
)
��_ `
.
��` a
Description
��a l
)
��l m
;
��m n
}
�� 
identityResult
�� 
=
�� 
await
�� "
_userManager
��# /
.
��/ 0
AddLoginAsync
��0 =
(
��= >
user
��> B
,
��B C
new
��D G
UserLoginInfo
��H U
(
��U V
provider
��V ^
,
��^ _
providerUserId
��` n
,
��n o
provider
��p x
)
��x y
)
��y z
;
��z {
if
�� 
(
�� 
!
�� 
identityResult
�� 
.
��  
	Succeeded
��  )
)
��) *
throw
��+ 0
new
��1 4
	Exception
��5 >
(
��> ?
identityResult
��? M
.
��M N
Errors
��N T
.
��T U
First
��U Z
(
��Z [
)
��[ \
.
��\ ]
Description
��] h
)
��h i
;
��i j
return
�� 
user
�� 
;
�� 
}
�� 	
private
�� 
void
�� )
ProcessLoginCallbackForOidc
�� 0
(
��0 1 
AuthenticateResult
��1 C
externalResult
��D R
,
��R S
List
��T X
<
��X Y
Claim
��Y ^
>
��^ _
localClaims
��` k
,
��k l'
AuthenticationProperties��m � 
localSignInProps��� �
)��� �
{
�� 	
var
�� 
sid
�� 
=
�� 
externalResult
�� $
.
��$ %
	Principal
��% .
.
��. /
Claims
��/ 5
.
��5 6
FirstOrDefault
��6 D
(
��D E
x
��E F
=>
��G I
x
��J K
.
��K L
Type
��L P
==
��Q S
JwtClaimTypes
��T a
.
��a b
	SessionId
��b k
)
��k l
;
��l m
if
�� 
(
�� 
sid
�� 
!=
�� 
null
�� 
)
�� 
{
�� 
localClaims
�� 
.
�� 
Add
�� 
(
��  
new
��  #
Claim
��$ )
(
��) *
JwtClaimTypes
��* 7
.
��7 8
	SessionId
��8 A
,
��A B
sid
��C F
.
��F G
Value
��G L
)
��L M
)
��M N
;
��N O
}
�� 
var
�� 
id_token
�� 
=
�� 
externalResult
�� )
.
��) *

Properties
��* 4
.
��4 5
GetTokenValue
��5 B
(
��B C
$str
��C M
)
��M N
;
��N O
if
�� 
(
�� 
id_token
�� 
!=
�� 
null
��  
)
��  !
{
�� 
localSignInProps
��  
.
��  !
StoreTokens
��! ,
(
��, -
new
��- 0
[
��0 1
]
��1 2
{
��3 4
new
��5 8!
AuthenticationToken
��9 L
{
��M N
Name
��O S
=
��T U
$str
��V `
,
��` a
Value
��b g
=
��h i
id_token
��j r
}
��s t
}
��u v
)
��v w
;
��w x
}
�� 
}
�� 	
private
�� 
void
�� *
ProcessLoginCallbackForWsFed
�� 1
(
��1 2 
AuthenticateResult
��2 D
externalResult
��E S
,
��S T
List
��U Y
<
��Y Z
Claim
��Z _
>
��_ `
localClaims
��a l
,
��l m'
AuthenticationProperties��n � 
localSignInProps��� �
)��� �
{
�� 	
}
�� 	
private
�� 
void
�� +
ProcessLoginCallbackForSaml2p
�� 2
(
��2 3 
AuthenticateResult
��3 E
externalResult
��F T
,
��T U
List
��V Z
<
��Z [
Claim
��[ `
>
��` a
localClaims
��b m
,
��m n'
AuthenticationProperties��o � 
localSignInProps��� �
)��� �
{
�� 	
}
�� 	
}
�� 
}�� �
TD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\ExternalProvider.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
ExternalProvider !
{ 
public		 
string		 
DisplayName		 !
{		" #
get		$ '
;		' (
set		) ,
;		, -
}		. /
public

 
string

  
AuthenticationScheme

 *
{

+ ,
get

- 0
;

0 1
set

2 5
;

5 6
}

7 8
} 
} �
VD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\LoggedOutViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
LoggedOutViewModel #
{ 
public		 
string		 !
PostLogoutRedirectUri		 +
{		, -
get		. 1
;		1 2
set		3 6
;		6 7
}		8 9
public

 
string

 

ClientName

  
{

! "
get

# &
;

& '
set

( +
;

+ ,
}

- .
public 
string 
SignOutIframeUrl &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
bool )
AutomaticRedirectAfterSignOut 1
{2 3
get4 7
;7 8
set9 <
;< =
}> ?
=@ A
falseB G
;G H
public 
string 
LogoutId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
bool "
TriggerExternalSignout *
=>+ -(
ExternalAuthenticationScheme. J
!=K M
nullN R
;R S
public 
string (
ExternalAuthenticationScheme 2
{3 4
get5 8
;8 9
set: =
;= >
}? @
} 
} �
SD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\LoginInputModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{		 
public

 

class

 
LoginInputModel

  
{ 
[ 	
Required	 
( 
AllowEmptyStrings #
=$ %
false& +
,+ ,
ErrorMessage- 9
=: ;
Constant< D
.D E
REQUIRED_INPUT_MSGE W
)W X
]X Y
public 
string 
Username 
{  
get! $
;$ %
set& )
;) *
}+ ,
[ 	
Required	 
( 
AllowEmptyStrings #
=$ %
false& +
,+ ,
ErrorMessage- 9
=: ;
Constant< D
.D E
REQUIRED_INPUT_MSGE W
)W X
]X Y
public 
string 
Password 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
bool 
RememberLogin !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
	ReturnUrl 
{  !
get" %
;% &
set' *
;* +
}, -
public 
bool $
ShowAcceptAgreementPopUp ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
public 
bool 
AcceptAgreement #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
ManageSignatureUI '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
	Signature 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
FinalSignature $
{% &
get' *
;* +
set, /
;/ 0
}1 2
} 
} �
RD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\LoginViewModel.cs
	namespace		 	
IdentityServerHost		
 
.		 

Quickstart		 '
.		' (
UI		( *
{

 
public 

class 
LoginViewModel 
:  !
LoginInputModel" 1
{ 
public 
bool 
AllowRememberLogin &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
=5 6
true7 ;
;; <
public 
bool 
EnableLocalLogin $
{% &
get' *
;* +
set, /
;/ 0
}1 2
=3 4
true5 9
;9 :
public 
IEnumerable 
< 
ExternalProvider +
>+ ,
ExternalProviders- >
{? @
getA D
;D E
setF I
;I J
}K L
=M N

EnumerableO Y
.Y Z
EmptyZ _
<_ `
ExternalProvider` p
>p q
(q r
)r s
;s t
public 
IEnumerable 
< 
ExternalProvider +
>+ ,$
VisibleExternalProviders- E
=>F H
ExternalProvidersI Z
.Z [
Where[ `
(` a
xa b
=>c e
!f g
Stringg m
.m n
IsNullOrWhiteSpace	n �
(
� �
x
� �
.
� �
DisplayName
� �
)
� �
)
� �
;
� �
public 
bool 
IsExternalLoginOnly '
=>( *
EnableLocalLogin+ ;
==< >
false? D
&&E G
ExternalProvidersH Y
?Y Z
.Z [
Count[ `
(` a
)a b
==c e
$numf g
;g h
public 
string 
ExternalLoginScheme )
=>* ,
IsExternalLoginOnly- @
?A B
ExternalProvidersC T
?T U
.U V
SingleOrDefaultV e
(e f
)f g
?g h
.h i 
AuthenticationSchemei }
:~ 
null
� �
;
� �
public 
int 
? 
Version 
{ 
get !
;! "
set# &
;& '
}( )
public 
string 
AgreementContent &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
public 
DateTime 
? 
	Effective "
{# $
get% (
;( )
set* -
;- .
}/ 0
} 
} �
TD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\LogoutInputModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
LogoutInputModel !
{ 
public		 
string		 
LogoutId		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
}

 
} �
SD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\LogoutViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
LogoutViewModel  
:! "
LogoutInputModel# 3
{ 
public		 
bool		 
ShowLogoutPrompt		 $
{		% &
get		' *
;		* +
set		, /
;		/ 0
}		1 2
=		3 4
true		5 9
;		9 :
}

 
} �
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\RedirectViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
RedirectViewModel "
{		 
public

 
string

 
RedirectUrl

 !
{

" #
get

$ '
;

' (
set

) ,
;

, -
}

. /
} 
} �v
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Account\UtilityController.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Quickstart '
.' (
Account( /
{ 
public 

class 
UtilityController "
:# $
ControllerBase% 3
{ 
private 
readonly 
UserManager $
<$ %
ApplicationUser% 4
>4 5
_userManager6 B
;B C
private 
readonly 
IUserRepository (
_iUserRepository) 9
;9 :
private 
readonly #
IConfigurationDbContext 0#
_configurationDbContext1 H
;H I
private   
readonly   $
IHttpsResponseRepository   1%
_iHttpsResponseRepository  2 K
;  K L
private!! 
readonly!! "
IDynamicMessageService!! /"
_dynamicMessageService!!0 F
;!!F G
private"" 
readonly"" 
ILogger""  
<""  !
UtilityController""! 2
>""2 3
_logger""4 ;
;""; <
public$$ 
UtilityController$$  
($$  !
UserManager$$! ,
<$$, -
ApplicationUser$$- <
>$$< =
userManager$$> I
,$$I J
IUserRepository$$K Z
iUserRepository$$[ j
,$$j k$
IConfigurationDbContext	$$l �$
configurationDbContext
$$� �
,
$$� �&
IHttpsResponseRepository
$$� �%
httpsResponseRepository
$$� �
,
$$� �$
IDynamicMessageService
$$� �#
dynamicMessageService
$$� �
,
$$� �
ILogger
$$� �
<
$$� �
UtilityController
$$� �
>
$$� �
logger
$$� �
)
$$� �
{%% 	
_userManager&& 
=&& 
userManager&& &
;&&& '
_iUserRepository'' 
='' 
iUserRepository'' .
;''. /#
_configurationDbContext(( #
=(($ %"
configurationDbContext((& <
;((< =%
_iHttpsResponseRepository)) %
=))& '#
httpsResponseRepository))( ?
;))? @"
_dynamicMessageService** "
=**# $!
dynamicMessageService**% :
;**: ;
_logger++ 
=++ 
logger++ 
;++ 
},, 	
[33 	
HttpPost33	 
]33 
[44 	
AllowAnonymous44	 
]44 
public55 
async55 
Task55 
<55 
IActionResult55 '
>55' ((
RegisterExsistingUserFromFJT55) E
(55E F
[55F G
FromBody55G O
]55O P
List55Q U
<55U V

RegisterVM55V `
>55` a
userList55b j
)55j k
{66 	
List77 
<77 
string77 
>77 

failedUser77 #
=77$ %
new77& )
List77* .
<77. /
string77/ 5
>775 6
(776 7
)777 8
;778 9
List88 
<88 
IdPair88 
>88 

sucessUser88 #
=88$ %
new88& )
List88* .
<88. /
IdPair88/ 5
>885 6
(886 7
)887 8
;888 9
try:: 
{;; 
foreach<< 
(<< 
var<< 
user<< !
in<<" $
userList<<% -
)<<- .
{== 
var?? 
newApplicationUser?? *
=??+ ,
new??- 0
ApplicationUser??1 @
{@@ 
UserNameAA  
=AA! "
userAA# '
.AA' (
UsernameAA( 0
,AA0 1
userPasswordDigestBB *
=BB+ ,
userBB- 1
.BB1 2
PasswordBB2 :
,BB: ;
EmailCC 
=CC 
userCC  $
.CC$ %
EmailCC% *
,CC* +
}EE 
;EE 
varFF 
entryResultFF #
=FF$ %
awaitFF& +
_userManagerFF, 8
.FF8 9
CreateAsyncFF9 D
(FFD E
newApplicationUserFFE W
)FFW X
;FFX Y
ifGG 
(GG 
!GG 
entryResultGG $
.GG$ %
	SucceededGG% .
)GG. /
{HH 

failedUserII "
.II" #
AddII# &
(II& '
userII' +
.II+ ,
UsernameII, 4
+II5 6
$strII7 <
+II= >
userII? C
.IIC D
EmailIID I
)III J
;IIJ K
}JJ 
elseKK 
{LL 
varNN 
	objClientNN %
=NN& '
awaitNN( -#
_configurationDbContextNN. E
.NNE F
ClientsNNF M
.NNM N
WhereNNN S
(NNS T
xNNT U
=>NNV X
xNNY Z
.NNZ [

ClientNameNN[ e
==NNf h
ClientConstantNNi w
.NNw x

Q2CClients	NNx �
.
NN� �
Q2CUI
NN� �
.
NN� �
GetDisplayValue
NN� �
(
NN� �
)
NN� �
)
NN� �
.
NN� �!
FirstOrDefaultAsync
NN� �
(
NN� �
)
NN� �
;
NN� �
ifPP 
(PP 
	objClientPP %
!=PP& (
nullPP) -
)PP- .
{QQ 
ClientUserMappingVMRR /!
newClientUsersMappingRR0 E
=RRF G
newRRH K
ClientUserMappingVMRRL _
(RR_ `
)RR` a
{SS 
ClientIdTT  (
=TT) *
	objClientTT+ 4
.TT4 5
ClientIdTT5 =
,TT= >
UserIdUU  &
=UU' (
newApplicationUserUU) ;
.UU; <
IdUU< >
}VV 
;VV 
awaitXX !
_iUserRepositoryXX" 2
.XX2 3
AddClientUserMapXX3 C
(XXC D!
newClientUsersMappingXXD Y
)XXY Z
;XXZ [
}YY 
IdPair[[ 
newPair[[ &
=[[' (
new[[) ,
IdPair[[- 3
([[3 4
)[[4 5
{\\ 
userId]] "
=]]# $
user]]% )
.]]) *
Id]]* ,
,]], -

IdentityId^^ &
=^^' (
newApplicationUser^^) ;
.^^; <
Id^^< >
}`` 
;`` 

sucessUseraa "
.aa" #
Addaa# &
(aa& '
newPairaa' .
)aa. /
;aa/ 0
}bb 
}cc 
}dd 
catchee 
(ee 
	Exceptionee 
eee 
)ee 
{ff 
returngg 
Okgg 
(gg 
newgg 
{hh 
entryStatusii 
=ii  !
trueii" &
,ii& '

failedUserjj 
,jj 

sucessUserkk 
,kk 
messagell 
=ll 
$strll /
,ll/ 0
}mm 
)mm 
;mm 
}nn 
returnpp 
Okpp 
(pp 
newpp 
{qq 
entryStatusrr 
=rr 
truerr "
,rr" #

failedUserss 
,ss 

sucessUsertt 
,tt 
messageuu 
=uu 
$struu +
,uu+ ,
}vv 
)vv 
;vv 
}ww 	
[~~ 	
HttpPost~~	 
]~~ 
[ 	
	Authorize	 
( !
AuthenticationSchemes (
=) *
JwtBearerDefaults+ <
.< = 
AuthenticationScheme= Q
)Q R
]R S
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (%
ManageClientUserMapping
��) @
(
��@ A
[
��A B
FromBody
��B J
]
��J K'
ManageClientUserMappingVM
��L e
model
��f k
)
��k l
{
�� 	
if
�� 
(
�� 
model
�� 
==
�� 
null
�� 
)
�� 
{
�� 
var
�� !
invalidParameterMSG
�� '
=
��( )
await
��* /$
_dynamicMessageService
��0 F
.
��F G
Get
��G J
(
��J K
INVALID_PARAMETER
��K \
)
��\ ]
;
��] ^
return
�� '
_iHttpsResponseRepository
�� 0
.
��0 1
ReturnResult
��1 =
(
��= >
APIStatusCode
��> K
.
��K L
ERROR
��L Q
,
��Q R
APIState
��S [
.
��[ \
FAILED
��\ b
,
��b c
null
��d h
,
��h i
new
��j m
UserMessage
��n y
(
��y z
)
��z {
{
��| }
messageContent��~ �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �#
invalidParameterMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �#
invalidParameterMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
try
�� 
{
�� 
bool
�� 
mappingSuccess
�� #
;
��# $
var
�� 
objClint
�� 
=
�� 
await
�� $%
_configurationDbContext
��% <
.
��< =
Clients
��= D
.
��D E
Where
��E J
(
��J K
x
��K L
=>
��M O
x
��P Q
.
��Q R

ClientName
��R \
==
��] _
model
��` e
.
��e f

ClientName
��f p
)
��p q
.
��q r"
FirstOrDefaultAsync��r �
(��� �
)��� �
;��� �
if
�� 
(
�� 
objClint
�� 
==
�� 
null
��  $
)
��$ %
{
�� 
var
�� 
notFoundMSG
�� #
=
��$ %
await
��& +$
_dynamicMessageService
��, B
.
��B C
Get
��C F
(
��F G
	NOT_FOUND
��G P
)
��P Q
;
��Q R
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �
notFoundMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �
notFoundMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �
string��� �
.��� �
Format��� �
(��� �
notFoundMSG��� �
.��� �
message��� �
,��� �
$str��� �
)��� �
}��� �
}��� �
)��� �
;��� �
}
�� !
ClientUserMappingVM
�� ##
newClientUsersMapping
��$ 9
=
��: ;
new
��< ?!
ClientUserMappingVM
��@ S
(
��S T
)
��T U
{
�� 
ClientId
�� 
=
�� 
objClint
�� '
.
��' (
ClientId
��( 0
,
��0 1
UserId
�� 
=
�� 
model
�� "
.
��" #
UserId
��# )
}
�� 
;
�� 
if
�� 
(
�� 
model
�� 
.
�� 
toAdd
�� 
)
��  
{
�� 
mappingSuccess
�� "
=
��# $
await
��% *
_iUserRepository
��+ ;
.
��; <
AddClientUserMap
��< L
(
��L M#
newClientUsersMapping
��M b
)
��b c
;
��c d
}
�� 
else
�� 
{
�� 
mappingSuccess
�� "
=
��# $
await
��% *
_iUserRepository
��+ ;
.
��; <!
RemoveClientUserMap
��< O
(
��O P#
newClientUsersMapping
��P e
)
��e f
;
��f g
}
�� 
if
�� 
(
�� 
mappingSuccess
�� "
)
��" #
{
�� 
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
SUCCESS
��P W
,
��W X
APIState
��Y a
.
��a b
SUCCESS
��b i
,
��i j
null
��k o
,
��o p
null
��q u
)
��u v
;
��v w
}
�� 
else
�� 
{
�� 
var
�� 
somethingWrongMSG
�� )
=
��* +
await
��, 1$
_dynamicMessageService
��2 H
.
��H I
Get
��I L
(
��L M
SOMTHING_WRONG
��M [
)
��[ \
;
��\ ]
return
�� '
_iHttpsResponseRepository
�� 4
.
��4 5
ReturnResult
��5 A
(
��A B
APIStatusCode
��B O
.
��O P
ERROR
��P U
,
��U V
APIState
��W _
.
��_ `
FAILED
��` f
,
��f g
null
��h l
,
��l m
new
��n q
UserMessage
��r }
(
��} ~
)
��~ 
{��� �
messageContent��� �
=��� �
new��� �
MessageContent��� �
{��� �
messageType��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageType��� �
,��� �
messageCode��� �
=��� �!
somethingWrongMSG��� �
.��� �
messageCode��� �
,��� �
message��� �
=��� �!
somethingWrongMSG��� �
.��� �
message��� �
}��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
e
��! "
.
��" #
ToString
��# +
(
��+ ,
)
��, -
)
��- .
;
��. /
return
�� 
await
�� '
_iHttpsResponseRepository
�� 6
.
��6 7%
ReturnExceptionResponse
��7 N
(
��N O
e
��O P
)
��P Q
;
��Q R
}
�� 
}
�� 	
}
�� 
}�� �
^D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Clients\ApplicationClientViewModel.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Quickstart '
.' (
Clients( /
{ 
public 

class &
ApplicationClientViewModel +
{		 
public

 
string

 
ClientID

 
{

  
get

! $
;

$ %
set

& )
;

) *
}

+ ,
public 
ICollection 
< 
string !
>! "
AllowedScopes# 0
{1 2
get3 6
;6 7
set8 ;
;; <
}= >
public 
string 
ClientSceret "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
ICollection 
< 
string !
>! "
AllowedCorsOrigins# 5
{6 7
get8 ;
;; <
set= @
;@ A
}B C
public 
ICollection 
< 
string !
>! "
RedirectUris# /
{0 1
get2 5
;5 6
set7 :
;: ;
}< =
public 
string !
PostLogoutRedirectUri +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
public 
string !
FrontChannelLogoutUri +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
public 
bool 
isDefaultApp  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
bool '
AllowAccessTokensViaBrowser /
{0 1
get2 5
;5 6
set7 :
;: ;
}< =
} 
} ��
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Clients\ClientsController.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Quickstart '
.' (
Clients( /
{ 
public 

class 
ClientsController "
:# $

Controller% /
{ 
private 
readonly 
IClientStore %
_clientStore& 2
;2 3
private 
readonly "
ConfigurationDbContext /#
_configurationDbContext0 G
;G H
private 
readonly 
IConfiguration '
_configuration( 6
;6 7
private   
readonly   !
IFJTIdentityDbContext   .
_fjtDBContext  / <
;  < =
private!! 
readonly!! 
IUserRepository!! (
_iUserRepository!!) 9
;!!9 :
public%% 
ClientsController%%  
(%%  !
IClientStore&& 
clientStore&& $
,&&$ %"
ConfigurationDbContext'' ""
configurationDbContext''# 9
,''9 :!
IFJTIdentityDbContext(( !
fjtDBContext((" .
,((. /
IUserRepository)) 
iUserRepository)) +
,))+ ,
IConfiguration** 
configuration** )
)**) *
{++ 	
_clientStore,, 
=,, 
clientStore,, &
;,,& '#
_configurationDbContext-- #
=--$ %"
configurationDbContext--& <
;--< =
_configuration.. 
=.. 
configuration.. *
;..* +
_fjtDBContext// 
=// 
fjtDBContext// (
;//( )
_iUserRepository00 
=00 
iUserRepository00 .
;00. /
}22 	
[88 	
HttpPost88	 
]88 
public99 
async99 
Task99 
<99 
IActionResult99 '
>99' (
ManageClients99) 6
(996 7
ClientsViewModel997 G
model99H M
)99M N
{:: 	
varAA 
clientSecretAA 
=AA 
HelperAA %
.AA% &
HelperAA& ,
.AA, - 
GenerateClientSecretAA- A
(AAA B
)AAB C
;AAC D
varBB 
clientIdBB 
=BB 
GuidBB 
.BB  
NewGuidBB  '
(BB' (
)BB( )
.BB) *
ToStringBB* 2
(BB2 3
$strBB3 6
)BB6 7
;BB7 8
varDD 
clientModelDD 
=DD 
newDD !
ClientDD" (
{EE 
ClientIdFF 
=FF 
clientIdFF #
,FF# $

ClientNameGG 
=GG 
modelGG "
.GG" #

ClientNameGG# -
,GG- .
ClientSecretsHH 
=HH 
newHH  #
ListHH$ (
<HH( )
SecretHH) /
>HH/ 0
{II 
newJJ 
SecretJJ 
(JJ 
clientSecretJJ +
.JJ+ ,
Sha256JJ, 2
(JJ2 3
)JJ3 4
)JJ4 5
}KK 
,KK 
AllowedGrantTypesLL !
=LL" #

GrantTypesLL$ .
.LL. /
ClientCredentialsLL/ @
,LL@ A
}SS 
;SS #
_configurationDbContextUU #
.UU# $
ClientsUU$ +
.UU+ ,
AddUU, /
(UU/ 0
clientModelUU0 ;
.UU; <
ToEntityUU< D
(UUD E
)UUE F
)UUF G
;UUG H
awaitVV #
_configurationDbContextVV )
.VV) *
SaveChangesAsyncVV* :
(VV: ;
)VV; <
;VV< =
returnWW 
OkWW 
(WW 
)WW 
;WW 
}XX 	
[__ 	
HttpPost__	 
]__ 
public`` 
async`` 
Task`` 
<`` 
IActionResult`` '
>``' (
AddClientSecret``) 8
(``8 9
ClientsViewModel``9 I
model``J O
)``O P
{aa 	
varbb 
clientbb 
=bb #
_configurationDbContextbb 0
.bb0 1
Clientsbb1 8
.bb8 9
Includebb9 @
(bb@ A
xbbA B
=>bbC E
xbbF G
.bbG H
ClientSecretsbbH U
)bbU V
.bbV W
WherebbW \
(bb\ ]
xbb] ^
=>bb_ a
xbbb c
.bbc d

ClientNamebbd n
==bbo q
modelbbr w
.bbw x

ClientName	bbx �
)
bb� �
.
bb� �
FirstOrDefault
bb� �
(
bb� �
)
bb� �
;
bb� �
ifdd 
(dd 
clientdd 
!=dd 
nulldd 
&&dd !
clientdd" (
.dd( )
ClientSecretsdd) 6
!=dd7 9
nulldd: >
)dd> ?
{ee 
stringff 
ClientSecretsff $
=ff% &
clientff' -
.ff- .
ClientSecretsff. ;
.ff; <
FirstOrDefaultff< J
(ffJ K
)ffK L
.ffL M
ValueffM R
;ffR S
returngg 
Okgg 
(gg 
newgg 
{gg 
ClientIDgg  (
=gg) *
clientgg+ 1
.gg1 2
ClientIdgg2 :
,gg: ;
ClientSecretsgg< I
=ggJ K
ClientSecretsggL Y
}ggZ [
)gg[ \
;gg\ ]
}hh 
elseii 
{jj 
varkk 
clientSecretkk  
=kk! "
Helperkk# )
.kk) *
Helperkk* 0
.kk0 1 
GenerateClientSecretkk1 E
(kkE F
)kkF G
;kkG H
varll 
clientIdll 
=ll 
Guidll #
.ll# $
NewGuidll$ +
(ll+ ,
)ll, -
.ll- .
ToStringll. 6
(ll6 7
$strll7 :
)ll: ;
;ll; <
varmm 
newclientSecretmm #
=mm$ %
clientSecretmm& 2
.mm2 3
Sha256mm3 9
(mm9 :
)mm: ;
;mm; <
varnn 
clientModelnn 
=nn  !
newnn" %
Clientnn& ,
{oo 
ClientIdpp 
=pp 
clientIdpp '
,pp' (

ClientNameqq 
=qq  
modelqq! &
.qq& '

ClientNameqq' 1
,qq1 2
ClientSecretsrr !
=rr" #
newrr$ '
Listrr( ,
<rr, -
Secretrr- 3
>rr3 4
{rr5 6
newss 
Secretss "
(ss" #
clientSecretss# /
.ss/ 0
Sha256ss0 6
(ss6 7
)ss7 8
)ss8 9
}tt 
,tt 
AllowedGrantTypesuu %
=uu& '

GrantTypesuu( 2
.uu2 3
ClientCredentialsuu3 D
,uuD E
}{{ 
;{{ 
var}} 
obj}} 
=}} #
_configurationDbContext}} 1
.}}1 2
Clients}}2 9
.}}9 :
Add}}: =
(}}= >
clientModel}}> I
.}}I J
ToEntity}}J R
(}}R S
)}}S T
)}}T U
;}}U V
await~~ #
_configurationDbContext~~ -
.~~- .
SaveChangesAsync~~. >
(~~> ?
)~~? @
;~~@ A
var
�� 
objnewClints
��  
=
��! "%
_configurationDbContext
��# :
.
��: ;
Clients
��; B
.
��B C
Include
��C J
(
��J K
x
��K L
=>
��M O
x
��P Q
.
��Q R
ClientSecrets
��R _
)
��_ `
.
��` a
Where
��a f
(
��f g
x
��g h
=>
��i k
x
��l m
.
��m n

ClientName
��n x
==
��y {
model��| �
.��� �

ClientName��� �
)��� �
.��� �
FirstOrDefault��� �
(��� �
)��� �
;��� �
return
�� 
Ok
�� 
(
�� 
new
�� 
{
�� 
ClientID
��  (
=
��) *
clientId
��+ 3
,
��3 4
ClientSecrets
��5 B
=
��C D
clientSecret
��E Q
,
��Q R
id
��S U
=
��V W
objnewClints
��X d
!=
��e g
null
��h l
?
��m n
objnewClints
��o {
.
��{ |
Id
��| ~
:�� �
$num��� �
}��� �
)��� �
;��� �
}
�� 
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' ( 
UpdateClientSecret
��) ;
(
��; <
ClientsViewModel
��< L
model
��M R
)
��R S
{
�� 	
var
�� 
client
�� 
=
�� %
_configurationDbContext
�� 0
.
��0 1
Clients
��1 8
.
��8 9
Include
��9 @
(
��@ A
x
��A B
=>
��C E
x
��F G
.
��G H
ClientSecrets
��H U
)
��U V
.
��V W
Where
��W \
(
��\ ]
x
��] ^
=>
��_ a
x
��b c
.
��c d

ClientName
��d n
==
��o q
model
��r w
.
��w x

ClientName��x �
)��� �
.��� �
FirstOrDefault��� �
(��� �
)��� �
;��� �
if
�� 
(
�� 
client
�� 
!=
�� 
null
�� 
&&
�� !
client
��" (
.
��( )
ClientSecrets
��) 6
!=
��7 9
null
��: >
)
��> ?
{
�� 
var
�� 
clientSecret
��  
=
��! "
Helper
��# )
.
��) *
Helper
��* 0
.
��0 1"
GenerateClientSecret
��1 E
(
��E F
)
��F G
;
��G H
var
�� 
objcientscret
�� !
=
��" #
client
��$ *
.
��* +
ClientSecrets
��+ 8
.
��8 9
Where
��9 >
(
��> ?
x
��? @
=>
��A C
x
��D E
.
��E F
ClientId
��F N
==
��O Q
client
��R X
.
��X Y
Id
��Y [
)
��[ \
.
��\ ]
FirstOrDefault
��] k
(
��k l
)
��l m
;
��m n
objcientscret
�� 
.
�� 
Value
�� #
=
��$ %
clientSecret
��& 2
.
��2 3
Sha256
��3 9
(
��9 :
)
��: ;
;
��; <
await
�� %
_configurationDbContext
�� -
.
��- .
SaveChangesAsync
��. >
(
��> ?
)
��? @
;
��@ A
return
�� 
Ok
�� 
(
�� 
new
�� 
{
�� 
ClientID
��  (
=
��) *
client
��+ 1
.
��1 2
ClientId
��2 :
,
��: ;
ClientSecrets
��< I
=
��J K
clientSecret
��L X
,
��X Y
id
��Z \
=
��] ^
client
��_ e
.
��e f
Id
��f h
}
��i j
)
��j k
;
��k l
}
�� 
return
�� 
Ok
�� 
(
�� 
new
�� 
{
�� 
ClientID
�� $
=
��% &
$str
��' )
,
��) *
ClientSecrets
��+ 8
=
��9 :
$str
��; =
,
��= >
id
��? A
=
��B C
$str
��D F
}
��G H
)
��H I
;
��I J
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' ($
UpdateAppicationClient
��) ?
(
��? @
ClientsViewModel
��@ P
model
��Q V
)
��V W
{
�� 	
string
�� 

DomainName
�� 
=
�� 
_configuration
��  .
[
��. /
$str
��/ ;
]
��; <
;
��< =
string
�� &
LoginResponseRedirectUri
�� +
=
��, -
_configuration
��. <
[
��< =
$str
��= W
]
��W X
;
��X Y
string
�� 
LogoutRedirectUri
�� $
=
��% &
_configuration
��' 5
[
��5 6
$str
��6 I
]
��I J
;
��J K
bool
�� 
IsSecure
�� 
=
�� 
Convert
�� #
.
��# $
	ToBoolean
��$ -
(
��- .
_configuration
��. <
[
��< =
$str
��= G
]
��G H
)
��H I
;
��I J
var
�� 
client
�� 
=
�� %
_configurationDbContext
�� 0
.
��0 1
Clients
��1 8
.
�� 
Include
�� 
(
�� 
x
�� 
=>
�� 
x
�� 
.
��  
RedirectUris
��  ,
)
��, -
.
�� 
Include
�� 
(
�� 
x
�� 
=>
�� 
x
�� 
.
��  $
PostLogoutRedirectUris
��  6
)
��6 7
.
�� 
Include
�� 
(
�� 
x
�� 
=>
�� 
x
�� 
.
��   
AllowedCorsOrigins
��  2
)
��2 3
.
�� 
Where
�� 
(
�� 
x
�� 
=>
�� 
x
�� 
.
�� 
Id
��  
==
��! #
model
��$ )
.
��) *
Id
��* ,
)
��, -
.
��- .
FirstOrDefault
��. <
(
��< =
)
��= >
;
��> ?
if
�� 
(
�� 
client
�� 
!=
�� 
null
�� 
)
�� 
{
�� 
client
�� 
.
�� 
ClientId
�� 
=
��  !
model
��" '
.
��' (

ClientName
��( 2
;
��2 3
client
�� 
.
�� 

ClientName
�� !
=
��" #
model
��$ )
.
��) *

ClientName
��* 4
;
��4 5
string
�� 
AllowedCorsOrigin
�� (
=
��) *
string
��+ 1
.
��1 2
Format
��2 8
(
��8 9
$str
��9 H
,
��H I
(
��J K
IsSecure
��K S
?
��T U
$str
��V ]
:
��^ _
$str
��` f
)
��f g
,
��g h
model
��i n
.
��n o

ClientName
��o y
,
��y z

DomainName��{ �
)��� �
;��� �
string
�� 
RedirectUri
�� "
=
��# $
string
��% +
.
��+ ,
Format
��, 2
(
��2 3
$str
��3 E
,
��E F
(
��G H
IsSecure
��H P
?
��Q R
$str
��S Z
:
��[ \
$str
��] c
)
��c d
,
��d e
model
��f k
.
��k l

ClientName
��l v
,
��v w

DomainName��x �
,��� �(
LoginResponseRedirectUri��� �
)��� �
;��� �
string
�� #
PostLogoutRedirectUri
�� ,
=
��- .
string
��/ 5
.
��5 6
Format
��6 <
(
��< =
$str
��= O
,
��O P
(
��Q R
IsSecure
��R Z
?
��[ \
$str
��] d
:
��e f
$str
��g m
)
��m n
,
��n o
model
��p u
.
��u v

ClientName��v �
,��� �

DomainName��� �
,��� �!
LogoutRedirectUri��� �
)��� �
;��� �
var
�� "
objAllowedCorsOrigin
�� (
=
��) *
client
��+ 1
.
��1 2 
AllowedCorsOrigins
��2 D
.
��D E
Where
��E J
(
��J K
x
��K L
=>
��M O
x
��P Q
.
��Q R
ClientId
��R Z
==
��[ ]
client
��^ d
.
��d e
Id
��e g
)
��g h
.
��h i
FirstOrDefault
��i w
(
��w x
)
��x y
;
��y z
var
�� 
objRedirectUris
�� #
=
��$ %
client
��& ,
.
��, -
RedirectUris
��- 9
.
��9 :
Where
��: ?
(
��? @
x
��@ A
=>
��B D
x
��E F
.
��F G
ClientId
��G O
==
��P R
client
��S Y
.
��Y Z
Id
��Z \
)
��\ ]
.
��] ^
FirstOrDefault
��^ l
(
��l m
)
��m n
;
��n o
var
�� '
objPostLogoutRedirectUris
�� -
=
��. /
client
��0 6
.
��6 7$
PostLogoutRedirectUris
��7 M
.
��M N
Where
��N S
(
��S T
x
��T U
=>
��V X
x
��Y Z
.
��Z [
ClientId
��[ c
==
��d f
client
��g m
.
��m n
Id
��n p
)
��p q
.
��q r
FirstOrDefault��r �
(��� �
)��� �
;��� �"
objAllowedCorsOrigin
�� $
.
��$ %
Origin
��% +
=
��, -
AllowedCorsOrigin
��. ?
;
��? @
objRedirectUris
�� 
.
��  
RedirectUri
��  +
=
��, -
RedirectUri
��. 9
;
��9 :'
objPostLogoutRedirectUris
�� )
.
��) *#
PostLogoutRedirectUri
��* ?
=
��@ A#
PostLogoutRedirectUri
��B W
;
��W X
await
�� %
_configurationDbContext
�� -
.
��- .
SaveChangesAsync
��. >
(
��> ?
)
��? @
;
��@ A
return
�� 
Ok
�� 
(
�� 
new
�� 
{
�� 
ClientID
��  (
=
��) *
client
��+ 1
.
��1 2
ClientId
��2 :
,
��: ;
id
��< >
=
��? @
client
��A G
.
��G H
Id
��H J
}
��K L
)
��L M
;
��M N
}
�� 
return
�� 
Ok
�� 
(
�� 
new
�� 
{
�� 
ClientID
�� $
=
��% &
$str
��' )
,
��) *
id
��+ -
=
��. /
$str
��0 2
}
��3 4
)
��4 5
;
��5 6
}
�� 	
[
�� 	
HttpPost
��	 
]
�� 
public
�� 
async
�� 
Task
�� 
<
�� 
IActionResult
�� '
>
��' (&
ManageApplicationClients
��) A
(
��A B(
ApplicationClientViewModel
��B \
model
��] b
)
��b c
{
�� 	
string
�� #
PostLogoutRedirectUri
�� (
=
��) *
model
��+ 0
.
��0 1#
PostLogoutRedirectUri
��1 F
;
��F G

Dictionary
�� 
<
�� 
string
�� 
,
�� 
string
�� %
>
��% &

properties
��' 1
=
��2 3
new
�� 

Dictionary
�� %
<
��% &
string
��& ,
,
��, -
string
��. 4
>
��4 5
(
��5 6
)
��6 7
;
��7 8
var
�� 
clientSecret
�� 
=
�� 
model
�� $
.
��$ %
ClientSceret
��% 1
;
��1 2
var
�� 
clientModel
�� 
=
�� 
new
�� !
Client
��" (
{
�� 
ClientId
�� 
=
�� 
model
��  
.
��  !
ClientID
��! )
,
��) *

ClientName
�� 
=
�� 
model
�� "
.
��" #
ClientID
��# +
,
��+ ,
ClientSecrets
�� 
=
�� 
new
��  #
List
��$ (
<
��( )
Secret
��) /
>
��/ 0
{
�� 
new
�� 
Secret
�� 
(
�� 
clientSecret
�� +
.
��+ ,
Sha256
��, 2
(
��2 3
)
��3 4
)
��4 5
}
�� 
,
�� 
Enabled
�� 
=
�� 
true
�� 
,
�� 
ProtocolType
�� 
=
�� 
$str
�� %
,
��% &!
RequireClientSecret
�� #
=
��$ %
false
��& +
,
��+ ,
RequireConsent
�� 
=
��  
false
��! &
,
��& '"
AllowRememberConsent
�� $
=
��% &
true
��' +
,
��+ ,.
 AlwaysIncludeUserClaimsInIdToken
�� 0
=
��1 2
false
��3 8
,
��8 9
RequirePkce
�� 
=
�� 
true
�� "
,
��" # 
AllowPlainTextPkce
�� "
=
��# $
false
��% *
,
��* +)
AllowAccessTokensViaBrowser
�� +
=
��, -
model
��. 3
.
��3 4)
AllowAccessTokensViaBrowser
��4 O
,
��O P#
FrontChannelLogoutUri
�� %
=
��& '
model
��( -
.
��- .#
FrontChannelLogoutUri
��. C
,
��C D/
!FrontChannelLogoutSessionRequired
�� 1
=
��2 3
true
��4 8
,
��8 9.
 BackChannelLogoutSessionRequired
�� 0
=
��1 2
true
��3 7
,
��7 8 
AllowOfflineAccess
�� "
=
��# $
true
��% )
,
��) *#
IdentityTokenLifetime
�� %
=
��& '
$num
��( ,
,
��, -!
AccessTokenLifetime
�� #
=
��$ %
$num
��& *
,
��* +'
AuthorizationCodeLifetime
�� )
=
��* +
$num
��, 0
,
��0 1*
AbsoluteRefreshTokenLifetime
�� ,
=
��- .
$num
��/ 7
,
��7 8)
SlidingRefreshTokenLifetime
�� +
=
��, -
$num
��. 6
,
��6 7
RefreshTokenUsage
�� !
=
��" #

TokenUsage
��$ .
.
��. /
OneTimeOnly
��/ :
,
��: ;.
 UpdateAccessTokenClaimsOnRefresh
�� 0
=
��1 2
true
��3 7
,
��7 8$
RefreshTokenExpiration
�� &
=
��' (
TokenExpiration
��) 8
.
��8 9
Absolute
��9 A
,
��A B
AccessTokenType
�� 
=
��  !
AccessTokenType
��" 1
.
��1 2
Jwt
��2 5
,
��5 6
EnableLocalLogin
��  
=
��! "
true
��# '
,
��' (
IncludeJwtId
�� 
=
�� 
false
�� $
,
��$ %$
AlwaysSendClientClaims
�� &
=
��' (
false
��) .
,
��. / 
ClientClaimsPrefix
�� "
=
��# $
$str
��% .
,
��. / 
DeviceCodeLifetime
�� "
=
��# $
$num
��% )
,
��) *
AllowedGrantTypes
�� !
=
��" #

GrantTypes
��$ .
.
��. /
Code
��/ 3
,
��3 4$
PostLogoutRedirectUris
�� &
=
��' (
new
��) ,
List
��- 1
<
��1 2
string
��2 8
>
��8 9
{
�� #
PostLogoutRedirectUri
�� )
}
�� 
,
�� 
AllowedScopes
�� 
=
�� 
new
��  #
List
��$ (
<
��( )
string
��) /
>
��/ 0
{
�� %
IdentityServerConstants
�� +
.
��+ ,
StandardScopes
��, :
.
��: ;
OpenId
��; A
,
��A B%
IdentityServerConstants
�� +
.
��+ ,
StandardScopes
��, :
.
��: ;
Profile
��; B
,
��B C
ClientConstant
�� "
.
��" #
	APIScopes
��# ,
.
��, -
IdentityServerAPI
��- >
.
��> ?
ToString
��? G
(
��G H
)
��H I
}
�� 
,
�� 

Properties
�� 
=
�� 

properties
�� '
}
�� 
;
�� 
if
�� 
(
�� 
model
�� 
.
�� 
AllowedScopes
�� #
!=
��$ &
null
��' +
)
��+ ,
{
�� 
model
�� 
.
�� 
AllowedScopes
�� #
.
��# $
ToList
��$ *
(
��* +
)
��+ ,
.
��, -
ForEach
��- 4
(
��4 5
x
��5 6
=>
��7 9
{
�� 
clientModel
�� 
.
��  
AllowedScopes
��  -
.
��- .
Add
��. 1
(
��1 2
x
��2 3
)
��3 4
;
��4 5
}
�� 
)
�� 
;
�� 
}
�� 
if
�� 
(
�� 
model
�� 
.
��  
AllowedCorsOrigins
�� (
!=
��) +
null
��, 0
)
��0 1
{
�� 
model
�� 
.
��  
AllowedCorsOrigins
�� (
.
��( )
ToList
��) /
(
��/ 0
)
��0 1
.
��1 2
ForEach
��2 9
(
��9 :
x
��: ;
=>
��< >
{
�� 
clientModel
�� 
.
��   
AllowedCorsOrigins
��  2
.
��2 3
Add
��3 6
(
��6 7
x
��7 8
)
��8 9
;
��9 :
}
�� 
)
�� 
;
�� 
}
�� 
if
�� 
(
�� 
model
�� 
.
�� 
RedirectUris
�� "
!=
��# %
null
��& *
)
��* +
{
�� 
model
�� 
.
�� 
RedirectUris
�� "
.
��" #
ToList
��# )
(
��) *
)
��* +
.
��+ ,
ForEach
��, 3
(
��3 4
x
��4 5
=>
��6 8
{
�� 
clientModel
�� 
.
��  
RedirectUris
��  ,
.
��, -
Add
��- 0
(
��0 1
x
��1 2
)
��2 3
;
��3 4
}
�� 
)
�� 
;
�� 
}
�� %
_configurationDbContext
�� #
.
��# $
Clients
��$ +
.
��+ ,
Add
��, /
(
��/ 0
clientModel
��0 ;
.
��; <
ToEntity
��< D
(
��D E
)
��E F
)
��F G
;
��G H
await
�� %
_configurationDbContext
�� )
.
��) *
SaveChangesAsync
��* :
(
��: ;
)
��; <
;
��< =
var
�� 
objClint
�� 
=
�� %
_configurationDbContext
�� 2
.
��2 3
Clients
��3 :
.
��: ;
Where
��; @
(
��@ A
x
��A B
=>
��C E
x
��F G
.
��G H

ClientName
��H R
==
��S U
model
��V [
.
��[ \
ClientID
��\ d
)
��d e
.
��e f
FirstOrDefault
��f t
(
��t u
)
��u v
;
��v w
if
�� 
(
�� 
model
�� 
.
�� 
isDefaultApp
�� "
)
��" #
{
�� 
var
�� 
userList
�� 
=
�� 
_fjtDBContext
�� ,
.
��, -
ApplicationUsers
��- =
.
��= >
ToList
��> D
(
��D E
)
��E F
;
��F G
foreach
�� 
(
�� 
var
�� 
user
�� !
in
��" $
userList
��% -
)
��- .
{
�� !
ClientUserMappingVM
�� '#
newClientUsersMapping
��( =
=
��> ?
new
��@ C!
ClientUserMappingVM
��D W
(
��W X
)
��X Y
{
�� 
ClientId
��  
=
��! "
objClint
��# +
.
��+ ,
ClientId
��, 4
,
��4 5
UserId
�� 
=
��  
user
��! %
.
��% &
Id
��& (
}
�� 
;
�� 
bool
�� 
mappingSuccess
�� '
=
��( )
await
��* /
_iUserRepository
��0 @
.
��@ A
AddClientUserMap
��A Q
(
��Q R#
newClientUsersMapping
��R g
)
��g h
;
��h i
}
�� 
}
�� 
return
�� 
Ok
�� 
(
�� 
new
�� 
{
�� 
Id
�� 
=
��  
objClint
��! )
!=
��* ,
null
��- 1
?
��2 3
objClint
��4 <
.
��< =
Id
��= ?
:
��@ A
$num
��B C
,
��C D
clientSecret
��E Q
}
��R S
)
��S T
;
��T U
}
�� 	
}
�� 
}�� �
TD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Clients\ClientsViewModel.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Quickstart '
.' (
Clients( /
{ 
public 

class 
ClientsViewModel !
{		 
public

 
int

 
Id

 
{

 
get

 
;

 
set

  
;

  !
}

" #
public 
string 

ClientName  
{! "
get# &
;& '
set( +
;+ ,
}- .
} 
} ��
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Consent\ConsentController.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
[ 
SecurityHeaders 
] 
[ 
	Authorize 
] 
public 

class 
ConsentController "
:# $

Controller% /
{ 
private 
readonly -
!IIdentityServerInteractionService :
_interaction; G
;G H
private 
readonly 
IClientStore %
_clientStore& 2
;2 3
private 
readonly 
IResourceStore '
_resourceStore( 6
;6 7
private 
readonly 
IEventService &
_events' .
;. /
private   
readonly   
ILogger    
<    !
ConsentController  ! 2
>  2 3
_logger  4 ;
;  ; <
public"" 
ConsentController""  
(""  !-
!IIdentityServerInteractionService## -
interaction##. 9
,##9 :
IClientStore$$ 
clientStore$$ $
,$$$ %
IResourceStore%% 
resourceStore%% (
,%%( )
IEventService&& 
events&&  
,&&  !
ILogger'' 
<'' 
ConsentController'' %
>''% &
logger''' -
)''- .
{(( 	
_interaction)) 
=)) 
interaction)) &
;))& '
_clientStore** 
=** 
clientStore** &
;**& '
_resourceStore++ 
=++ 
resourceStore++ *
;++* +
_events,, 
=,, 
events,, 
;,, 
_logger-- 
=-- 
logger-- 
;-- 
}.. 	
[55 	
HttpGet55	 
]55 
public66 
async66 
Task66 
<66 
IActionResult66 '
>66' (
Index66) .
(66. /
string66/ 5
	returnUrl666 ?
)66? @
{77 	
var88 
vm88 
=88 
await88 
BuildViewModelAsync88 .
(88. /
	returnUrl88/ 8
)888 9
;889 :
if99 
(99 
vm99 
!=99 
null99 
)99 
{:: 
return;; 
View;; 
(;; 
$str;; #
,;;# $
vm;;% '
);;' (
;;;( )
}<< 
return>> 
View>> 
(>> 
$str>> 
)>>  
;>>  !
}?? 	
[DD 	
HttpPostDD	 
]DD 
[EE 	$
ValidateAntiForgeryTokenEE	 !
]EE! "
publicFF 
asyncFF 
TaskFF 
<FF 
IActionResultFF '
>FF' (
IndexFF) .
(FF. /
ConsentInputModelFF/ @
modelFFA F
)FFF G
{GG 	
varHH 
resultHH 
=HH 
awaitHH 
ProcessConsentHH -
(HH- .
modelHH. 3
)HH3 4
;HH4 5
ifJJ 
(JJ 
resultJJ 
.JJ 

IsRedirectJJ !
)JJ! "
{KK 
ifLL 
(LL 
awaitLL 
_clientStoreLL &
.LL& '
IsPkceClientAsyncLL' 8
(LL8 9
resultLL9 ?
.LL? @
ClientIdLL@ H
)LLH I
)LLI J
{MM 
returnPP 
ViewPP 
(PP  
$strPP  *
,PP* +
newPP, /
RedirectViewModelPP0 A
{PPB C
RedirectUrlPPD O
=PPP Q
resultPPR X
.PPX Y
RedirectUriPPY d
}PPe f
)PPf g
;PPg h
}QQ 
returnSS 
RedirectSS 
(SS  
resultSS  &
.SS& '
RedirectUriSS' 2
)SS2 3
;SS3 4
}TT 
ifVV 
(VV 
resultVV 
.VV 
HasValidationErrorVV )
)VV) *
{WW 

ModelStateXX 
.XX 
AddModelErrorXX (
(XX( )
stringXX) /
.XX/ 0
EmptyXX0 5
,XX5 6
resultXX7 =
.XX= >
ValidationErrorXX> M
)XXM N
;XXN O
}YY 
if[[ 
([[ 
result[[ 
.[[ 
ShowView[[ 
)[[  
{\\ 
return]] 
View]] 
(]] 
$str]] #
,]]# $
result]]% +
.]]+ ,
	ViewModel]], 5
)]]5 6
;]]6 7
}^^ 
return`` 
View`` 
(`` 
$str`` 
)``  
;``  !
}aa 	
privateff 
asyncff 
Taskff 
<ff  
ProcessConsentResultff /
>ff/ 0
ProcessConsentff1 ?
(ff? @
ConsentInputModelff@ Q
modelffR W
)ffW X
{gg 	
varhh 
resulthh 
=hh 
newhh  
ProcessConsentResulthh 1
(hh1 2
)hh2 3
;hh3 4
varkk 
requestkk 
=kk 
awaitkk 
_interactionkk  ,
.kk, -(
GetAuthorizationContextAsynckk- I
(kkI J
modelkkJ O
.kkO P
	ReturnUrlkkP Y
)kkY Z
;kkZ [
ifll 
(ll 
requestll 
==ll 
nullll 
)ll  
returnll! '
resultll( .
;ll. /
ConsentResponsenn 
grantedConsentnn *
=nn+ ,
nullnn- 1
;nn1 2
ifqq 
(qq 
modelqq 
?qq 
.qq 
Buttonqq 
==qq  
$strqq! %
)qq% &
{rr 
grantedConsentss 
=ss  
newss! $
ConsentResponsess% 4
{ss5 6
Errorss7 <
=ss= >
AuthorizationErrorss? Q
.ssQ R
AccessDeniedssR ^
}ss_ `
;ss` a
awaitvv 
_eventsvv 
.vv 

RaiseAsyncvv (
(vv( )
newvv) ,
ConsentDeniedEventvv- ?
(vv? @
Uservv@ D
.vvD E
GetSubjectIdvvE Q
(vvQ R
)vvR S
,vvS T
requestvvU \
.vv\ ]
Clientvv] c
.vvc d
ClientIdvvd l
,vvl m
requestvvn u
.vvu v
ValidatedResources	vvv �
.
vv� �
RawScopeValues
vv� �
)
vv� �
)
vv� �
;
vv� �
}ww 
elseyy 
ifyy 
(yy 
modelyy 
?yy 
.yy 
Buttonyy "
==yy# %
$stryy& +
)yy+ ,
{zz 
if|| 
(|| 
model|| 
.|| 
ScopesConsented|| )
!=||* ,
null||- 1
&&||2 4
model||5 :
.||: ;
ScopesConsented||; J
.||J K
Any||K N
(||N O
)||O P
)||P Q
{}} 
var~~ 
scopes~~ 
=~~  
model~~! &
.~~& '
ScopesConsented~~' 6
;~~6 7
if 
( 
ConsentOptions &
.& '
EnableOfflineAccess' :
==; =
false> C
)C D
{
�� 
scopes
�� 
=
��  
scopes
��! '
.
��' (
Where
��( -
(
��- .
x
��. /
=>
��0 2
x
��3 4
!=
��5 7
IdentityServer4
��8 G
.
��G H%
IdentityServerConstants
��H _
.
��_ `
StandardScopes
��` n
.
��n o
OfflineAccess
��o |
)
��| }
;
��} ~
}
�� 
grantedConsent
�� "
=
��# $
new
��% (
ConsentResponse
��) 8
{
�� 
RememberConsent
�� '
=
��( )
model
��* /
.
��/ 0
RememberConsent
��0 ?
,
��? @#
ScopesValuesConsented
�� -
=
��. /
scopes
��0 6
.
��6 7
ToArray
��7 >
(
��> ?
)
��? @
,
��@ A
Description
�� #
=
��$ %
model
��& +
.
��+ ,
Description
��, 7
}
�� 
;
�� 
await
�� 
_events
�� !
.
��! "

RaiseAsync
��" ,
(
��, -
new
��- 0!
ConsentGrantedEvent
��1 D
(
��D E
User
��E I
.
��I J
GetSubjectId
��J V
(
��V W
)
��W X
,
��X Y
request
��Z a
.
��a b
Client
��b h
.
��h i
ClientId
��i q
,
��q r
request
��s z
.
��z {!
ValidatedResources��{ �
.��� �
RawScopeValues��� �
,��� �
grantedConsent��� �
.��� �%
ScopesValuesConsented��� �
,��� �
grantedConsent��� �
.��� �
RememberConsent��� �
)��� �
)��� �
;��� �
}
�� 
else
�� 
{
�� 
result
�� 
.
�� 
ValidationError
�� *
=
��+ ,
ConsentOptions
��- ;
.
��; <'
MustChooseOneErrorMessage
��< U
;
��U V
}
�� 
}
�� 
else
�� 
{
�� 
result
�� 
.
�� 
ValidationError
�� &
=
��' (
ConsentOptions
��) 7
.
��7 8*
InvalidSelectionErrorMessage
��8 T
;
��T U
}
�� 
if
�� 
(
�� 
grantedConsent
�� 
!=
�� !
null
��" &
)
��& '
{
�� 
await
�� 
_interaction
�� "
.
��" #
GrantConsentAsync
��# 4
(
��4 5
request
��5 <
,
��< =
grantedConsent
��> L
)
��L M
;
��M N
result
�� 
.
�� 
RedirectUri
�� "
=
��# $
model
��% *
.
��* +
	ReturnUrl
��+ 4
;
��4 5
result
�� 
.
�� 
ClientId
�� 
=
��  !
request
��" )
.
��) *
Client
��* 0
.
��0 1
ClientId
��1 9
;
��9 :
}
�� 
else
�� 
{
�� 
result
�� 
.
�� 
	ViewModel
��  
=
��! "
await
��# (!
BuildViewModelAsync
��) <
(
��< =
model
��= B
.
��B C
	ReturnUrl
��C L
,
��L M
model
��N S
)
��S T
;
��T U
}
�� 
return
�� 
result
�� 
;
�� 
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� 
ConsentViewModel
�� +
>
��+ ,!
BuildViewModelAsync
��- @
(
��@ A
string
��A G
	returnUrl
��H Q
,
��Q R
ConsentInputModel
��S d
model
��e j
=
��k l
null
��m q
)
��q r
{
�� 	
var
�� 
request
�� 
=
�� 
await
�� 
_interaction
��  ,
.
��, -*
GetAuthorizationContextAsync
��- I
(
��I J
	returnUrl
��J S
)
��S T
;
��T U
if
�� 
(
�� 
request
�� 
!=
�� 
null
�� 
)
��  
{
�� 
return
�� $
CreateConsentViewModel
�� -
(
��- .
model
��. 3
,
��3 4
	returnUrl
��5 >
,
��> ?
request
��@ G
)
��G H
;
��H I
}
�� 
else
�� 
{
�� 
_logger
�� 
.
�� 
LogError
��  
(
��  !
$str
��! K
,
��K L
	returnUrl
��M V
)
��V W
;
��W X
}
�� 
return
�� 
null
�� 
;
�� 
}
�� 	
private
�� 
ConsentViewModel
��  $
CreateConsentViewModel
��! 7
(
��7 8
ConsentInputModel
��8 I
model
��J O
,
��O P
string
��Q W
	returnUrl
��X a
,
��a b"
AuthorizationRequest
��c w
request
��x 
)�� �
{
�� 	
var
�� 
vm
�� 
=
�� 
new
�� 
ConsentViewModel
�� )
{
�� 
RememberConsent
�� 
=
��  !
model
��" '
?
��' (
.
��( )
RememberConsent
��) 8
??
��9 ;
true
��< @
,
��@ A
ScopesConsented
�� 
=
��  !
model
��" '
?
��' (
.
��( )
ScopesConsented
��) 8
??
��9 ;

Enumerable
��< F
.
��F G
Empty
��G L
<
��L M
string
��M S
>
��S T
(
��T U
)
��U V
,
��V W
Description
�� 
=
�� 
model
�� #
?
��# $
.
��$ %
Description
��% 0
,
��0 1
	ReturnUrl
�� 
=
�� 
	returnUrl
�� %
,
��% &

ClientName
�� 
=
�� 
request
�� $
.
��$ %
Client
��% +
.
��+ ,

ClientName
��, 6
??
��7 9
request
��: A
.
��A B
Client
��B H
.
��H I
ClientId
��I Q
,
��Q R
	ClientUrl
�� 
=
�� 
request
�� #
.
��# $
Client
��$ *
.
��* +
	ClientUri
��+ 4
,
��4 5
ClientLogoUrl
�� 
=
�� 
request
��  '
.
��' (
Client
��( .
.
��. /
LogoUri
��/ 6
,
��6 7"
AllowRememberConsent
�� $
=
��% &
request
��' .
.
��. /
Client
��/ 5
.
��5 6"
AllowRememberConsent
��6 J
}
�� 
;
�� 
vm
�� 
.
�� 
IdentityScopes
�� 
=
�� 
request
��  '
.
��' ( 
ValidatedResources
��( :
.
��: ;
	Resources
��; D
.
��D E
IdentityResources
��E V
.
��V W
Select
��W ]
(
��] ^
x
��^ _
=>
��` b"
CreateScopeViewModel
��c w
(
��w x
x
��x y
,
��y z
vm
��{ }
.
��} ~
ScopesConsented��~ �
.��� �
Contains��� �
(��� �
x��� �
.��� �
Name��� �
)��� �
||��� �
model��� �
==��� �
null��� �
)��� �
)��� �
.��� �
ToArray��� �
(��� �
)��� �
;��� �
var
�� 
	apiScopes
�� 
=
�� 
new
�� 
List
��  $
<
��$ %
ScopeViewModel
��% 3
>
��3 4
(
��4 5
)
��5 6
;
��6 7
foreach
�� 
(
�� 
var
�� 
parsedScope
�� $
in
��% '
request
��( /
.
��/ 0 
ValidatedResources
��0 B
.
��B C
ParsedScopes
��C O
)
��O P
{
�� 
var
�� 
apiScope
�� 
=
�� 
request
�� &
.
��& ' 
ValidatedResources
��' 9
.
��9 :
	Resources
��: C
.
��C D
FindApiScope
��D P
(
��P Q
parsedScope
��Q \
.
��\ ]

ParsedName
��] g
)
��g h
;
��h i
if
�� 
(
�� 
apiScope
�� 
!=
�� 
null
��  $
)
��$ %
{
�� 
var
�� 
scopeVm
�� 
=
��  !"
CreateScopeViewModel
��" 6
(
��6 7
parsedScope
��7 B
,
��B C
apiScope
��D L
,
��L M
vm
��N P
.
��P Q
ScopesConsented
��Q `
.
��` a
Contains
��a i
(
��i j
parsedScope
��j u
.
��u v
RawValue
��v ~
)
��~ 
||��� �
model��� �
==��� �
null��� �
)��� �
;��� �
	apiScopes
�� 
.
�� 
Add
�� !
(
��! "
scopeVm
��" )
)
��) *
;
��* +
}
�� 
}
�� 
if
�� 
(
�� 
ConsentOptions
�� 
.
�� !
EnableOfflineAccess
�� 2
&&
��3 5
request
��6 =
.
��= > 
ValidatedResources
��> P
.
��P Q
	Resources
��Q Z
.
��Z [
OfflineAccess
��[ h
)
��h i
{
�� 
	apiScopes
�� 
.
�� 
Add
�� 
(
�� #
GetOfflineAccessScope
�� 3
(
��3 4
vm
��4 6
.
��6 7
ScopesConsented
��7 F
.
��F G
Contains
��G O
(
��O P
IdentityServer4
��P _
.
��_ `%
IdentityServerConstants
��` w
.
��w x
StandardScopes��x �
.��� �
OfflineAccess��� �
)��� �
||��� �
model��� �
==��� �
null��� �
)��� �
)��� �
;��� �
}
�� 
vm
�� 
.
�� 
	ApiScopes
�� 
=
�� 
	apiScopes
�� $
;
��$ %
return
�� 
vm
�� 
;
�� 
}
�� 	
private
�� 
ScopeViewModel
�� "
CreateScopeViewModel
�� 3
(
��3 4
IdentityResource
��4 D
identity
��E M
,
��M N
bool
��O S
check
��T Y
)
��Y Z
{
�� 	
return
�� 
new
�� 
ScopeViewModel
�� %
{
�� 
Value
�� 
=
�� 
identity
��  
.
��  !
Name
��! %
,
��% &
DisplayName
�� 
=
�� 
identity
�� &
.
��& '
DisplayName
��' 2
,
��2 3
Description
�� 
=
�� 
identity
�� &
.
��& '
Description
��' 2
,
��2 3
	Emphasize
�� 
=
�� 
identity
�� $
.
��$ %
	Emphasize
��% .
,
��. /
Required
�� 
=
�� 
identity
�� #
.
��# $
Required
��$ ,
,
��, -
Checked
�� 
=
�� 
check
�� 
||
��  "
identity
��# +
.
��+ ,
Required
��, 4
}
�� 
;
�� 
}
�� 	
public
�� 
ScopeViewModel
�� "
CreateScopeViewModel
�� 2
(
��2 3
ParsedScopeValue
��3 C
parsedScopeValue
��D T
,
��T U
ApiScope
��V ^
apiScope
��_ g
,
��g h
bool
��i m
check
��n s
)
��s t
{
�� 	
var
�� 
displayName
�� 
=
�� 
apiScope
�� &
.
��& '
DisplayName
��' 2
??
��3 5
apiScope
��6 >
.
��> ?
Name
��? C
;
��C D
if
�� 
(
�� 
!
�� 
String
�� 
.
��  
IsNullOrWhiteSpace
�� *
(
��* +
parsedScopeValue
��+ ;
.
��; <
ParsedParameter
��< K
)
��K L
)
��L M
{
�� 
displayName
�� 
+=
�� 
$str
�� "
+
��# $
parsedScopeValue
��% 5
.
��5 6
ParsedParameter
��6 E
;
��E F
}
�� 
return
�� 
new
�� 
ScopeViewModel
�� %
{
�� 
Value
�� 
=
�� 
parsedScopeValue
�� (
.
��( )
RawValue
��) 1
,
��1 2
DisplayName
�� 
=
�� 
displayName
�� )
,
��) *
Description
�� 
=
�� 
apiScope
�� &
.
��& '
Description
��' 2
,
��2 3
	Emphasize
�� 
=
�� 
apiScope
�� $
.
��$ %
	Emphasize
��% .
,
��. /
Required
�� 
=
�� 
apiScope
�� #
.
��# $
Required
��$ ,
,
��, -
Checked
�� 
=
�� 
check
�� 
||
��  "
apiScope
��# +
.
��+ ,
Required
��, 4
}
�� 
;
�� 
}
�� 	
private
�� 
ScopeViewModel
�� #
GetOfflineAccessScope
�� 4
(
��4 5
bool
��5 9
check
��: ?
)
��? @
{
�� 	
return
�� 
new
�� 
ScopeViewModel
�� %
{
�� 
Value
�� 
=
�� 
IdentityServer4
�� '
.
��' (%
IdentityServerConstants
��( ?
.
��? @
StandardScopes
��@ N
.
��N O
OfflineAccess
��O \
,
��\ ]
DisplayName
�� 
=
�� 
ConsentOptions
�� ,
.
��, -&
OfflineAccessDisplayName
��- E
,
��E F
Description
�� 
=
�� 
ConsentOptions
�� ,
.
��, -&
OfflineAccessDescription
��- E
,
��E F
	Emphasize
�� 
=
�� 
true
��  
,
��  !
Checked
�� 
=
�� 
check
�� 
}
�� 
;
�� 
}
�� 	
}
�� 
}�� �	
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Consent\ConsentInputModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public		 

class		 
ConsentInputModel		 "
{

 
public 
string 
Button 
{ 
get "
;" #
set$ '
;' (
}) *
public 
IEnumerable 
< 
string !
>! "
ScopesConsented# 2
{3 4
get5 8
;8 9
set: =
;= >
}? @
public 
bool 
RememberConsent #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
	ReturnUrl 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
Description !
{" #
get$ '
;' (
internal) 1
set2 5
;5 6
}7 8
} 
} �
RD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Consent\ConsentOptions.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
ConsentOptions 
{ 
public		 
static		 
bool		 
EnableOfflineAccess		 .
=		/ 0
true		1 5
;		5 6
public

 
static

 
string

 $
OfflineAccessDisplayName

 5
=

6 7
$str

8 H
;

H I
public 
static 
string $
OfflineAccessDescription 5
=6 7
$str8 ~
;~ 
public 
static 
readonly 
string %%
MustChooseOneErrorMessage& ?
=@ A
$strB i
;i j
public 
static 
readonly 
string %(
InvalidSelectionErrorMessage& B
=C D
$strE X
;X Y
} 
} �
TD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Consent\ConsentViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public		 

class		 
ConsentViewModel		 !
:		" #
ConsentInputModel		$ 5
{

 
public 
string 

ClientName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
	ClientUrl 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
ClientLogoUrl #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
bool  
AllowRememberConsent (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
public 
IEnumerable 
< 
ScopeViewModel )
>) *
IdentityScopes+ 9
{: ;
get< ?
;? @
setA D
;D E
}F G
public 
IEnumerable 
< 
ScopeViewModel )
>) *
	ApiScopes+ 4
{5 6
get7 :
;: ;
set< ?
;? @
}A B
} 
} �
XD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Consent\ProcessConsentResult.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public		 

class		  
ProcessConsentResult		 %
{

 
public 
bool 

IsRedirect 
=> !
RedirectUri" -
!=. 0
null1 5
;5 6
public 
string 
RedirectUri !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
string 
ClientId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
bool 
ShowView 
=> 
	ViewModel  )
!=* ,
null- 1
;1 2
public 
ConsentViewModel 
	ViewModel  )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
public 
bool 
HasValidationError &
=>' )
ValidationError* 9
!=: <
null= A
;A B
public 
string 
ValidationError %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
} 
} �	
RD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Consent\ScopeViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
ScopeViewModel 
{ 
public		 
string		 
Value		 
{		 
get		  
;		  !
set		" %
;		% &
}		' (
public

 
string

 
DisplayName

 !
{

" #
get

$ '
;

' (
set

) ,
;

, -
}

. /
public 
string 
Description !
{" #
get$ '
;' (
set) ,
;, -
}. /
public 
bool 
	Emphasize 
{ 
get  #
;# $
set% (
;( )
}* +
public 
bool 
Required 
{ 
get "
;" #
set$ '
;' (
}) *
public 
bool 
Checked 
{ 
get !
;! "
set# &
;& '
}( )
} 
} �
`D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Device\DeviceAuthorizationInputModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class )
DeviceAuthorizationInputModel .
:/ 0
ConsentInputModel1 B
{ 
public		 
string		 
UserCode		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
}

 
} �
_D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Device\DeviceAuthorizationViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class (
DeviceAuthorizationViewModel -
:. /
ConsentViewModel0 @
{ 
public		 
string		 
UserCode		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
public

 
bool

 
ConfirmUserCode

 #
{

$ %
get

& )
;

) *
set

+ .
;

. /
}

0 1
} 
} ��
SD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Device\DeviceController.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
[ 
	Authorize 
] 
[ 
SecurityHeaders 
] 
public 

class 
DeviceController !
:" #

Controller$ .
{ 
private 
readonly )
IDeviceFlowInteractionService 6
_interaction7 C
;C D
private 
readonly 
IEventService &
_events' .
;. /
private 
readonly 
IOptions !
<! "!
IdentityServerOptions" 7
>7 8
_options9 A
;A B
private 
readonly 
ILogger  
<  !
DeviceController! 1
>1 2
_logger3 :
;: ;
public   
DeviceController   
(    )
IDeviceFlowInteractionService!! )
interaction!!* 5
,!!5 6
IEventService"" 
eventService"" &
,""& '
IOptions## 
<## !
IdentityServerOptions## *
>##* +
options##, 3
,##3 4
ILogger$$ 
<$$ 
DeviceController$$ $
>$$$ %
logger$$& ,
)$$, -
{%% 	
_interaction&& 
=&& 
interaction&& &
;&&& '
_events'' 
='' 
eventService'' "
;''" #
_options(( 
=(( 
options(( 
;(( 
_logger)) 
=)) 
logger)) 
;)) 
}** 	
[,, 	
HttpGet,,	 
],, 
public-- 
async-- 
Task-- 
<-- 
IActionResult-- '
>--' (
Index--) .
(--. /
)--/ 0
{.. 	
string// 
userCodeParamName// $
=//% &
_options//' /
./// 0
Value//0 5
.//5 6
UserInteraction//6 E
.//E F/
#DeviceVerificationUserCodeParameter//F i
;//i j
string00 
userCode00 
=00 
Request00 %
.00% &
Query00& +
[00+ ,
userCodeParamName00, =
]00= >
;00> ?
if11 
(11 
string11 
.11 
IsNullOrWhiteSpace11 )
(11) *
userCode11* 2
)112 3
)113 4
return115 ;
View11< @
(11@ A
$str11A R
)11R S
;11S T
var33 
vm33 
=33 
await33 
BuildViewModelAsync33 .
(33. /
userCode33/ 7
)337 8
;338 9
if44 
(44 
vm44 
==44 
null44 
)44 
return44 "
View44# '
(44' (
$str44( /
)44/ 0
;440 1
vm66 
.66 
ConfirmUserCode66 
=66  
true66! %
;66% &
return77 
View77 
(77 
$str77 .
,77. /
vm770 2
)772 3
;773 4
}88 	
[:: 	
HttpPost::	 
]:: 
[;; 	$
ValidateAntiForgeryToken;;	 !
];;! "
public<< 
async<< 
Task<< 
<<< 
IActionResult<< '
><<' (
UserCodeCapture<<) 8
(<<8 9
string<<9 ?
userCode<<@ H
)<<H I
{== 	
var>> 
vm>> 
=>> 
await>> 
BuildViewModelAsync>> .
(>>. /
userCode>>/ 7
)>>7 8
;>>8 9
if?? 
(?? 
vm?? 
==?? 
null?? 
)?? 
return?? "
View??# '
(??' (
$str??( /
)??/ 0
;??0 1
returnAA 
ViewAA 
(AA 
$strAA .
,AA. /
vmAA0 2
)AA2 3
;AA3 4
}BB 	
[DD 	
HttpPostDD	 
]DD 
[EE 	$
ValidateAntiForgeryTokenEE	 !
]EE! "
publicFF 
asyncFF 
TaskFF 
<FF 
IActionResultFF '
>FF' (
CallbackFF) 1
(FF1 2)
DeviceAuthorizationInputModelFF2 O
modelFFP U
)FFU V
{GG 	
ifHH 
(HH 
modelHH 
==HH 
nullHH 
)HH 
throwHH $
newHH% (!
ArgumentNullExceptionHH) >
(HH> ?
nameofHH? E
(HHE F
modelHHF K
)HHK L
)HHL M
;HHM N
varJJ 
resultJJ 
=JJ 
awaitJJ 
ProcessConsentJJ -
(JJ- .
modelJJ. 3
)JJ3 4
;JJ4 5
ifKK 
(KK 
resultKK 
.KK 
HasValidationErrorKK )
)KK) *
returnKK+ 1
ViewKK2 6
(KK6 7
$strKK7 >
)KK> ?
;KK? @
returnMM 
ViewMM 
(MM 
$strMM !
)MM! "
;MM" #
}NN 	
privatePP 
asyncPP 
TaskPP 
<PP  
ProcessConsentResultPP /
>PP/ 0
ProcessConsentPP1 ?
(PP? @)
DeviceAuthorizationInputModelPP@ ]
modelPP^ c
)PPc d
{QQ 	
varRR 
resultRR 
=RR 
newRR  
ProcessConsentResultRR 1
(RR1 2
)RR2 3
;RR3 4
varTT 
requestTT 
=TT 
awaitTT 
_interactionTT  ,
.TT, -(
GetAuthorizationContextAsyncTT- I
(TTI J
modelTTJ O
.TTO P
UserCodeTTP X
)TTX Y
;TTY Z
ifUU 
(UU 
requestUU 
==UU 
nullUU 
)UU  
returnUU! '
resultUU( .
;UU. /
ConsentResponseWW 
grantedConsentWW *
=WW+ ,
nullWW- 1
;WW1 2
ifZZ 
(ZZ 
modelZZ 
.ZZ 
ButtonZZ 
==ZZ 
$strZZ  $
)ZZ$ %
{[[ 
grantedConsent\\ 
=\\  
new\\! $
ConsentResponse\\% 4
{\\5 6
Error\\7 <
=\\= >
AuthorizationError\\? Q
.\\Q R
AccessDenied\\R ^
}\\_ `
;\\` a
await__ 
_events__ 
.__ 

RaiseAsync__ (
(__( )
new__) ,
ConsentDeniedEvent__- ?
(__? @
User__@ D
.__D E
GetSubjectId__E Q
(__Q R
)__R S
,__S T
request__U \
.__\ ]
Client__] c
.__c d
ClientId__d l
,__l m
request__n u
.__u v
ValidatedResources	__v �
.
__� �
RawScopeValues
__� �
)
__� �
)
__� �
;
__� �
}`` 
elsebb 
ifbb 
(bb 
modelbb 
.bb 
Buttonbb !
==bb" $
$strbb% *
)bb* +
{cc 
ifee 
(ee 
modelee 
.ee 
ScopesConsentedee )
!=ee* ,
nullee- 1
&&ee2 4
modelee5 :
.ee: ;
ScopesConsentedee; J
.eeJ K
AnyeeK N
(eeN O
)eeO P
)eeP Q
{ff 
vargg 
scopesgg 
=gg  
modelgg! &
.gg& '
ScopesConsentedgg' 6
;gg6 7
ifhh 
(hh 
ConsentOptionshh &
.hh& '
EnableOfflineAccesshh' :
==hh; =
falsehh> C
)hhC D
{ii 
scopesjj 
=jj  
scopesjj! '
.jj' (
Wherejj( -
(jj- .
xjj. /
=>jj0 2
xjj3 4
!=jj5 7
IdentityServer4jj8 G
.jjG H#
IdentityServerConstantsjjH _
.jj_ `
StandardScopesjj` n
.jjn o
OfflineAccessjjo |
)jj| }
;jj} ~
}kk 
grantedConsentmm "
=mm# $
newmm% (
ConsentResponsemm) 8
{nn 
RememberConsentoo '
=oo( )
modeloo* /
.oo/ 0
RememberConsentoo0 ?
,oo? @!
ScopesValuesConsentedpp -
=pp. /
scopespp0 6
.pp6 7
ToArraypp7 >
(pp> ?
)pp? @
,pp@ A
Descriptionqq #
=qq$ %
modelqq& +
.qq+ ,
Descriptionqq, 7
}rr 
;rr 
awaituu 
_eventsuu !
.uu! "

RaiseAsyncuu" ,
(uu, -
newuu- 0
ConsentGrantedEventuu1 D
(uuD E
UseruuE I
.uuI J
GetSubjectIduuJ V
(uuV W
)uuW X
,uuX Y
requestuuZ a
.uua b
Clientuub h
.uuh i
ClientIduui q
,uuq r
requestuus z
.uuz {
ValidatedResources	uu{ �
.
uu� �
RawScopeValues
uu� �
,
uu� �
grantedConsent
uu� �
.
uu� �#
ScopesValuesConsented
uu� �
,
uu� �
grantedConsent
uu� �
.
uu� �
RememberConsent
uu� �
)
uu� �
)
uu� �
;
uu� �
}vv 
elseww 
{xx 
resultyy 
.yy 
ValidationErroryy *
=yy+ ,
ConsentOptionsyy- ;
.yy; <%
MustChooseOneErrorMessageyy< U
;yyU V
}zz 
}{{ 
else|| 
{}} 
result~~ 
.~~ 
ValidationError~~ &
=~~' (
ConsentOptions~~) 7
.~~7 8(
InvalidSelectionErrorMessage~~8 T
;~~T U
} 
if
�� 
(
�� 
grantedConsent
�� 
!=
�� !
null
��" &
)
��& '
{
�� 
await
�� 
_interaction
�� "
.
��" # 
HandleRequestAsync
��# 5
(
��5 6
model
��6 ;
.
��; <
UserCode
��< D
,
��D E
grantedConsent
��F T
)
��T U
;
��U V
result
�� 
.
�� 
RedirectUri
�� "
=
��# $
model
��% *
.
��* +
	ReturnUrl
��+ 4
;
��4 5
result
�� 
.
�� 
ClientId
�� 
=
��  !
request
��" )
.
��) *
Client
��* 0
.
��0 1
ClientId
��1 9
;
��9 :
}
�� 
else
�� 
{
�� 
result
�� 
.
�� 
	ViewModel
��  
=
��! "
await
��# (!
BuildViewModelAsync
��) <
(
��< =
model
��= B
.
��B C
UserCode
��C K
,
��K L
model
��M R
)
��R S
;
��S T
}
�� 
return
�� 
result
�� 
;
�� 
}
�� 	
private
�� 
async
�� 
Task
�� 
<
�� *
DeviceAuthorizationViewModel
�� 7
>
��7 8!
BuildViewModelAsync
��9 L
(
��L M
string
��M S
userCode
��T \
,
��\ ]+
DeviceAuthorizationInputModel
��^ {
model��| �
=��� �
null��� �
)��� �
{
�� 	
var
�� 
request
�� 
=
�� 
await
�� 
_interaction
��  ,
.
��, -*
GetAuthorizationContextAsync
��- I
(
��I J
userCode
��J R
)
��R S
;
��S T
if
�� 
(
�� 
request
�� 
!=
�� 
null
�� 
)
��  
{
�� 
return
�� $
CreateConsentViewModel
�� -
(
��- .
userCode
��. 6
,
��6 7
model
��8 =
,
��= >
request
��? F
)
��F G
;
��G H
}
�� 
return
�� 
null
�� 
;
�� 
}
�� 	
private
�� *
DeviceAuthorizationViewModel
�� ,$
CreateConsentViewModel
��- C
(
��C D
string
��D J
userCode
��K S
,
��S T+
DeviceAuthorizationInputModel
��U r
model
��s x
,
��x y-
DeviceFlowAuthorizationRequest��z �
request��� �
)��� �
{
�� 	
var
�� 
vm
�� 
=
�� 
new
�� *
DeviceAuthorizationViewModel
�� 5
{
�� 
UserCode
�� 
=
�� 
userCode
�� #
,
��# $
Description
�� 
=
�� 
model
�� #
?
��# $
.
��$ %
Description
��% 0
,
��0 1
RememberConsent
�� 
=
��  !
model
��" '
?
��' (
.
��( )
RememberConsent
��) 8
??
��9 ;
true
��< @
,
��@ A
ScopesConsented
�� 
=
��  !
model
��" '
?
��' (
.
��( )
ScopesConsented
��) 8
??
��9 ;

Enumerable
��< F
.
��F G
Empty
��G L
<
��L M
string
��M S
>
��S T
(
��T U
)
��U V
,
��V W

ClientName
�� 
=
�� 
request
�� $
.
��$ %
Client
��% +
.
��+ ,

ClientName
��, 6
??
��7 9
request
��: A
.
��A B
Client
��B H
.
��H I
ClientId
��I Q
,
��Q R
	ClientUrl
�� 
=
�� 
request
�� #
.
��# $
Client
��$ *
.
��* +
	ClientUri
��+ 4
,
��4 5
ClientLogoUrl
�� 
=
�� 
request
��  '
.
��' (
Client
��( .
.
��. /
LogoUri
��/ 6
,
��6 7"
AllowRememberConsent
�� $
=
��% &
request
��' .
.
��. /
Client
��/ 5
.
��5 6"
AllowRememberConsent
��6 J
}
�� 
;
�� 
vm
�� 
.
�� 
IdentityScopes
�� 
=
�� 
request
��  '
.
��' ( 
ValidatedResources
��( :
.
��: ;
	Resources
��; D
.
��D E
IdentityResources
��E V
.
��V W
Select
��W ]
(
��] ^
x
��^ _
=>
��` b"
CreateScopeViewModel
��c w
(
��w x
x
��x y
,
��y z
vm
��{ }
.
��} ~
ScopesConsented��~ �
.��� �
Contains��� �
(��� �
x��� �
.��� �
Name��� �
)��� �
||��� �
model��� �
==��� �
null��� �
)��� �
)��� �
.��� �
ToArray��� �
(��� �
)��� �
;��� �
var
�� 
	apiScopes
�� 
=
�� 
new
�� 
List
��  $
<
��$ %
ScopeViewModel
��% 3
>
��3 4
(
��4 5
)
��5 6
;
��6 7
foreach
�� 
(
�� 
var
�� 
parsedScope
�� $
in
��% '
request
��( /
.
��/ 0 
ValidatedResources
��0 B
.
��B C
ParsedScopes
��C O
)
��O P
{
�� 
var
�� 
apiScope
�� 
=
�� 
request
�� &
.
��& ' 
ValidatedResources
��' 9
.
��9 :
	Resources
��: C
.
��C D
FindApiScope
��D P
(
��P Q
parsedScope
��Q \
.
��\ ]

ParsedName
��] g
)
��g h
;
��h i
if
�� 
(
�� 
apiScope
�� 
!=
�� 
null
��  $
)
��$ %
{
�� 
var
�� 
scopeVm
�� 
=
��  !"
CreateScopeViewModel
��" 6
(
��6 7
parsedScope
��7 B
,
��B C
apiScope
��D L
,
��L M
vm
��N P
.
��P Q
ScopesConsented
��Q `
.
��` a
Contains
��a i
(
��i j
parsedScope
��j u
.
��u v
RawValue
��v ~
)
��~ 
||��� �
model��� �
==��� �
null��� �
)��� �
;��� �
	apiScopes
�� 
.
�� 
Add
�� !
(
��! "
scopeVm
��" )
)
��) *
;
��* +
}
�� 
}
�� 
if
�� 
(
�� 
ConsentOptions
�� 
.
�� !
EnableOfflineAccess
�� 2
&&
��3 5
request
��6 =
.
��= > 
ValidatedResources
��> P
.
��P Q
	Resources
��Q Z
.
��Z [
OfflineAccess
��[ h
)
��h i
{
�� 
	apiScopes
�� 
.
�� 
Add
�� 
(
�� #
GetOfflineAccessScope
�� 3
(
��3 4
vm
��4 6
.
��6 7
ScopesConsented
��7 F
.
��F G
Contains
��G O
(
��O P
IdentityServer4
��P _
.
��_ `%
IdentityServerConstants
��` w
.
��w x
StandardScopes��x �
.��� �
OfflineAccess��� �
)��� �
||��� �
model��� �
==��� �
null��� �
)��� �
)��� �
;��� �
}
�� 
vm
�� 
.
�� 
	ApiScopes
�� 
=
�� 
	apiScopes
�� $
;
��$ %
return
�� 
vm
�� 
;
�� 
}
�� 	
private
�� 
ScopeViewModel
�� "
CreateScopeViewModel
�� 3
(
��3 4
IdentityResource
��4 D
identity
��E M
,
��M N
bool
��O S
check
��T Y
)
��Y Z
{
�� 	
return
�� 
new
�� 
ScopeViewModel
�� %
{
�� 
Value
�� 
=
�� 
identity
��  
.
��  !
Name
��! %
,
��% &
DisplayName
�� 
=
�� 
identity
�� &
.
��& '
DisplayName
��' 2
??
��3 5
identity
��6 >
.
��> ?
Name
��? C
,
��C D
Description
�� 
=
�� 
identity
�� &
.
��& '
Description
��' 2
,
��2 3
	Emphasize
�� 
=
�� 
identity
�� $
.
��$ %
	Emphasize
��% .
,
��. /
Required
�� 
=
�� 
identity
�� #
.
��# $
Required
��$ ,
,
��, -
Checked
�� 
=
�� 
check
�� 
||
��  "
identity
��# +
.
��+ ,
Required
��, 4
}
�� 
;
�� 
}
�� 	
public
�� 
ScopeViewModel
�� "
CreateScopeViewModel
�� 2
(
��2 3
ParsedScopeValue
��3 C
parsedScopeValue
��D T
,
��T U
ApiScope
��V ^
apiScope
��_ g
,
��g h
bool
��i m
check
��n s
)
��s t
{
�� 	
return
�� 
new
�� 
ScopeViewModel
�� %
{
�� 
Value
�� 
=
�� 
parsedScopeValue
�� (
.
��( )
RawValue
��) 1
,
��1 2
DisplayName
�� 
=
�� 
apiScope
�� &
.
��& '
DisplayName
��' 2
??
��3 5
apiScope
��6 >
.
��> ?
Name
��? C
,
��C D
Description
�� 
=
�� 
apiScope
�� &
.
��& '
Description
��' 2
,
��2 3
	Emphasize
�� 
=
�� 
apiScope
�� $
.
��$ %
	Emphasize
��% .
,
��. /
Required
�� 
=
�� 
apiScope
�� #
.
��# $
Required
��$ ,
,
��, -
Checked
�� 
=
�� 
check
�� 
||
��  "
apiScope
��# +
.
��+ ,
Required
��, 4
}
�� 
;
�� 
}
�� 	
private
�� 
ScopeViewModel
�� #
GetOfflineAccessScope
�� 4
(
��4 5
bool
��5 9
check
��: ?
)
��? @
{
�� 	
return
�� 
new
�� 
ScopeViewModel
�� %
{
�� 
Value
�� 
=
�� 
IdentityServer4
�� '
.
��' (%
IdentityServerConstants
��( ?
.
��? @
StandardScopes
��@ N
.
��N O
OfflineAccess
��O \
,
��\ ]
DisplayName
�� 
=
�� 
ConsentOptions
�� ,
.
��, -&
OfflineAccessDisplayName
��- E
,
��E F
Description
�� 
=
�� 
ConsentOptions
�� ,
.
��, -&
OfflineAccessDescription
��- E
,
��E F
	Emphasize
�� 
=
�� 
true
��  
,
��  !
Checked
�� 
=
�� 
check
�� 
}
�� 
;
�� 
}
�� 	
}
�� 
}�� �
]D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Diagnostics\DiagnosticsController.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
[ 
SecurityHeaders 
] 
[ 
	Authorize 
] 
public 

class !
DiagnosticsController &
:' (

Controller) 3
{ 
public 
async 
Task 
< 
IActionResult '
>' (
Index) .
(. /
)/ 0
{ 	
var 
localAddresses 
=  
new! $
string% +
[+ ,
], -
{. /
$str0 ;
,; <
$str= B
,B C
HttpContextD O
.O P

ConnectionP Z
.Z [
LocalIpAddress[ i
.i j
ToStringj r
(r s
)s t
}u v
;v w
if 
( 
! 
localAddresses 
.  
Contains  (
(( )
HttpContext) 4
.4 5

Connection5 ?
.? @
RemoteIpAddress@ O
.O P
ToStringP X
(X Y
)Y Z
)Z [
)[ \
{ 
return 
NotFound 
(  
)  !
;! "
} 
var 
model 
= 
new  
DiagnosticsViewModel 0
(0 1
await1 6
HttpContext7 B
.B C
AuthenticateAsyncC T
(T U
)U V
)V W
;W X
return 
View 
( 
model 
) 
; 
} 	
} 
} �
\D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Diagnostics\DiagnosticsViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class  
DiagnosticsViewModel %
{ 
public  
DiagnosticsViewModel #
(# $
AuthenticateResult$ 6
result7 =
)= >
{ 	
AuthenticateResult 
=  
result! '
;' (
if 
( 
result 
. 

Properties !
.! "
Items" '
.' (
ContainsKey( 3
(3 4
$str4 A
)A B
)B C
{ 
var 
encoded 
= 
result $
.$ %

Properties% /
./ 0
Items0 5
[5 6
$str6 C
]C D
;D E
var 
bytes 
= 
	Base64Url %
.% &
Decode& ,
(, -
encoded- 4
)4 5
;5 6
var 
value 
= 
Encoding $
.$ %
UTF8% )
.) *
	GetString* 3
(3 4
bytes4 9
)9 :
;: ;
Clients 
= 
JsonConvert %
.% &
DeserializeObject& 7
<7 8
string8 >
[> ?
]? @
>@ A
(A B
valueB G
)G H
;H I
} 
} 	
public 
AuthenticateResult !
AuthenticateResult" 4
{5 6
get7 :
;: ;
}< =
public 
IEnumerable 
< 
string !
>! "
Clients# *
{+ ,
get- 0
;0 1
}2 3
=4 5
new6 9
List: >
<> ?
string? E
>E F
(F G
)G H
;H I
} 
}   �

FD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Extensions.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public		 

static		 
class		 

Extensions		 "
{

 
public 
static 
async 
Task  
<  !
bool! %
>% &
IsPkceClientAsync' 8
(8 9
this9 =
IClientStore> J
storeK P
,P Q
stringR X
	client_idY b
)b c
{ 	
if 
( 
! 
string 
. 
IsNullOrWhiteSpace *
(* +
	client_id+ 4
)4 5
)5 6
{ 
var 
client 
= 
await "
store# (
.( )&
FindEnabledClientByIdAsync) C
(C D
	client_idD M
)M N
;N O
return 
client 
? 
. 
RequirePkce *
==+ -
true. 2
;2 3
} 
return 
false 
; 
} 	
} 
} �1
SD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Grants\GrantsController.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
[ 
SecurityHeaders 
] 
[ 
	Authorize 
] 
public 

class 
GrantsController !
:" #

Controller$ .
{ 
private 
readonly -
!IIdentityServerInteractionService :
_interaction; G
;G H
private 
readonly 
IClientStore %
_clients& .
;. /
private 
readonly 
IResourceStore '

_resources( 2
;2 3
private 
readonly 
IEventService &
_events' .
;. /
public 
GrantsController 
(  -
!IIdentityServerInteractionService  A
interactionB M
,M N
IClientStore 
clients  
,  !
IResourceStore 
	resources $
,$ %
IEventService   
events    
)    !
{!! 	
_interaction"" 
="" 
interaction"" &
;""& '
_clients## 
=## 
clients## 
;## 

_resources$$ 
=$$ 
	resources$$ "
;$$" #
_events%% 
=%% 
events%% 
;%% 
}&& 	
[++ 	
HttpGet++	 
]++ 
public,, 
async,, 
Task,, 
<,, 
IActionResult,, '
>,,' (
Index,,) .
(,,. /
),,/ 0
{-- 	
return.. 
View.. 
(.. 
$str.. 
,..  
await..! &
BuildViewModelAsync..' :
(..: ;
)..; <
)..< =
;..= >
}// 	
[44 	
HttpPost44	 
]44 
[55 	$
ValidateAntiForgeryToken55	 !
]55! "
public66 
async66 
Task66 
<66 
IActionResult66 '
>66' (
Revoke66) /
(66/ 0
string660 6
clientId667 ?
)66? @
{77 	
await88 
_interaction88 
.88 "
RevokeUserConsentAsync88 5
(885 6
clientId886 >
)88> ?
;88? @
await99 
_events99 
.99 

RaiseAsync99 $
(99$ %
new99% (
GrantsRevokedEvent99) ;
(99; <
User99< @
.99@ A
GetSubjectId99A M
(99M N
)99N O
,99O P
clientId99Q Y
)99Y Z
)99Z [
;99[ \
return;; 
RedirectToAction;; #
(;;# $
$str;;$ +
);;+ ,
;;;, -
}<< 	
private>> 
async>> 
Task>> 
<>> 
GrantsViewModel>> *
>>>* +
BuildViewModelAsync>>, ?
(>>? @
)>>@ A
{?? 	
var@@ 
grants@@ 
=@@ 
await@@ 
_interaction@@ +
.@@+ ,!
GetAllUserGrantsAsync@@, A
(@@A B
)@@B C
;@@C D
varBB 
listBB 
=BB 
newBB 
ListBB 
<BB  
GrantViewModelBB  .
>BB. /
(BB/ 0
)BB0 1
;BB1 2
foreachCC 
(CC 
varCC 
grantCC 
inCC !
grantsCC" (
)CC( )
{DD 
varEE 
clientEE 
=EE 
awaitEE "
_clientsEE# +
.EE+ ,
FindClientByIdAsyncEE, ?
(EE? @
grantEE@ E
.EEE F
ClientIdEEF N
)EEN O
;EEO P
ifFF 
(FF 
clientFF 
!=FF 
nullFF "
)FF" #
{GG 
varHH 
	resourcesHH !
=HH" #
awaitHH$ )

_resourcesHH* 4
.HH4 5%
FindResourcesByScopeAsyncHH5 N
(HHN O
grantHHO T
.HHT U
ScopesHHU [
)HH[ \
;HH\ ]
varJJ 
itemJJ 
=JJ 
newJJ "
GrantViewModelJJ# 1
(JJ1 2
)JJ2 3
{KK 
ClientIdLL  
=LL! "
clientLL# )
.LL) *
ClientIdLL* 2
,LL2 3

ClientNameMM "
=MM# $
clientMM% +
.MM+ ,

ClientNameMM, 6
??MM7 9
clientMM: @
.MM@ A
ClientIdMMA I
,MMI J
ClientLogoUrlNN %
=NN& '
clientNN( .
.NN. /
LogoUriNN/ 6
,NN6 7
	ClientUrlOO !
=OO" #
clientOO$ *
.OO* +
	ClientUriOO+ 4
,OO4 5
CreatedPP 
=PP  !
grantPP" '
.PP' (
CreationTimePP( 4
,PP4 5
ExpiresQQ 
=QQ  !
grantQQ" '
.QQ' (

ExpirationQQ( 2
,QQ2 3
IdentityGrantNamesRR *
=RR+ ,
	resourcesRR- 6
.RR6 7
IdentityResourcesRR7 H
.RRH I
SelectRRI O
(RRO P
xRRP Q
=>RRR T
xRRU V
.RRV W
DisplayNameRRW b
??RRc e
xRRf g
.RRg h
NameRRh l
)RRl m
.RRm n
ToArrayRRn u
(RRu v
)RRv w
,RRw x
ApiGrantNamesSS %
=SS& '
	resourcesSS( 1
.SS1 2
ApiResourcesSS2 >
.SS> ?
SelectSS? E
(SSE F
xSSF G
=>SSH J
xSSK L
.SSL M
DisplayNameSSM X
??SSY [
xSS\ ]
.SS] ^
NameSS^ b
)SSb c
.SSc d
ToArraySSd k
(SSk l
)SSl m
}TT 
;TT 
listVV 
.VV 
AddVV 
(VV 
itemVV !
)VV! "
;VV" #
}WW 
}XX 
returnZZ 
newZZ 
GrantsViewModelZZ &
{[[ 
Grants\\ 
=\\ 
list\\ 
}]] 
;]] 
}^^ 	
}__ 
}`` �
RD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Grants\GrantsViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{		 
public

 

class

 
GrantsViewModel

  
{ 
public 
IEnumerable 
< 
GrantViewModel )
>) *
Grants+ 1
{2 3
get4 7
;7 8
set9 <
;< =
}> ?
} 
public 

class 
GrantViewModel 
{ 
public 
string 
ClientId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 

ClientName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
	ClientUrl 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
ClientLogoUrl #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
DateTime 
Created 
{  !
get" %
;% &
set' *
;* +
}, -
public 
DateTime 
? 
Expires  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
IEnumerable 
< 
string !
>! "
IdentityGrantNames# 5
{6 7
get8 ;
;; <
set= @
;@ A
}B C
public 
IEnumerable 
< 
string !
>! "
ApiGrantNames# 0
{1 2
get3 6
;6 7
set8 ;
;; <
}= >
} 
} �
OD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Home\ErrorViewModel.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public		 

class		 
ErrorViewModel		 
{

 
public 
ErrorMessage 
Error !
{" #
get$ '
;' (
set) ,
;, -
}. /
} 
} �
OD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\Home\HomeController.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
[ 
SecurityHeaders 
] 
[ 
AllowAnonymous 
] 
public 

class 
HomeController 
:  !

Controller" ,
{ 
private 
readonly -
!IIdentityServerInteractionService :
_interaction; G
;G H
private 
readonly 
IWebHostEnvironment ,
_environment- 9
;9 :
private 
readonly 
ILogger  
_logger! (
;( )
public 
HomeController 
( -
!IIdentityServerInteractionService ?
interaction@ K
,K L
IWebHostEnvironmentM `
environmenta l
,l m
ILoggern u
<u v
HomeController	v �
>
� �
logger
� �
)
� �
{ 	
_interaction 
= 
interaction &
;& '
_environment 
= 
environment &
;& '
_logger 
= 
logger 
; 
} 	
public 
IActionResult 
Index "
(" #
)# $
{ 	
if   
(   
_environment   
.   
IsDevelopment   *
(  * +
)  + ,
)  , -
{!! 
return## 
View## 
(## 
)## 
;## 
}$$ 
_logger&& 
.&& 
LogInformation&& "
(&&" #
$str&&# W
)&&W X
;&&X Y
return'' 
NotFound'' 
('' 
)'' 
;'' 
}(( 	
public-- 
async-- 
Task-- 
<-- 
IActionResult-- '
>--' (
Error--) .
(--. /
string--/ 5
errorId--6 =
)--= >
{.. 	
var// 
vm// 
=// 
new// 
ErrorViewModel// '
(//' (
)//( )
;//) *
var22 
message22 
=22 
await22 
_interaction22  ,
.22, - 
GetErrorContextAsync22- A
(22A B
errorId22B I
)22I J
;22J K
if33 
(33 
message33 
!=33 
null33 
)33  
{44 
vm55 
.55 
Error55 
=55 
message55 "
;55" #
if77 
(77 
!77 
_environment77 !
.77! "
IsDevelopment77" /
(77/ 0
)770 1
)771 2
{88 
message:: 
.:: 
ErrorDescription:: ,
=::- .
null::/ 3
;::3 4
};; 
}<< 
return>> 
View>> 
(>> 
$str>> 
,>>  
vm>>! #
)>># $
;>>$ %
}?? 	
}@@ 
}AA �
TD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\SecurityHeadersAttribute.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{		 
public

 

class

 $
SecurityHeadersAttribute

 )
:

* +!
ActionFilterAttribute

, A
{ 
public 
override 
void 
OnResultExecuting .
(. /"
ResultExecutingContext/ E
contextF M
)M N
{ 	
var 
result 
= 
context  
.  !
Result! '
;' (
if 
( 
result 
is 

ViewResult $
)$ %
{ 
if 
( 
! 
context 
. 
HttpContext (
.( )
Response) 1
.1 2
Headers2 9
.9 :
ContainsKey: E
(E F
$strF ^
)^ _
)_ `
{ 
context 
. 
HttpContext '
.' (
Response( 0
.0 1
Headers1 8
.8 9
Add9 <
(< =
$str= U
,U V
$strW `
)` a
;a b
} 
if 
( 
! 
context 
. 
HttpContext (
.( )
Response) 1
.1 2
Headers2 9
.9 :
ContainsKey: E
(E F
$strF W
)W X
)X Y
{ 
context 
. 
HttpContext '
.' (
Response( 0
.0 1
Headers1 8
.8 9
Add9 <
(< =
$str= N
,N O
$strP \
)\ ]
;] ^
} 
var 
csp 
= 
$str	 �
;
� �
if&& 
(&& 
!&& 
context&& 
.&& 
HttpContext&& (
.&&( )
Response&&) 1
.&&1 2
Headers&&2 9
.&&9 :
ContainsKey&&: E
(&&E F
$str&&F _
)&&_ `
)&&` a
{'' 
context(( 
.(( 
HttpContext(( '
.((' (
Response((( 0
.((0 1
Headers((1 8
.((8 9
Add((9 <
(((< =
$str((= V
,((V W
csp((X [
)(([ \
;((\ ]
})) 
if++ 
(++ 
!++ 
context++ 
.++ 
HttpContext++ (
.++( )
Response++) 1
.++1 2
Headers++2 9
.++9 :
ContainsKey++: E
(++E F
$str++F a
)++a b
)++b c
{,, 
context-- 
.-- 
HttpContext-- '
.--' (
Response--( 0
.--0 1
Headers--1 8
.--8 9
Add--9 <
(--< =
$str--= X
,--X Y
csp--Z ]
)--] ^
;--^ _
}.. 
var11 
referrer_policy11 #
=11$ %
$str11& 3
;113 4
if22 
(22 
!22 
context22 
.22 
HttpContext22 (
.22( )
Response22) 1
.221 2
Headers222 9
.229 :
ContainsKey22: E
(22E F
$str22F W
)22W X
)22X Y
{33 
context44 
.44 
HttpContext44 '
.44' (
Response44( 0
.440 1
Headers441 8
.448 9
Add449 <
(44< =
$str44= N
,44N O
referrer_policy44P _
)44_ `
;44` a
}55 
}66 
}77 	
}88 
}99 �%
ED:\Development\FJT\FJT-DEV\FJT.IdentityServer\Quickstart\TestUsers.cs
	namespace 	
IdentityServerHost
 
. 

Quickstart '
.' (
UI( *
{ 
public 

class 
	TestUsers 
{ 
public 
static 
List 
< 
TestUser #
># $
Users% *
{ 	
get 
{ 
var 
address 
= 
new !
{ 
street_address "
=# $
$str% 5
,5 6
locality 
= 
$str +
,+ ,
postal_code 
=  !
$num" '
,' (
country 
= 
$str '
} 
; 
return 
new 
List 
<  
TestUser  (
>( )
{ 
new 
TestUser  
{ 
	SubjectId   !
=  " #
$str  $ ,
,  , -
Username!!  
=!!! "
$str!!# *
,!!* +
Password""  
=""! "
$str""# *
,""* +
Claims## 
=##  
{$$ 
new%% 
Claim%%  %
(%%% &
JwtClaimTypes%%& 3
.%%3 4
Name%%4 8
,%%8 9
$str%%: G
)%%G H
,%%H I
new&& 
Claim&&  %
(&&% &
JwtClaimTypes&&& 3
.&&3 4
	GivenName&&4 =
,&&= >
$str&&? F
)&&F G
,&&G H
new'' 
Claim''  %
(''% &
JwtClaimTypes''& 3
.''3 4

FamilyName''4 >
,''> ?
$str''@ G
)''G H
,''H I
new(( 
Claim((  %
(((% &
JwtClaimTypes((& 3
.((3 4
Email((4 9
,((9 :
$str((; Q
)((Q R
,((R S
new)) 
Claim))  %
())% &
JwtClaimTypes))& 3
.))3 4
EmailVerified))4 A
,))A B
$str))C I
,))I J
ClaimValueTypes))K Z
.))Z [
Boolean))[ b
)))b c
,))c d
new** 
Claim**  %
(**% &
JwtClaimTypes**& 3
.**3 4
WebSite**4 ;
,**; <
$str**= O
)**O P
,**P Q
new++ 
Claim++  %
(++% &
JwtClaimTypes++& 3
.++3 4
Address++4 ;
,++; <
JsonSerializer++= K
.++K L
	Serialize++L U
(++U V
address++V ]
)++] ^
,++^ _#
IdentityServerConstants++` w
.++w x
ClaimValueTypes	++x �
.
++� �
Json
++� �
)
++� �
},, 
}-- 
,-- 
new.. 
TestUser..  
{// 
	SubjectId00 !
=00" #
$str00$ .
,00. /
Username11  
=11! "
$str11# (
,11( )
Password22  
=22! "
$str22# (
,22( )
Claims33 
=33  
{44 
new55 
Claim55  %
(55% &
JwtClaimTypes55& 3
.553 4
Name554 8
,558 9
$str55: E
)55E F
,55F G
new66 
Claim66  %
(66% &
JwtClaimTypes66& 3
.663 4
	GivenName664 =
,66= >
$str66? D
)66D E
,66E F
new77 
Claim77  %
(77% &
JwtClaimTypes77& 3
.773 4

FamilyName774 >
,77> ?
$str77@ G
)77G H
,77H I
new88 
Claim88  %
(88% &
JwtClaimTypes88& 3
.883 4
Email884 9
,889 :
$str88; O
)88O P
,88P Q
new99 
Claim99  %
(99% &
JwtClaimTypes99& 3
.993 4
EmailVerified994 A
,99A B
$str99C I
,99I J
ClaimValueTypes99K Z
.99Z [
Boolean99[ b
)99b c
,99c d
new:: 
Claim::  %
(::% &
JwtClaimTypes::& 3
.::3 4
WebSite::4 ;
,::; <
$str::= M
)::M N
,::N O
new;; 
Claim;;  %
(;;% &
JwtClaimTypes;;& 3
.;;3 4
Address;;4 ;
,;;; <
JsonSerializer;;= K
.;;K L
	Serialize;;L U
(;;U V
address;;V ]
);;] ^
,;;^ _#
IdentityServerConstants;;` w
.;;w x
ClaimValueTypes	;;x �
.
;;� �
Json
;;� �
)
;;� �
}<< 
}== 
}>> 
;>> 
}?? 
}@@ 	
}AA 
}BB �.
GD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\DbReository.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
{ 
public 

class 
DbReository 
: 
IDbRepository ,
{ 
private 
readonly (
IFJTIdentityManualConnection 5)
_iFJTIdentityManualConnection6 S
;S T
private 
readonly 
IDataMapper $
_idataMapper% 1
;1 2
public 
DbReository 
( (
IFJTIdentityManualConnection 7(
iFJTIdentityManualConnection8 T
,T U
IDataMapperV a
idataMapperb m
)m n
{ 	)
_iFJTIdentityManualConnection )
=* +(
iFJTIdentityManualConnection, H
;H I
_idataMapper 
= 
idataMapper &
;& '
} 	
public!! 
async!! 
Task!! 
<!!  
AgreementListDetails!! .
>!!. /
AgreementListAsync!!0 B
(!!B C
string!!C I
sql!!J M
,!!M N
MySqlParameter!!O ]
[!!] ^
]!!^ _

parameters!!` j
)!!j k
{"" 	 
AgreementListDetails##  
results##! (
=##) *
await##+ 0)
_iFJTIdentityManualConnection##1 N
.##N O
ExecuteReaderAsync##O a
(##a b
_idataMapper##b n
.##n o'
AgreementListDetailsMapper	##o �
,
##� �
sql
##� �
,
##� �

parameters
##� �
)
##� �
;
##� �
return$$ 
results$$ 
;$$ 
}%% 	
public'' 
async'' 
Task'' 
<'' %
GetAgreementDetailDetails'' 3
>''3 4(
GetAgreementDetailsListAsync''5 Q
(''Q R
string''R X
sql''Y \
,''\ ]
MySqlParameter''^ l
	parameter''m v
)''v w
{(( 	%
GetAgreementDetailDetails)) %
results))& -
=)). /
await))0 5)
_iFJTIdentityManualConnection))6 S
.))S T
ExecuteReaderAsync))T f
())f g
_idataMapper))g s
.))s t,
GetAgreementDetailDetailsMapper	))t �
,
))� �
sql
))� �
,
))� �
	parameter
))� �
)
))� �
;
))� �
return** 
results** 
;** 
}++ 	
public-- 
async-- 
Task-- 
<-- *
UserSignUpAgreementListDetails-- 8
>--8 9(
UserSignUpAgreementListAsync--: V
(--V W
string--W ]
sql--^ a
,--a b
MySqlParameter--c q
[--q r
]--r s

parameters--t ~
)--~ 
{.. 	*
UserSignUpAgreementListDetails// *
results//+ 2
=//3 4
await//5 :)
_iFJTIdentityManualConnection//; X
.//X Y
ExecuteReaderAsync//Y k
(//k l
_idataMapper//l x
.//x y1
$UserSignUpAgreementListDetailsMapper	//y �
,
//� �
sql
//� �
,
//� �

parameters
//� �
)
//� �
;
//� �
return00 
results00 
;00 
}11 	
public33 
async33 
Task33 
<33 -
!ArchieveVersionDetailsListDetails33 ;
>33; <+
ArchieveVersionDetailsListAsync33= \
(33\ ]
string33] c
sql33d g
,33g h
MySqlParameter33i w
[33w x
]33x y

parameters	33z �
)
33� �
{44 	-
!ArchieveVersionDetailsListDetails55 -
results55. 5
=556 7
await558 =)
_iFJTIdentityManualConnection55> [
.55[ \
ExecuteReaderAsync55\ n
(55n o
_idataMapper55o {
.55{ |4
'ArchieveVersionDetailsListDetailsMapper	55| �
,
55� �
sql
55� �
,
55� �

parameters
55� �
)
55� �
;
55� �
return66 
results66 
;66 
}77 	
public99 
async99 
Task99 
<99 &
GetAgreedUserListVMDetails99 4
>994 5"
GetAgreedUserListAsync996 L
(99L M
string99M S
sql99T W
,99W X
MySqlParameter99Y g
[99g h
]99h i

parameters99j t
)99t u
{:: 	&
GetAgreedUserListVMDetails;; &
results;;' .
=;;/ 0
await;;1 6)
_iFJTIdentityManualConnection;;7 T
.;;T U
ExecuteReaderAsync;;U g
(;;g h
_idataMapper;;h t
.;;t u-
 GetAgreedUserListVMDetailsMapper	;;u �
,
;;� �
sql
;;� �
,
;;� �

parameters
;;� �
)
;;� �
;
;;� �
return<< 
results<< 
;<< 
}== 	
public?? 
async?? 
Task?? 
<?? -
!DownloadAgreementDetailsVMDetails?? ;
>??; <)
DownloadAgreementDetailsAsync??= Z
(??Z [
string??[ a
sql??b e
,??e f
MySqlParameter??g u
[??u v
]??v w

parameters	??x �
)
??� �
{@@ 	-
!DownloadAgreementDetailsVMDetailsAA -
resultsAA. 5
=AA6 7
awaitAA8 =)
_iFJTIdentityManualConnectionAA> [
.AA[ \
ExecuteReaderAsyncAA\ n
(AAn o
_idataMapperAAo {
.AA{ |4
'DownloadAgreementDetailsVMDetailsMapper	AA| �
,
AA� �
sql
AA� �
,
AA� �

parameters
AA� �
)
AA� �
;
AA� �
returnBB 
resultsBB 
;BB 
}CC 	
}EE 
}FF �
QD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\DynamicMessageService.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
{ 
public 

class !
DynamicMessageService &
:' ("
IDynamicMessageService) ?
{ 
private 
readonly 
IMongoCollection )
<) *
DynamicMessage* 8
>8 9
_dynamicMessages: J
;J K
private 
readonly 
MongoCollections )
_mongoCollections* ;
;; <
private 
readonly 
IMongoDBContext (
_mongoDBContext) 8
;8 9
public !
DynamicMessageService $
($ %
IOptions% -
<- .
MongoDBConfig. ;
>; <
mongoDBConfig= J
,J K
IMongoDBContextL [
mongoDBContext\ j
)j k
{ 	
_mongoDBContext 
= 
mongoDBContext ,
;, -
_mongoCollections 
= 
mongoDBConfig  -
.- .
Value. 3
.3 4
MongoCollections4 D
;D E
var 
	dbContext 
= 
_mongoDBContext +
.+ ,
GetDBContext, 8
(8 9
)9 :
;: ;
_dynamicMessages 
= 
	dbContext (
.( )
GetCollection) 6
<6 7
DynamicMessage7 E
>E F
(F G
_mongoCollectionsG X
.X Y(
DynamicMessageCollectionNameY u
)u v
;v w
} 	
public   
async   
Task   
<   
DynamicMessage   (
>  ( )
Get  * -
(  - .
string  . 4

messageKey  5 ?
)  ? @
=>  A C
await!! 
_dynamicMessages!! "
.!!" #
Find!!# '
(!!' (
x!!( )
=>!!* ,
x!!- .
.!!. /

messageKey!!/ 9
==!!: <

messageKey!!= G
&&!!H J
x!!K L
.!!L M
	isDeleted!!M V
==!!W Y
false!!Z _
)!!_ `
.!!` a
FirstOrDefaultAsync!!a t
(!!t u
)!!u v
??!!w y
new!!z }
DynamicMessage	!!~ �
{
!!� �
messageType
!!� �
=
!!� �
$str
!!� �
,
!!� �
message
!!� �
=
!!� �
Constant
!!� �
.
!!� �&
MONGODB_CONNECTION_ERROR
!!� �
}
!!� �
;
!!� �
}"" 
}## �
HD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\EmailService.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
{ 
public 

class 
EmailService 
: 
IEmailService  -
{ 
private 
readonly 
QueueSettings &
_queueSettings' 5
;5 6
private 
IModel 
channel 
=  
null! %
;% &
public 
static 
IConnection !

connection" ,
=- .
null/ 3
;3 4
public 
EmailService 
( 
IOptions $
<$ %
QueueSettings% 2
>2 3
queueSettings4 A
)A B
{ 	
_queueSettings 
= 
queueSettings *
.* +
Value+ 0
;0 1
} 	
public 
void 
	SendEmail 
( 
SendEmailModel ,
model- 2
)2 3
{ 	
ConnectionFactory 
factory %
=& '
new( +
ConnectionFactory, =
(= >
)> ?
;? @
factory 
. $
AutomaticRecoveryEnabled ,
=- .
true/ 3
;3 4
factory 
. 
Uri 
= 
new 
Uri !
(! "
_queueSettings" 0
.0 1
URI1 4
)4 5
;5 6
factory 
. 
UserName 
= 
_queueSettings -
.- .
UserName. 6
;6 7
factory   
.   
Password   
=   
_queueSettings   -
.  - .
Password  . 6
;  6 7
factory!! 
.!! 
HostName!! 
=!! 
_queueSettings!! -
.!!- .
HostName!!. 6
;!!6 7
factory"" 
."" 
VirtualHost"" 
=""  !
_queueSettings""" 0
.""0 1
VirtualHost""1 <
;""< =

connection## 
=## 
factory##  
.##  !
CreateConnection##! 1
(##1 2
)##2 3
;##3 4
channel$$ 
=$$ 

connection$$  
.$$  !
CreateModel$$! ,
($$, -
)$$- .
;$$. /
model%% 
.%%  
mailSendProviderType%% &
=%%' (
$str%%) 2
;%%2 3
string&& 
	jsonified&& 
=&& 
JsonConvert&& *
.&&* +
SerializeObject&&+ :
(&&: ;
model&&; @
)&&@ A
;&&A B
var'' 
body'' 
='' 
Encoding'' 
.''  
UTF8''  $
.''$ %
GetBytes''% -
(''- .
	jsonified''. 7
)''7 8
;''8 9
var(( 

properties(( 
=(( 
channel(( $
.(($ %!
CreateBasicProperties((% :
(((: ;
)((; <
;((< =
channel)) 
.)) 
BasicPublish))  
())  !
string))! '
.))' (
Empty))( -
,))- .
_queueSettings))/ =
.))= >
	QueueName))> G
,))G H

properties))I S
,))S T
body))U Y
)))Y Z
;))Z [
}** 	
}++ 
},, �0
SD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\HttpsResponseRepository.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
{ 
public 

class #
HttpsResponseRepository (
:) *$
IHttpsResponseRepository+ C
{ 
private 
readonly "
IDynamicMessageService /"
_dynamicMessageService0 F
;F G
public #
HttpsResponseRepository &
(& '"
IDynamicMessageService' =!
dynamicMessageService> S
)S T
{ 	"
_dynamicMessageService "
=# $!
dynamicMessageService% :
;: ;
} 	
public 
OkObjectResult 
ReturnResult *
(* +
APIStatusCode+ 8
apiStatusCode9 F
,F G
APIStateH P
apiStateQ Y
,Y Z
object[ a
Datab f
,f g
UserMessageh s
userMessaget 
)	 �
{ 	
ApiResponse 
response  
=! "
new# &
ApiResponse' 2
(2 3
)3 4
{ 
apiStatusCode 
= 
apiStatusCode  -
,- .
status 
= 
apiState !
.! "
GetDisplayValue" 1
(1 2
)2 3
,3 4
data 
= 
Data 
, 
userMessage 
= 
userMessage )
} 
; 
return 
new 
OkObjectResult %
(% &
response& .
). /
;/ 0
} 	
public!! 
async!! 
Task!! 
<!! 
OkObjectResult!! (
>!!( )#
ReturnExceptionResponse!!* A
(!!A B
	Exception!!B K
e!!L M
)!!M N
{"" 	
var## 
somethingWrongMSG## !
=##" #
await##$ )"
_dynamicMessageService##* @
.##@ A
Get##A D
(##D E
SOMTHING_WRONG##E S
)##S T
;##T U
ApiResponse$$ 
response$$  
=$$! "
new$$# &
ApiResponse$$' 2
($$2 3
)$$3 4
{%% 
apiStatusCode&& 
=&& 
APIStatusCode&&  -
.&&- .
ERROR&&. 3
,&&3 4
status'' 
='' 
APIState'' !
.''! "
FAILED''" (
.''( )
GetDisplayValue'') 8
(''8 9
)''9 :
,'': ;
userMessage(( 
=(( 
new(( !
UserMessage((" -
{((. /
messageContent((0 >
=((? @
new((A D
MessageContent((E S
{((T U
messageType((V a
=((b c
somethingWrongMSG((d u
.((u v
messageType	((v �
,
((� �
messageCode
((� �
=
((� �
somethingWrongMSG
((� �
.
((� �
messageCode
((� �
,
((� �
message
((� �
=
((� �
somethingWrongMSG
((� �
.
((� �
message
((� �
,
((� �
err
((� �
=
((� �
new
((� �
ErrorVM
((� �
{
((� �
message
((� �
=
((� �
e
((� �
.
((� �
Message
((� �
,
((� �
stack
((� �
=
((� �
e
((� �
.
((� �

StackTrace
((� �
}
((� �
}
((� �
}
((� �
})) 
;)) 
return** 
new** 
OkObjectResult** %
(**% &
response**& .
)**. /
;**/ 0
}++ 	
},, 
public.. 

class.. 
ApiResponse.. 
{// 
public00 
APIStatusCode00 
apiStatusCode00 *
{00+ ,
get00- 0
;000 1
set002 5
;005 6
}007 8
public11 
string11 
status11 
{11 
get11 "
;11" #
set11$ '
;11' (
}11) *
public22 
UserMessage22 
userMessage22 &
{22' (
get22) ,
;22, -
set22. 1
;221 2
}223 4
public33 
object33 
data33 
{33 
get33  
;33  !
set33" %
;33% &
}33' (
}44 
public66 

class66 
UserMessage66 
{77 
public88 
string88 
message88 
{88 
get88  #
;88# $
set88% (
;88( )
}88* +
public99 
MessageContent99 
messageContent99 ,
{99- .
get99/ 2
;992 3
set994 7
;997 8
}999 :
}:: 
public<< 

class<< 
MessageContent<< 
{== 
public>> 
string>> 
message>> 
{>> 
get>>  #
;>># $
set>>% (
;>>( )
}>>* +
public?? 
string?? 
messageCode?? !
{??" #
get??$ '
;??' (
set??) ,
;??, -
}??. /
public@@ 
string@@ 
messageType@@ !
{@@" #
get@@$ '
;@@' (
set@@) ,
;@@, -
}@@. /
publicAA 
ErrorVMAA 
errAA 
{AA 
getAA  
;AA  !
setAA" %
;AA% &
}AA' (
}BB 
publicDD 

classDD 
ErrorVMDD 
{EE 
publicFF 
stringFF 
messageFF 
{FF 
getFF  #
;FF# $
setFF% (
;FF( )
}FF* +
publicGG 
stringGG 
stackGG 
{GG 
getGG !
;GG! "
setGG# &
;GG& '
}GG( )
}HH 
}II �
SD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\Interface\IDbRepository.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
.' (
	Interface( 1
{ 
public 

	interface 
IDbRepository "
{ 
Task 
<  
AgreementListDetails !
>! "
AgreementListAsync# 5
(5 6
string6 <
sql= @
,@ A
MySqlParameterB P
[P Q
]Q R

parametersS ]
)] ^
;^ _
Task 
< %
GetAgreementDetailDetails &
>& '(
GetAgreementDetailsListAsync( D
(D E
stringE K
sqlL O
,O P
MySqlParameterQ _
	parameter` i
)i j
;j k
Task 
< *
UserSignUpAgreementListDetails +
>+ ,(
UserSignUpAgreementListAsync- I
(I J
stringJ P
sqlQ T
,T U
MySqlParameterV d
[d e
]e f

parametersg q
)q r
;r s
Task 
< -
!ArchieveVersionDetailsListDetails .
>. /+
ArchieveVersionDetailsListAsync0 O
(O P
stringP V
sqlW Z
,Z [
MySqlParameter\ j
[j k
]k l

parametersm w
)w x
;x y
Task 
< &
GetAgreedUserListVMDetails '
>' ("
GetAgreedUserListAsync) ?
(? @
string@ F
sqlG J
,J K
MySqlParameterL Z
[Z [
][ \

parameters] g
)g h
;h i
Task 
< -
!DownloadAgreementDetailsVMDetails .
>. /)
DownloadAgreementDetailsAsync0 M
(M N
stringN T
sqlU X
,X Y
MySqlParameterZ h
[h i
]i j

parametersk u
)u v
;v w
} 
} �
\D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\Interface\IDynamicMessageService.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 "
IDynamicMessageService		 +
{

 
public 
Task 
< 
DynamicMessage "
>" #
Get$ '
(' (
string( .

messageKey/ 9
)9 :
;: ;
} 
} �
SD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\Interface\IEmailService.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 
IEmailService		 "
{

 
public 
void 
	SendEmail 
( 
SendEmailModel ,
model- 2
)2 3
;3 4
} 
} �
^D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\Interface\IHttpsResponseRepository.cs
	namespace		 	
FJT		
 
.		 
IdentityServer		 
.		 

Repository		 '
.		' (
	Interface		( 1
{

 
public 

	interface $
IHttpsResponseRepository -
{ 
OkObjectResult 
ReturnResult #
(# $
APIStatusCode$ 1
apiStatusCode2 ?
,? @
APIStateA I
apiStateJ R
,R S
objectT Z
Data[ _
,_ `
UserMessagea l
Messagem t
)t u
;u v
Task 
< 
OkObjectResult 
> #
ReturnExceptionResponse 4
(4 5
	Exception5 >
e? @
)@ A
;A B
} 
} �
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\Interface\IMongoDBContext.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 
IMongoDBContext		 $
{

 
public 
IMongoDatabase 
GetDBContext *
(* +
)+ ,
;, -
} 
} �
\D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\Interface\ITextAngularValueForDB.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
.' (
	Interface( 1
{ 
public 

	interface "
ITextAngularValueForDB +
{		 
public

 
string

 $
SetTextAngularValueForDB

 .
(

. /
string

/ 5
content

6 =
)

= >
;

> ?
public 
string $
GetTextAngularValueForDB .
(. /
string/ 5
content6 =
)= >
;> ?
} 
} �
UD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\Interface\IUserRepository.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
.' (
	Interface( 1
{ 
public		 

	interface		 
IUserRepository		 $
{

 
Task 
< 
bool 
> 
AddClientUserMap #
(# $
ClientUserMappingVM$ 7
objCientUsersMap8 H
)H I
;I J
Task 
< 
bool 
> 
RemoveClientUserMap &
(& '
ClientUserMappingVM' :
objCientUsersMap; K
)K L
;L M
bool 
AddNewScope 
( 
string 
AllowedScopes  -
,- .
string/ 5
ClientID6 >
,> ?
int@ C
frontApiResourceIdD V
,V W
intX [
fjtUIClintId\ h
)h i
;i j
Task 
< 
bool 
> 

RemoveUser 
( 
List "
<" #
string# )
>) *
UserIds+ 2
)2 3
;3 4
Task 
< 
bool 
> .
"ClientUserMappingAvailabilityStaus 5
(5 6
string6 <
UserId= C
,C D
stringE K
clientIdL T
)T U
;U V
} 
} �

JD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\MongoDBContext.cs
	namespace

 	
FJT


 
.

 
IdentityServer

 
.

 

Repository

 '
{ 
public 

class 
MongoDBContext 
:  !
IMongoDBContext" 1
{ 
private 
readonly 
MongoDBConfig &
_mongoDBConfig' 5
;5 6
public 
MongoDBContext 
( 
IOptions &
<& '
MongoDBConfig' 4
>4 5
mongoDBConfig6 C
)C D
{ 	
_mongoDBConfig 
= 
mongoDBConfig *
.* +
Value+ 0
;0 1
} 	
public 
IMongoDatabase 
GetDBContext *
(* +
)+ ,
{ 	
var 
client 
= 
new 
MongoClient (
(( )
_mongoDBConfig) 7
.7 8#
MongoDBConnectionString8 O
)O P
;P Q
return 
client 
. 
GetDatabase %
(% &
_mongoDBConfig& 4
.4 5
DBName5 ;
); <
;< =
} 	
} 
} �&
QD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\TextAngularValueForDB.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
{ 
public 

class !
TextAngularValueForDB &
:' ("
ITextAngularValueForDB) ?
{ 
private 
readonly !
IFJTIdentityDbContext .!
_fjtIdentityDbContext/ D
;D E
private 
readonly 
PageURLs !
	_pageURLs" +
;+ ,
private 
string !
textAngularAPIKeyCode ,
=- .
string/ 5
.5 6
Empty6 ;
;; <
private 
string !
textAngularWebKeyCode ,
=- .
string/ 5
.5 6
Empty6 ;
;; <
public !
TextAngularValueForDB $
($ %!
IFJTIdentityDbContext% : 
fjtIdentityDbContext; O
,O P
IOptionsQ Y
<Y Z
PageURLsZ b
>b c
pageURLsd l
)l m
{ 	!
_fjtIdentityDbContext !
=" # 
fjtIdentityDbContext$ 8
;8 9
	_pageURLs 
= 
pageURLs  
.  !
Value! &
;& '
} 	
public 
void 

SetKeyCode 
( 
)  
{ 	
var 
value 
= !
_fjtIdentityDbContext -
.- .
Systemconfigrations. A
.A B
WhereB G
(G H
xH I
=>J L
xM N
.N O
keyO R
==S U
$strV j
&&k m
xn o
.o p
	isDeletedp y
==z |
false	} �
)
� �
.
� �
Select
� �
(
� �
x
� �
=>
� �
x
� �
.
� �
values
� �
)
� �
.
� �
FirstOrDefault
� �
(
� �
)
� �
;
� �
JObject 
json 
= 
JObject "
." #
Parse# (
(( )
value) .
). /
;/ 0!
textAngularAPIKeyCode !
=" #
json$ (
.( )
GetValue) 1
(1 2
$str2 I
)I J
.J K
ToStringK S
(S T
)T U
;U V!
textAngularWebKeyCode   !
=  " #
json  $ (
.  ( )
GetValue  ) 1
(  1 2
$str  2 I
)  I J
.  J K
ToString  K S
(  S T
)  T U
;  U V
}!! 	
public## 
string## $
SetTextAngularValueForDB## .
(##. /
string##/ 5
content##6 =
)##= >
{$$ 	
if%% 
(%% 
string%% 
.%% 
IsNullOrEmpty%% #
(%%# $!
textAngularAPIKeyCode%%$ 9
)%%9 :
||%%; =
string%%> D
.%%D E
IsNullOrEmpty%%E R
(%%R S!
textAngularWebKeyCode%%S h
)%%h i
)%%i j
{&& 

SetKeyCode'' 
('' 
)'' 
;'' 
}(( 
return)) 
content)) 
.)) 
Replace)) "
())" #
	_pageURLs))# ,
.)), -
ApiURL))- 3
,))3 4!
textAngularAPIKeyCode))5 J
)))J K
.))K L
Replace))L S
())S T
	_pageURLs))T ]
.))] ^
UIURL))^ c
,))c d!
textAngularWebKeyCode))e z
)))z {
;)){ |
}** 	
public,, 
string,, $
GetTextAngularValueForDB,, .
(,,. /
string,,/ 5
content,,6 =
),,= >
{-- 	
if.. 
(.. 
string.. 
... 
IsNullOrEmpty.. $
(..$ %!
textAngularAPIKeyCode..% :
)..: ;
||..< >
string..? E
...E F
IsNullOrEmpty..F S
(..S T!
textAngularWebKeyCode..T i
)..i j
)..j k
{// 

SetKeyCode00 
(00 
)00 
;00 
}11 
return22 
content22 
.22 
Replace22 "
(22" #!
textAngularAPIKeyCode22# 8
,228 9
	_pageURLs22: C
.22C D
ApiURL22D J
)22J K
.22K L
Replace22L S
(22S T!
textAngularWebKeyCode22T i
,22i j
	_pageURLs22k t
.22t u
UIURL22u z
)22z {
;22{ |
}33 	
}55 
}66 �_
JD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Repository\UserRepository.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 

Repository '
{ 
public 

class 
UserRepository 
:  !
IUserRepository" 1
{ 
private 
readonly  
FJTIdentityDbContext -
_context. 6
;6 7
public 
UserRepository 
(  
FJTIdentityDbContext 2
context3 :
): ;
{ 	
_context 
= 
context 
; 
} 	
public 
bool 
AddNewScope 
(  
string  &
AllowedScopes' 4
,4 5
string6 <
ClientID= E
,E F
intG J
frontApiResourceIdK ]
,] ^
int_ b
fjtUIClintIdc o
)o p
{ 	
try 
{ 
var 
newScope 
= 
new "
Models# )
.) *
ApiScope* 2
(2 3
)3 4
{   
Name!! 
=!! 
AllowedScopes!! (
,!!( )
DisplayName"" 
=""  !
ClientID""" *
,""* +
Required## 
=## 
false## $
,##$ %
	Emphasize$$ 
=$$ 
false$$  %
,$$% &#
ShowInDiscoveryDocument%% +
=%%, -
true%%. 2
}&& 
;&& 
_context(( 
.(( 
	ApiScopes(( "
.((" #
Add((# &
(((& '
newScope((' /
)((/ 0
;((0 1
var** 
newClientScope** "
=**# $
new**% (
ClientScope**) 4
(**4 5
)**5 6
{++ 
ClientId,, 
=,, 
fjtUIClintId,, +
,,,+ ,
Scope-- 
=-- 
AllowedScopes-- )
}.. 
;.. 
_context// 
.// 
ClientScopes// %
.//% &
Add//& )
(//) *
newClientScope//* 8
)//8 9
;//9 :
_context11 
.11 
SaveChanges11 $
(11$ %
)11% &
;11& '
return33 
true33 
;33 
}44 
catch55 
(55 
	Exception55 
e55 
)55 
{66 
return77 
false77 
;77 
}88 
}99 	
public<< 
async<< 
Task<< 
<<< 
bool<< 
><< 
AddClientUserMap<<  0
(<<0 1
ClientUserMappingVM<<1 D
objCientUsersMap<<E U
)<<U V
{== 	
try>> 
{?? 
var@@ 
objCUMapping@@  
=@@! "
await@@# (
_context@@) 1
.@@1 2
ClientUsersMapping@@2 D
.@@D E
Where@@E J
(@@J K
x@@K L
=>@@M O
x@@P Q
.@@Q R
UserId@@R X
==@@Y [
objCientUsersMap@@\ l
.@@l m
UserId@@m s
&&@@t v
x@@w x
.@@x y
ClientId	@@y �
==
@@� �
objCientUsersMap
@@� �
.
@@� �
ClientId
@@� �
)
@@� �
.
@@� �!
FirstOrDefaultAsync
@@� �
(
@@� �
)
@@� �
;
@@� �
ifBB 
(BB 
objCUMappingBB  
==BB! #
nullBB$ (
)BB( )
{CC 
ClientUsersMappingDD &
clientUsersMappingDD' 9
=DD: ;
newDD< ?
ClientUsersMappingDD@ R
(DDR S
)DDS T
;DDT U
clientUsersMappingEE &
.EE& '
ClientIdEE' /
=EE0 1
objCientUsersMapEE2 B
.EEB C
ClientIdEEC K
;EEK L
clientUsersMappingFF &
.FF& '
UserIdFF' -
=FF. /
objCientUsersMapFF0 @
.FF@ A
UserIdFFA G
;FFG H
clientUsersMappingGG &
.GG& '
	isDeletedGG' 0
=GG1 2
falseGG3 8
;GG8 9
_contextHH 
.HH 
ClientUsersMappingHH /
.HH/ 0
AddHH0 3
(HH3 4
clientUsersMappingHH4 F
)HHF G
;HHG H
awaitII 
_contextII "
.II" #
SaveChangesAsyncII# 3
(II3 4
)II4 5
;II5 6
}JJ 
elseKK 
{LL 
objCUMappingMM  
.MM  !
	isDeletedMM! *
=MM+ ,
falseMM- 2
;MM2 3
_contextNN 
.NN 
ClientUsersMappingNN /
.NN/ 0
UpdateNN0 6
(NN6 7
objCUMappingNN7 C
)NNC D
;NND E
awaitOO 
_contextOO "
.OO" #
SaveChangesAsyncOO# 3
(OO3 4
)OO4 5
;OO5 6
}PP 
returnQQ 
trueQQ 
;QQ 
}RR 
catchSS 
(SS 
	ExceptionSS 
eSS 
)SS 
{TT 
returnUU 
falseUU 
;UU 
}VV 
}WW 	
publicYY 
asyncYY 
TaskYY 
<YY 
boolYY 
>YY 
RemoveClientUserMapYY  3
(YY3 4
ClientUserMappingVMYY4 G
objCientUsersMapYYH X
)YYX Y
{ZZ 	
try[[ 
{\\ 
var]] 
objCUMapping]]  
=]]! "
await]]# (
_context]]) 1
.]]1 2
ClientUsersMapping]]2 D
.]]D E
Where]]E J
(]]J K
x]]K L
=>]]M O
x]]P Q
.]]Q R
UserId]]R X
==]]Y [
objCientUsersMap]]\ l
.]]l m
UserId]]m s
&&]]t v
x]]w x
.]]x y
ClientId	]]y �
==
]]� �
objCientUsersMap
]]� �
.
]]� �
ClientId
]]� �
&&
]]� �
x
]]� �
.
]]� �
	isDeleted
]]� �
==
]]� �
false
]]� �
)
]]� �
.
]]� �!
FirstOrDefaultAsync
]]� �
(
]]� �
)
]]� �
;
]]� �
if__ 
(__ 
objCUMapping__  
!=__! #
null__$ (
)__( )
{`` 
objCUMappingaa  
.aa  !
	isDeletedaa! *
=aa+ ,
trueaa- 1
;aa1 2
_contextbb 
.bb 
ClientUsersMappingbb /
.bb/ 0
Updatebb0 6
(bb6 7
objCUMappingbb7 C
)bbC D
;bbD E
awaitcc 
_contextcc "
.cc" #
SaveChangesAsynccc# 3
(cc3 4
)cc4 5
;cc5 6
}dd 
returnee 
trueee 
;ee 
}ff 
catchgg 
(gg 
	Exceptiongg 
egg 
)gg 
{hh 
returnii 
falseii 
;ii 
}jj 
}kk 	
publicmm 
asyncmm 
Taskmm 
<mm 
boolmm 
>mm 

RemoveUsermm  *
(mm* +
Listmm+ /
<mm/ 0
stringmm0 6
>mm6 7
UserIdsmm8 ?
)mm? @
{nn 	
tryoo 
{pp 
foreachqq 
(qq 
stringqq 
userIdqq  &
inqq' )
UserIdsqq* 1
)qq1 2
{rr 
varss 
userss 
=ss 
awaitss $
_contextss% -
.ss- .
ApplicationUsersss. >
.ss> ?
Wheress? D
(ssD E
xssE F
=>ssG I
xssJ K
.ssK L
IdssL N
==ssO Q
userIdssR X
)ssX Y
.ssY Z
FirstOrDefaultAsyncssZ m
(ssm n
)ssn o
;sso p
iftt 
(tt 
usertt 
!=tt 
nulltt  $
)tt$ %
{uu 
uservv 
.vv 
	isDeletedvv &
=vv' (
truevv) -
;vv- .
varxx 
objCUMappingxx (
=xx) *
awaitxx+ 0
_contextxx1 9
.xx9 :
ClientUsersMappingxx: L
.xxL M
WherexxM R
(xxR S
xxxS T
=>xxU W
xxxX Y
.xxY Z
UserIdxxZ `
==xxa c
userIdxxd j
)xxj k
.xxk l
ToListAsyncxxl w
(xxw x
)xxx y
;xxy z
foreachyy 
(yy  !
varyy! $

ogjClntMapyy% /
inyy0 2
objCUMappingyy3 ?
)yy? @
{zz 

ogjClntMap{{ &
.{{& '
	isDeleted{{' 0
={{1 2
true{{3 7
;{{7 8
_context|| $
.||$ %
ClientUsersMapping||% 7
.||7 8
Update||8 >
(||> ?

ogjClntMap||? I
)||I J
;||J K
}}} 
_context~~  
.~~  !
ApplicationUsers~~! 1
.~~1 2
Update~~2 8
(~~8 9
user~~9 =
)~~= >
;~~> ?
} 
var
�� 
userAgreements
�� &
=
��' (
await
��) .
_context
��/ 7
.
��7 8
UserAgreement
��8 E
.
��E F
Where
��F K
(
��K L
x
��L M
=>
��N P
x
��Q R
.
��R S
userID
��S Y
==
��Z \
userId
��] c
)
��c d
.
��d e
ToListAsync
��e p
(
��p q
)
��q r
;
��r s
foreach
�� 
(
�� 
var
��  
item
��! %
in
��& (
userAgreements
��) 7
)
��7 8
{
�� 
item
�� 
.
�� 
	isDeleted
�� &
=
��' (
true
��) -
;
��- .
_context
��  
.
��  !
UserAgreement
��! .
.
��. /
Update
��/ 5
(
��5 6
item
��6 :
)
��: ;
;
��; <
}
�� 
}
�� 
await
�� 
_context
�� 
.
�� 
SaveChangesAsync
�� /
(
��/ 0
)
��0 1
;
��1 2
return
�� 
true
�� 
;
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
return
�� 
false
�� 
;
�� 
}
�� 
}
�� 	
public
�� 
async
�� 
Task
�� 
<
�� 
bool
�� 
>
�� 0
"ClientUserMappingAvailabilityStaus
��  B
(
��B C
string
��C I
UserId
��J P
,
��P Q
string
��R X
clientId
��Y a
)
��a b
{
�� 	
try
�� 
{
�� 
var
�� 
objCUMapping
��  
=
��! "
await
��# (
_context
��) 1
.
��1 2 
ClientUsersMapping
��2 D
.
��D E!
FirstOrDefaultAsync
��E X
(
��X Y
x
��Y Z
=>
��[ ]
x
��^ _
.
��_ `
UserId
��` f
==
��g i
UserId
��j p
&&
��q s
x
��t u
.
��u v
	isDeleted
��v 
==��� �
false��� �
&&��� �
x��� �
.��� �
ClientId��� �
==��� �
clientId��� �
)��� �
;��� �
if
�� 
(
�� 
objCUMapping
��  
==
��! #
null
��$ (
)
��( )
{
�� 
return
�� 
false
��  
;
��  !
}
�� 
else
�� 
{
�� 
return
�� 
true
�� 
;
��  
}
�� 
}
�� 
catch
�� 
(
�� 
	Exception
�� 
e
�� 
)
�� 
{
�� 
return
�� 
false
�� 
;
�� 
}
�� 
}
�� 	
}
�� 
}�� �'
HD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Services\ProfileService.cs
	namespace 	
FJT
 
. 
IdentityServer 
. 
Services %
{ 
public 

class 
ProfileService 
:  !
IProfileService" 1
{ 
private 
readonly '
IUserClaimsPrincipalFactory 4
<4 5
ApplicationUser5 D
>D E
_claimsFactoryF T
;T U
private 
readonly 
UserManager $
<$ %
ApplicationUser% 4
>4 5
_userManager6 B
;B C
public 
ProfileService 
( 
UserManager )
<) *
ApplicationUser* 9
>9 :
userManager; F
,F G'
IUserClaimsPrincipalFactoryH c
<c d
ApplicationUserd s
>s t
claimsFactory	u �
)
� �
{ 	
_userManager 
= 
userManager &
;& '
_claimsFactory 
= 
claimsFactory *
;* +
} 	
public 
async 
Task 
GetProfileDataAsync -
(- .%
ProfileDataRequestContext. G
contextH O
)O P
{ 	
var 
sub 
= 
context 
. 
Subject %
.% &
GetSubjectId& 2
(2 3
)3 4
;4 5
var 
user 
= 
await 
_userManager )
.) *
FindByIdAsync* 7
(7 8
sub8 ;
); <
;< =
var 
role 
= 
_userManager #
.# $
GetRolesAsync$ 1
(1 2
user2 6
)6 7
.7 8
Result8 >
.> ?
FirstOrDefault? M
(M N
)N O
;O P
var 
	principal 
= 
await !
_claimsFactory" 0
.0 1
CreateAsync1 <
(< =
user= A
)A B
;B C
var   
claims   
=   
	principal   "
.  " #
Claims  # )
.  ) *
ToList  * 0
(  0 1
)  1 2
;  2 3
claims!! 
=!! 
claims!! 
.!! 
Where!! !
(!!! "
claim!!" '
=>!!( *
context!!+ 2
.!!2 3
RequestedClaimTypes!!3 F
.!!F G
Contains!!G O
(!!O P
claim!!P U
.!!U V
Type!!V Z
)!!Z [
)!![ \
.!!\ ]
ToList!!] c
(!!c d
)!!d e
;!!e f
claims$$ 
.$$ 
Add$$ 
($$ 
new$$ 
Claim$$  
($$  !
$str$$! )
,$$) *
user$$+ /
.$$/ 0
Id$$0 2
??$$3 5
string$$6 <
.$$< =
Empty$$= B
)$$B C
)$$C D
;$$D E
claims&& 
.&& 
Add&& 
(&& 
new&& 
Claim&&  
(&&  !
$str&&! (
,&&( )
user&&* .
.&&. /
Email&&/ 4
??&&5 7
string&&8 >
.&&> ?
Empty&&? D
)&&D E
)&&E F
;&&F G
claims'' 
.'' 
Add'' 
('' 
new'' 
Claim''  
(''  !
$str''! '
,''' (
role'') -
??''. 0
string''1 7
.''7 8
Empty''8 =
)''= >
)''> ?
;''? @
claims** 
.** 
Add** 
(** 
new** 
Claim**  
(**  !
$str**! (
,**( )
user*** .
.**. /
PhoneNumber**/ :
??**; =
string**> D
.**D E
Empty**E J
)**J K
)**K L
;**L M
context,, 
.,, 
IssuedClaims,,  
=,,! "
claims,,# )
;,,) *
}.. 	
public00 
async00 
Task00 
IsActiveAsync00 '
(00' (
IsActiveContext00( 7
context008 ?
)00? @
{11 	
var22 
sub22 
=22 
context22 
.22 
Subject22 %
.22% &
GetSubjectId22& 2
(222 3
)223 4
;224 5
var33 
user33 
=33 
await33 
_userManager33 )
.33) *
FindByIdAsync33* 7
(337 8
sub338 ;
)33; <
;33< =
context44 
.44 
IsActive44 
=44 
user44 #
!=44$ &
null44' +
;44+ ,
}55 	
}66 
}77 լ
8D:\Development\FJT\FJT-DEV\FJT.IdentityServer\Startup.cs
	namespace"" 	
FJT""
 
."" 
IdentityServer"" 
{## 
public$$ 

class$$ 
Startup$$ 
{%% 
public&& 
IWebHostEnvironment&& "
Environment&&# .
{&&/ 0
get&&1 4
;&&4 5
}&&6 7
public'' 
IConfiguration'' 
Configuration'' +
{'', -
get''. 1
;''1 2
}''3 4
readonly)) 
string)) "
MyAllowSpecificOrigins)) .
=))/ 0
$str))1 J
;))J K
public++ 
Startup++ 
(++ 
IWebHostEnvironment++ *
environment+++ 6
,++6 7
IConfiguration++8 F
configuration++G T
)++T U
{,, 	
Environment-- 
=-- 
environment-- %
;--% &
Configuration.. 
=.. 
configuration.. )
;..) *
}// 	
public11 
void11 
ConfigureServices11 %
(11% &
IServiceCollection11& 8
services119 A
)11A B
{22 	
var33 
queueSettingsConfig33 #
=33$ %
Configuration33& 3
.333 4

GetSection334 >
(33> ?
$str33? N
)33N O
;33O P
services77 
.77 
AddCors77 
(77 
options77 $
=>77% '
{88 
options99 
.99 
	AddPolicy99 !
(99! "
name99" &
:99& '"
MyAllowSpecificOrigins99( >
,99> ?
builder:: 
=>:: 
{;; 
builder<< 
.<<  
AllowAnyOrigin<<  .
(<<. /
)<</ 0
.<<0 1
AllowAnyHeader<<1 ?
(<<? @
)<<@ A
.<<A B
AllowAnyMethod<<B P
(<<P Q
)<<Q R
;<<R S
}== 
)== 
;== 
}>> 
)>> 
;>> 
services@@ 
.@@ #
AddControllersWithViews@@ ,
(@@, -
)@@- .
.@@. /
AddJsonOptions@@/ =
(@@= >
jsonOptions@@> I
=>@@J L
{AA 
jsonOptionsCC 
.CC !
JsonSerializerOptionsCC 1
.CC1 2 
PropertyNamingPolicyCC2 F
=CCG H
nullCCI M
;CCM N
}DD 
)DD 
;DD 
stringFF 
connectionStringFF #
=FF$ %
ConfigurationFF& 3
.FF3 4
GetConnectionStringFF4 G
(FFG H
$strFFH [
)FF[ \
;FF\ ]
varGG 
migrationsAssemblyGG "
=GG# $
typeofGG% +
(GG+ ,
StartupGG, 3
)GG3 4
.GG4 5
GetTypeInfoGG5 @
(GG@ A
)GGA B
.GGB C
AssemblyGGC K
.GGK L
GetNameGGL S
(GGS T
)GGT U
.GGU V
NameGGV Z
;GGZ [
servicesII 
.II 
AddDbContextII !
<II! " 
FJTIdentityDbContextII" 6
>II6 7
(II7 8
optionsII8 ?
=>II@ B
optionsJJ 
.JJ 
UseMySqlJJ  
(JJ  !
connectionStringJJ! 1
,JJ1 2
sqlJJ3 6
=>JJ7 9
sqlJJ: =
.JJ= >
MigrationsAssemblyJJ> P
(JJP Q
migrationsAssemblyJJQ c
)JJc d
)JJd e
)KK 
;KK 
servicesNN 
.NN 
	AddScopedNN 
<NN !
IFJTIdentityDbContextNN 4
,NN4 5 
FJTIdentityDbContextNN6 J
>NNJ K
(NNK L
)NNL M
;NNM N
servicesOO 
.OO 
	AddScopedOO 
<OO (
IFJTIdentityManualConnectionOO ;
,OO; <'
FJTIdentityManualConnectionOO= X
>OOX Y
(OOY Z
)OOZ [
;OO[ \
servicesPP 
.PP 
	AddScopedPP 
<PP 
IUserRepositoryPP .
,PP. /
UserRepositoryPP0 >
>PP> ?
(PP? @
)PP@ A
;PPA B
servicesQQ 
.QQ 
	AddScopedQQ 
<QQ $
IHttpsResponseRepositoryQQ 7
,QQ7 8#
HttpsResponseRepositoryQQ9 P
>QQP Q
(QQQ R
)QQR S
;QQS T
servicesRR 
.RR 
	AddScopedRR 
<RR 
IDbRepositoryRR ,
,RR, -
DbReositoryRR. 9
>RR9 :
(RR: ;
)RR; <
;RR< =
servicesSS 
.SS 
	AddScopedSS 
<SS 
IDataMapperSS *
,SS* +

DataMapperSS, 6
>SS6 7
(SS7 8
)SS8 9
;SS9 :
servicesTT 
.TT 
	AddScopedTT 
<TT 
IEmailServiceTT ,
,TT, -
EmailServiceTT. :
>TT: ;
(TT; <
)TT< =
;TT= >
servicesUU 
.UU 
	AddScopedUU 
<UU "
ITextAngularValueForDBUU 5
,UU5 6!
TextAngularValueForDBUU7 L
>UUL M
(UUM N
)UUN O
;UUO P
servicesVV 
.VV 
	AddScopedVV 
<VV 
IMongoDBContextVV .
,VV. /
MongoDBContextVV0 >
>VV> ?
(VV? @
)VV@ A
;VVA B
servicesWW 
.WW 
	AddScopedWW 
<WW "
IDynamicMessageServiceWW 5
,WW5 6!
DynamicMessageServiceWW7 L
>WWL M
(WWM N
)WWN O
;WWO P
var[[ 
pageURLs[[ 
=[[ 
Configuration[[ (
.[[( )

GetSection[[) 3
([[3 4
nameof[[4 :
([[: ;
PageURLs[[; C
)[[C D
)[[D E
;[[E F
services\\ 
.\\ 
	Configure\\ 
<\\ 
PageURLs\\ '
>\\' (
(\\( )
pageURLs\\) 1
)\\1 2
;\\2 3
services]] 
.]] 
	Configure]] 
<]] 
QueueSettings]] ,
>]], -
(]]- .
Configuration]]. ;
.]]; <

GetSection]]< F
(]]F G
nameof]]G M
(]]M N
QueueSettings]]N [
)]][ \
)]]\ ]
)]]] ^
;]]^ _
services^^ 
.^^ 
	Configure^^ 
<^^ 
ConnectionStrings^^ 0
>^^0 1
(^^1 2
Configuration^^2 ?
.^^? @

GetSection^^@ J
(^^J K
nameof^^K Q
(^^Q R
ConnectionStrings^^R c
)^^c d
)^^d e
)^^e f
;^^f g
services__ 
.__ 
	Configure__ 
<__ 
MongoDBConfig__ ,
>__, -
(__- .
Configuration__. ;
.__; <

GetSection__< F
(__F G
nameof__G M
(__M N
MongoDBConfig__N [
)__[ \
)__\ ]
)__] ^
;__^ _
boolcc 
islocalhostcc 
=cc 
(cc  
boolcc  $
)cc$ %
Configurationcc% 2
.cc2 3
GetValuecc3 ;
(cc; <
typeofcc< B
(ccB C
boolccC G
)ccG H
,ccH I
$strccJ W
)ccW X
;ccX Y
servicesdd 
.dd 
AddAuthenticationdd &
(dd& '
$strdd' /
)dd/ 0
.ee 
AddJwtBeareree 
(ee 
$stree "
,ee" #
optionsee$ +
=>ee, .
{ff 
ifgg 
(gg 
islocalhostgg 
)gg  
{hh 
optionsii 
.ii "
BackchannelHttpHandlerii 2
=ii3 4
newii5 8
HttpClientHandlerii9 J
{iiK L5
)ServerCertificateCustomValidationCallbackiiM v
=iiw x
delegate	iiy �
{
ii� �
return
ii� �
true
ii� �
;
ii� �
}
ii� �
}
ii� �
;
ii� �
}jj 
optionskk 
.kk 
	Authoritykk !
=kk" #
pageURLskk$ ,
.kk, -
GetValuekk- 5
(kk5 6
typeofkk6 <
(kk< =
stringkk= C
)kkC D
,kkD E
$strkkF Y
)kkY Z
.kkZ [
ToStringkk[ c
(kkc d
)kkd e
;kke f
optionsll 
.ll %
TokenValidationParametersll 1
=ll2 3
newll4 7%
TokenValidationParametersll8 Q
{mm 
ValidateAudiencenn $
=nn% &
falsenn' ,
}oo 
;oo 
}pp 
)pp 
;pp 
servicesrr 
.rr 
AddDefaultIdentityrr '
<rr' (
ApplicationUserrr( 7
>rr7 8
(rr8 9
)rr9 :
.ss 
AddRolesss 
<ss 
ApplicationRoless )
>ss) *
(ss* +
)ss+ ,
.tt $
AddEntityFrameworkStorestt )
<tt) * 
FJTIdentityDbContexttt* >
>tt> ?
(tt? @
)tt@ A
;ttA B
varuu 
builderuu 
=uu 
servicesuu "
.uu" #
AddIdentityServeruu# 4
(uu4 5
optionsuu5 <
=>uu= ?
{vv 
optionsww 
.ww 
Eventsww 
.ww 
RaiseErrorEventsww /
=ww0 1
trueww2 6
;ww6 7
optionsxx 
.xx 
Eventsxx 
.xx "
RaiseInformationEventsxx 5
=xx6 7
truexx8 <
;xx< =
optionsyy 
.yy 
Eventsyy 
.yy 
RaiseFailureEventsyy 1
=yy2 3
trueyy4 8
;yy8 9
optionszz 
.zz 
Eventszz 
.zz 
RaiseSuccessEventszz 1
=zz2 3
truezz4 8
;zz8 9
options{{ 
.{{ 
UserInteraction{{ '
.{{' (
LoginUrl{{( 0
={{1 2
$str{{3 C
;{{C D
options|| 
.|| 
UserInteraction|| '
.||' (
	LogoutUrl||( 1
=||2 3
$str||4 E
;||E F
options}} 
.}} 
Authentication}} &
=}}' (
new}}) ,!
AuthenticationOptions}}- B
(}}B C
)}}C D
{~~ 
CookieLifetime "
=# $
TimeSpan% -
.- .
FromDays. 6
(6 7
$num7 9
)9 :
,: ;%
CookieSlidingExpiration
�� +
=
��, -
true
��. 2
,
��2 3$
CheckSessionCookieName
�� *
=
��+ ,
(
��- .
string
��. 4
)
��4 5
Configuration
��5 B
.
��B C
GetValue
��C K
(
��K L
typeof
��L R
(
��R S
string
��S Y
)
��Y Z
,
��Z [
$str
��\ o
)
��o p
}
�� 
;
�� 
}
�� 
)
�� 
.
�� #
AddConfigurationStore
�� $
(
��$ %
options
��% ,
=>
��- /
{
�� 
options
�� 
.
��  
ConfigureDbContext
�� *
=
��+ ,
b
��- .
=>
��/ 1
b
��2 3
.
��3 4
UseMySql
��4 <
(
��< =
connectionString
��= M
,
��M N
sql
��O R
=>
��S U
sql
��V Y
.
��Y Z 
MigrationsAssembly
��Z l
(
��l m 
migrationsAssembly
��m 
)�� �
)��� �
;��� �
}
�� 
)
�� 
.
�� !
AddOperationalStore
�� $
(
��$ %
options
��% ,
=>
��- /
{
�� 
options
�� 
.
��  
ConfigureDbContext
�� .
=
��/ 0
b
��1 2
=>
��3 5
b
��6 7
.
��7 8
UseMySql
��8 @
(
��@ A
connectionString
��A Q
,
��Q R
sql
��S V
=>
��W Y
sql
��Z ]
.
��] ^ 
MigrationsAssembly
��^ p
(
��p q!
migrationsAssembly��q �
)��� �
)��� �
;��� �
options
�� 
.
��  
EnableTokenCleanup
�� .
=
��/ 0
true
��1 5
;
��5 6
}
�� 
)
�� 
.
�� 
AddAspNetIdentity
�� "
<
��" #
ApplicationUser
��# 2
>
��2 3
(
��3 4
)
��4 5
.
�� 
AddProfileService
�� "
<
��" #
ProfileService
��# 1
>
��1 2
(
��2 3
)
��3 4
;
��4 5
builder
�� 
.
�� 
Services
�� 
.
�� (
ConfigureApplicationCookie
�� 7
(
��7 8
options
��8 ?
=>
��@ B
{
�� 
options
�� 
.
�� 
Cookie
�� 
.
�� 
Name
�� #
=
��$ %
(
��& '
string
��' -
)
��- .
Configuration
��. ;
.
��; <
GetValue
��< D
(
��D E
typeof
��E K
(
��K L
string
��L R
)
��R S
,
��S T
$str
��U o
)
��o p
;
��p q
}
�� 
)
�� 
;
�� 
if
�� 
(
�� 
Environment
�� 
.
�� 
IsDevelopment
�� )
(
��) *
)
��* +
)
��+ ,
{
�� 
builder
�� 
.
�� +
AddDeveloperSigningCredential
�� 5
(
��5 6
)
��6 7
;
��7 8
}
�� 
else
�� 
{
�� 
string
�� #
certificateThumbPrint
�� ,
=
��- .
Configuration
��/ <
.
��< =
GetValue
��= E
(
��E F
typeof
��F L
(
��L M
string
��M S
)
��S T
,
��T U
$str
��V m
)
��m n
.
��n o
ToString
��o w
(
��w x
)
��x y
;
��y z
builder
�� 
.
�� "
AddSigningCredential
�� ,
(
��, -
CertificateHelper
��- >
.
��> ?)
LoadCertificateByThumbPrint
��? Z
(
��Z [#
certificateThumbPrint
��[ p
)
��p q
)
��q r
;
��r s
}
�� &
IdentityModelEventSource
�� $
.
��$ %
ShowPII
��% ,
=
��- .
true
��/ 3
;
��3 4
}
�� 	
public
�� 
void
�� 
	Configure
�� 
(
�� !
IApplicationBuilder
�� 1
app
��2 5
)
��5 6
{
�� 	
bool
�� 
seed
�� 
=
�� 
Configuration
�� %
.
��% &

GetSection
��& 0
(
��0 1
$str
��1 7
)
��7 8
.
��8 9
GetValue
��9 A
<
��A B
bool
��B F
>
��F G
(
��G H
$str
��H N
)
��N O
;
��O P
if
�� 
(
�� 
seed
�� 
)
�� 
{
��  
InitializeDatabase
�� "
(
��" #
app
��# &
)
��& '
;
��' (
throw
�� 
new
�� 
	Exception
�� #
(
��# $
$str
��$ ]
)
��] ^
;
��^ _
}
�� 
if
�� 
(
�� 
Environment
�� 
.
�� 
IsDevelopment
�� )
(
��) *
)
��* +
)
��+ ,
{
�� 
app
�� 
.
�� '
UseDeveloperExceptionPage
�� -
(
��- .
)
��. /
;
��/ 0
}
�� 
app
�� 
.
�� 
UseCookiePolicy
�� 
(
��  
)
��  !
;
��! "
app
�� 
.
�� 
UseStaticFiles
�� 
(
�� 
)
��  
;
��  !
app
�� 
.
�� 

UseRouting
�� 
(
�� 
)
�� 
;
�� 
app
�� 
.
�� 
UseIdentityServer
�� !
(
��! "
)
��" #
;
��# $
app
�� 
.
�� 
UseCors
�� 
(
�� $
MyAllowSpecificOrigins
�� .
)
��. /
;
��/ 0
app
�� 
.
�� 
UseAuthentication
�� !
(
��! "
)
��" #
;
��# $
app
�� 
.
�� 
UseAuthorization
��  
(
��  !
)
��! "
;
��" #
app
�� 
.
�� 
UseEndpoints
�� 
(
�� 
	endpoints
�� &
=>
��' )
{
�� 
	endpoints
�� 
.
�� '
MapDefaultControllerRoute
�� 3
(
��3 4
)
��4 5
;
��5 6
}
�� 
)
�� 
;
�� 
}
�� 	
private
�� 
void
��  
InitializeDatabase
�� '
(
��' (!
IApplicationBuilder
��( ;
app
��< ?
)
��? @
{
�� 	
using
�� 
(
�� 
var
�� 
serviceScope
�� #
=
��$ %
app
��& )
.
��) *!
ApplicationServices
��* =
.
��= >

GetService
��> H
<
��H I"
IServiceScopeFactory
��I ]
>
��] ^
(
��^ _
)
��_ `
.
��` a
CreateScope
��a l
(
��l m
)
��m n
)
��n o
{
�� 
serviceScope
�� 
.
�� 
ServiceProvider
�� ,
.
��, - 
GetRequiredService
��- ?
<
��? @%
PersistedGrantDbContext
��@ W
>
��W X
(
��X Y
)
��Y Z
.
��Z [
Database
��[ c
.
��c d
Migrate
��d k
(
��k l
)
��l m
;
��m n
var
�� 
context
�� 
=
�� 
serviceScope
�� *
.
��* +
ServiceProvider
��+ :
.
��: ; 
GetRequiredService
��; M
<
��M N$
ConfigurationDbContext
��N d
>
��d e
(
��e f
)
��f g
;
��g h
context
�� 
.
�� 
Database
��  
.
��  !
Migrate
��! (
(
��( )
)
��) *
;
��* +
if
�� 
(
�� 
!
�� 
context
�� 
.
�� 
Clients
�� $
.
��$ %
Any
��% (
(
��( )
)
��) *
)
��* +
{
�� 
foreach
�� 
(
�� 
var
��  
client
��! '
in
��( *
Config
��+ 1
.
��1 2

GetClients
��2 <
(
��< =
)
��= >
)
��> ?
{
�� 
context
�� 
.
��  
Clients
��  '
.
��' (
Add
��( +
(
��+ ,
client
��, 2
.
��2 3
ToEntity
��3 ;
(
��; <
)
��< =
)
��= >
;
��> ?
}
�� 
context
�� 
.
�� 
SaveChanges
�� '
(
��' (
)
��( )
;
��) *
}
�� 
if
�� 
(
�� 
!
�� 
context
�� 
.
�� 
IdentityResources
�� .
.
��. /
Any
��/ 2
(
��2 3
)
��3 4
)
��4 5
{
�� 
foreach
�� 
(
�� 
var
��  
resource
��! )
in
��* ,
Config
��- 3
.
��3 4"
GetIdentityResources
��4 H
(
��H I
)
��I J
)
��J K
{
�� 
context
�� 
.
��  
IdentityResources
��  1
.
��1 2
Add
��2 5
(
��5 6
resource
��6 >
.
��> ?
ToEntity
��? G
(
��G H
)
��H I
)
��I J
;
��J K
}
�� 
context
�� 
.
�� 
SaveChanges
�� '
(
��' (
)
��( )
;
��) *
}
�� 
if
�� 
(
�� 
!
�� 
context
�� 
.
�� 
	ApiScopes
�� &
.
��& '
Any
��' *
(
��* +
)
��+ ,
)
��, -
{
�� 
foreach
�� 
(
�� 
var
��  
scope
��! &
in
��' )
Config
��* 0
.
��0 1
GetApiScopes
��1 =
(
��= >
)
��> ?
)
��? @
{
�� 
context
�� 
.
��  
	ApiScopes
��  )
.
��) *
Add
��* -
(
��- .
scope
��. 3
.
��3 4
ToEntity
��4 <
(
��< =
)
��= >
)
��> ?
;
��? @
}
�� 
context
�� 
.
�� 
SaveChanges
�� '
(
��' (
)
��( )
;
��) *
}
�� 
if
�� 
(
�� 
!
�� 
context
�� 
.
�� 
ApiResources
�� )
.
��) *
Any
��* -
(
��- .
)
��. /
)
��/ 0
{
�� 
foreach
�� 
(
�� 
var
��  
resource
��! )
in
��* ,
Config
��- 3
.
��3 4
GetApis
��4 ;
(
��; <
)
��< =
)
��= >
{
�� 
context
�� 
.
��  
ApiResources
��  ,
.
��, -
Add
��- 0
(
��0 1
resource
��1 9
.
��9 :
ToEntity
��: B
(
��B C
)
��C D
)
��D E
;
��E F
}
�� 
context
�� 
.
�� 
SaveChanges
�� '
(
��' (
)
��( )
;
��) *
}
�� 
}
�� 
}
�� 	
}
�� 
}�� 