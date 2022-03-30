Ï
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
} ≈
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
} ’
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
} Ê	
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
} Œ
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
} ö
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
}++ ˙˙
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
messageContent	CC~ å
=
CCç é
new
CCè í
MessageContent
CCì °
{
CC¢ £
messageType
CC§ Ø
=
CC∞ ±!
invalidParameterMSG
CC≤ ≈
.
CC≈ ∆
messageType
CC∆ —
,
CC— “
messageCode
CC” ﬁ
=
CCﬂ ‡!
invalidParameterMSG
CC· Ù
.
CCÙ ı
messageCode
CCı Ä
,
CCÄ Å
message
CCÇ â
=
CCä ã!
invalidParameterMSG
CCå ü
.
CCü †
message
CC† ß
}
CC® ©
}
CC™ ´
)
CC´ ¨
;
CC¨ ≠
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
$str	^^d Å
,
^^Å Ç

parameters
^^É ç
)
^^ç é
;
^^é è
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
;	ff Ä
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
messageContent	zz~ å
=
zzç é
new
zzè í
MessageContent
zzì °
{
zz¢ £
messageType
zz§ Ø
=
zz∞ ±!
invalidParameterMSG
zz≤ ≈
.
zz≈ ∆
messageType
zz∆ —
,
zz— “
messageCode
zz” ﬁ
=
zzﬂ ‡!
invalidParameterMSG
zz· Ù
.
zzÙ ı
messageCode
zzı Ä
,
zzÄ Å
message
zzÇ â
=
zzä ã!
invalidParameterMSG
zzå ü
.
zzü †
message
zz† ß
}
zz® ©
}
zz™ ´
)
zz´ ¨
;
zz¨ ≠
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
$str	x ì
,
ì î
	parameter
ï û
)
û ü
;
ü †$
GetAgreementDetailData
ÅÅ &%
getAgreementDetailsData
ÅÅ' >
=
ÅÅ? @
new
ÅÅA D$
GetAgreementDetailData
ÅÅE [
(
ÅÅ[ \
)
ÅÅ\ ]
{
ÇÇ 
data
ÉÉ 
=
ÉÉ '
getAgreementDetailDetails
ÉÉ 4
.
ÉÉ4 5!
GetAgreementDetails
ÉÉ5 H
.
ÉÉH I
ToList
ÉÉI O
(
ÉÉO P
)
ÉÉP Q
}
ÑÑ 
;
ÑÑ 
return
ÜÜ '
_iHttpsResponseRepository
ÜÜ 0
.
ÜÜ0 1
ReturnResult
ÜÜ1 =
(
ÜÜ= >
APIStatusCode
ÜÜ> K
.
ÜÜK L
SUCCESS
ÜÜL S
,
ÜÜS T
APIState
ÜÜU ]
.
ÜÜ] ^
SUCCESS
ÜÜ^ e
,
ÜÜe f%
getAgreementDetailsData
ÜÜg ~
,
ÜÜ~ 
nullÜÜÄ Ñ
)ÜÜÑ Ö
;ÜÜÖ Ü
}
áá 
catch
àà 
(
àà 
	Exception
àà 
e
àà 
)
àà 
{
ââ 
_logger
ää 
.
ää 
LogError
ää  
(
ää  !
e
ää! "
.
ää" #
ToString
ää# +
(
ää+ ,
)
ää, -
)
ää- .
;
ää. /
return
ãã 
await
ãã '
_iHttpsResponseRepository
ãã 6
.
ãã6 7%
ReturnExceptionResponse
ãã7 N
(
ããN O
e
ããO P
)
ããP Q
;
ããQ R
}
åå 
}
çç 	
[
îî 	
HttpGet
îî	 
]
îî 
public
ïï 
async
ïï 
Task
ïï 
<
ïï 
IActionResult
ïï '
>
ïï' (&
RetriveAgreementByTypeId
ïï) A
(
ïïA B
int
ïïB E
agreementTypeID
ïïF U
)
ïïU V
{
ññ 	
if
óó 
(
óó 
agreementTypeID
óó 
==
óó  "
$num
óó# $
)
óó$ %
{
òò 
var
ôô !
invalidParameterMSG
ôô '
=
ôô( )
await
ôô* /$
_dynamicMessageService
ôô0 F
.
ôôF G
Get
ôôG J
(
ôôJ K
INVALID_PARAMETER
ôôK \
)
ôô\ ]
;
ôô] ^
return
öö '
_iHttpsResponseRepository
öö 0
.
öö0 1
ReturnResult
öö1 =
(
öö= >
APIStatusCode
öö> K
.
ööK L
ERROR
ööL Q
,
ööQ R
APIState
ööS [
.
öö[ \
FAILED
öö\ b
,
ööb c
null
ööd h
,
ööh i
new
ööj m
UserMessage
öön y
(
ööy z
)
ööz {
{
öö| }
messageContentöö~ å
=ööç é
newööè í
MessageContentööì °
{öö¢ £
messageTypeöö§ Ø
=öö∞ ±#
invalidParameterMSGöö≤ ≈
.öö≈ ∆
messageTypeöö∆ —
,öö— “
messageCodeöö” ﬁ
=ööﬂ ‡#
invalidParameterMSGöö· Ù
.ööÙ ı
messageCodeööı Ä
,ööÄ Å
messageööÇ â
=ööä ã#
invalidParameterMSGööå ü
.ööü †
messageöö† ß
}öö® ©
}öö™ ´
)öö´ ¨
;öö¨ ≠
}
õõ 
try
úú 
{
ùù 
var
ûû 
agreementList
ûû !
=
ûû" #
await
ûû$ )$
_iFJTIdentityDbContext
ûû* @
.
ûû@ A
	Agreement
ûûA J
.
ûûJ K
Where
ûûK P
(
ûûP Q
x
ûûQ R
=>
ûûS U
x
ûûV W
.
ûûW X
agreementTypeID
ûûX g
==
ûûh j
agreementTypeID
ûûk z
)
ûûz {
.
ûû{ |
ToListAsyncûû| á
(ûûá à
)ûûà â
;ûûâ ä
if
üü 
(
üü 
agreementList
üü !
==
üü" $
null
üü% )
)
üü) *
{
†† 
var
°° 
notFoundMSG
°° #
=
°°$ %
await
°°& +$
_dynamicMessageService
°°, B
.
°°B C
Get
°°C F
(
°°F G
	NOT_FOUND
°°G P
)
°°P Q
;
°°Q R
return
¢¢ '
_iHttpsResponseRepository
¢¢ 4
.
¢¢4 5
ReturnResult
¢¢5 A
(
¢¢A B
APIStatusCode
¢¢B O
.
¢¢O P
ERROR
¢¢P U
,
¢¢U V
APIState
¢¢W _
.
¢¢_ `
FAILED
¢¢` f
,
¢¢f g
null
¢¢h l
,
¢¢l m
new
¢¢n q
UserMessage
¢¢r }
(
¢¢} ~
)
¢¢~ 
{¢¢Ä Å
messageContent¢¢Ç ê
=¢¢ë í
new¢¢ì ñ
MessageContent¢¢ó •
{¢¢¶ ß
messageType¢¢® ≥
=¢¢¥ µ
notFoundMSG¢¢∂ ¡
.¢¢¡ ¬
messageType¢¢¬ Õ
,¢¢Õ Œ
messageCode¢¢œ ⁄
=¢¢€ ‹
notFoundMSG¢¢› Ë
.¢¢Ë È
messageCode¢¢È Ù
,¢¢Ù ı
message¢¢ˆ ˝
=¢¢˛ ˇ
string¢¢Ä Ü
.¢¢Ü á
Format¢¢á ç
(¢¢ç é
notFoundMSG¢¢é ô
.¢¢ô ö
message¢¢ö °
,¢¢° ¢ 
AGREEMENT_ENTITY¢¢£ ≥
)¢¢≥ ¥
}¢¢µ ∂
}¢¢∑ ∏
)¢¢∏ π
;¢¢π ∫
}
££ 
foreach
•• 
(
•• 
var
•• 
	agreement
•• &
in
••' )
agreementList
••* 7
)
••7 8
{
¶¶ 
if
ßß 
(
ßß 
!
ßß 
string
ßß 
.
ßß  
IsNullOrEmpty
ßß  -
(
ßß- .
	agreement
ßß. 7
.
ßß7 8
agreementContent
ßß8 H
)
ßßH I
)
ßßI J
{
®® 
	agreement
©© !
.
©©! "
agreementContent
©©" 2
=
©©3 4$
_textAngularValueForDB
©©5 K
.
©©K L&
GetTextAngularValueForDB
©©L d
(
©©d e
	agreement
©©e n
.
©©n o
agreementContent
©©o 
)©© Ä
;©©Ä Å
if
™™ 
(
™™ 
	agreement
™™ %
.
™™% &
agreementContent
™™& 6
==
™™7 9
null
™™: >
)
™™> ?
{
´´ 
var
¨¨ 
somethingWrongMSG
¨¨  1
=
¨¨2 3
await
¨¨4 9$
_dynamicMessageService
¨¨: P
.
¨¨P Q
Get
¨¨Q T
(
¨¨T U
SOMTHING_WRONG
¨¨U c
)
¨¨c d
;
¨¨d e
return
≠≠ "'
_iHttpsResponseRepository
≠≠# <
.
≠≠< =
ReturnResult
≠≠= I
(
≠≠I J
APIStatusCode
≠≠J W
.
≠≠W X
ERROR
≠≠X ]
,
≠≠] ^
APIState
≠≠_ g
.
≠≠g h
FAILED
≠≠h n
,
≠≠n o
null
≠≠p t
,
≠≠t u
new
≠≠v y
UserMessage≠≠z Ö
(≠≠Ö Ü
)≠≠Ü á
{≠≠à â
messageContent≠≠ä ò
=≠≠ô ö
new≠≠õ û
MessageContent≠≠ü ≠
{≠≠Æ Ø
messageType≠≠∞ ª
=≠≠º Ω!
somethingWrongMSG≠≠æ œ
.≠≠œ –
messageType≠≠– €
,≠≠€ ‹
messageCode≠≠› Ë
=≠≠È Í!
somethingWrongMSG≠≠Î ¸
.≠≠¸ ˝
messageCode≠≠˝ à
,≠≠à â
message≠≠ä ë
=≠≠í ì!
somethingWrongMSG≠≠î •
.≠≠• ¶
message≠≠¶ ≠
}≠≠Æ Ø
}≠≠∞ ±
)≠≠± ≤
;≠≠≤ ≥
}
ÆÆ 
}
ØØ 
if
±± 
(
±± 
!
±± 
string
±± 
.
±±  
IsNullOrEmpty
±±  -
(
±±- .
	agreement
±±. 7
.
±±7 8
agreementSubject
±±8 H
)
±±H I
)
±±I J
{
≤≤ 
	agreement
≥≥ !
.
≥≥! "
agreementSubject
≥≥" 2
=
≥≥3 4$
_textAngularValueForDB
≥≥5 K
.
≥≥K L&
GetTextAngularValueForDB
≥≥L d
(
≥≥d e
	agreement
≥≥e n
.
≥≥n o
agreementSubject
≥≥o 
)≥≥ Ä
;≥≥Ä Å
if
¥¥ 
(
¥¥ 
	agreement
¥¥ %
.
¥¥% &
agreementSubject
¥¥& 6
==
¥¥7 9
null
¥¥: >
)
¥¥> ?
{
µµ 
var
∂∂ 
somethingWrongMSG
∂∂  1
=
∂∂2 3
await
∂∂4 9$
_dynamicMessageService
∂∂: P
.
∂∂P Q
Get
∂∂Q T
(
∂∂T U
SOMTHING_WRONG
∂∂U c
)
∂∂c d
;
∂∂d e
return
∑∑ "'
_iHttpsResponseRepository
∑∑# <
.
∑∑< =
ReturnResult
∑∑= I
(
∑∑I J
APIStatusCode
∑∑J W
.
∑∑W X
ERROR
∑∑X ]
,
∑∑] ^
APIState
∑∑_ g
.
∑∑g h
FAILED
∑∑h n
,
∑∑n o
null
∑∑p t
,
∑∑t u
new
∑∑v y
UserMessage∑∑z Ö
(∑∑Ö Ü
)∑∑Ü á
{∑∑à â
messageContent∑∑ä ò
=∑∑ô ö
new∑∑õ û
MessageContent∑∑ü ≠
{∑∑Æ Ø
messageType∑∑∞ ª
=∑∑º Ω!
somethingWrongMSG∑∑æ œ
.∑∑œ –
messageType∑∑– €
,∑∑€ ‹
messageCode∑∑› Ë
=∑∑È Í!
somethingWrongMSG∑∑Î ¸
.∑∑¸ ˝
messageCode∑∑˝ à
,∑∑à â
message∑∑ä ë
=∑∑í ì!
somethingWrongMSG∑∑î •
.∑∑• ¶
message∑∑¶ ≠
}∑∑Æ Ø
}∑∑∞ ±
)∑∑± ≤
;∑∑≤ ≥
}
∏∏ 
}
ππ 
}
∫∫ 
return
ºº '
_iHttpsResponseRepository
ºº 0
.
ºº0 1
ReturnResult
ºº1 =
(
ºº= >
APIStatusCode
ºº> K
.
ººK L
SUCCESS
ººL S
,
ººS T
APIState
ººU ]
.
ºº] ^
SUCCESS
ºº^ e
,
ººe f
agreementList
ººg t
,
ººt u
null
ººv z
)
ººz {
;
ºº{ |
}
ΩΩ 
catch
ææ 
(
ææ 
	Exception
ææ 
e
ææ 
)
ææ 
{
øø 
_logger
¿¿ 
.
¿¿ 
LogError
¿¿  
(
¿¿  !
e
¿¿! "
.
¿¿" #
ToString
¿¿# +
(
¿¿+ ,
)
¿¿, -
)
¿¿- .
;
¿¿. /
return
¡¡ 
await
¡¡ '
_iHttpsResponseRepository
¡¡ 6
.
¡¡6 7%
ReturnExceptionResponse
¡¡7 N
(
¡¡N O
e
¡¡O P
)
¡¡P Q
;
¡¡Q R
}
¬¬ 
}
√√ 	
[
   	
HttpPost
  	 
]
   
public
ÀÀ 
async
ÀÀ 
Task
ÀÀ 
<
ÀÀ 
IActionResult
ÀÀ '
>
ÀÀ' (,
RetriveUserSignUpAgreementList
ÀÀ) G
(
ÀÀG H
[
ÀÀH I
FromBody
ÀÀI Q
]
ÀÀQ R%
RequestSprocParameterVM
ÀÀS j&
requestSprocParameterVMÀÀk Ç
)ÀÀÇ É
{
ÃÃ 	
if
ÕÕ 
(
ÕÕ %
requestSprocParameterVM
ÕÕ '
==
ÕÕ( *
null
ÕÕ+ /
)
ÕÕ/ 0
{
ŒŒ 
var
œœ !
invalidParameterMSG
œœ '
=
œœ( )
await
œœ* /$
_dynamicMessageService
œœ0 F
.
œœF G
Get
œœG J
(
œœJ K
INVALID_PARAMETER
œœK \
)
œœ\ ]
;
œœ] ^
return
–– '
_iHttpsResponseRepository
–– 0
.
––0 1
ReturnResult
––1 =
(
––= >
APIStatusCode
––> K
.
––K L
ERROR
––L Q
,
––Q R
APIState
––S [
.
––[ \
FAILED
––\ b
,
––b c
null
––d h
,
––h i
new
––j m
UserMessage
––n y
(
––y z
)
––z {
{
––| }
messageContent––~ å
=––ç é
new––è í
MessageContent––ì °
{––¢ £
messageType––§ Ø
=––∞ ±#
invalidParameterMSG––≤ ≈
.––≈ ∆
messageType––∆ —
,––— “
messageCode––” ﬁ
=––ﬂ ‡#
invalidParameterMSG––· Ù
.––Ù ı
messageCode––ı Ä
,––Ä Å
message––Ç â
=––ä ã#
invalidParameterMSG––å ü
.––ü †
message––† ß
}––® ©
}––™ ´
)––´ ¨
;––¨ ≠
}
—— 
try
““ 
{
”” 
int
‘‘ 
page
‘‘ 
=
‘‘ %
requestSprocParameterVM
‘‘ 2
.
‘‘2 3
Page
‘‘3 7
==
‘‘8 :
$num
‘‘; <
?
‘‘= >
$num
‘‘? @
:
‘‘A B%
requestSprocParameterVM
‘‘C Z
.
‘‘Z [
Page
‘‘[ _
;
‘‘_ `
int
’’ 
limit
’’ 
=
’’ %
requestSprocParameterVM
’’ 3
.
’’3 4
pageSize
’’4 <
==
’’= ?
$num
’’@ A
?
’’B C
$num
’’D F
:
’’G H%
requestSprocParameterVM
’’I `
.
’’` a
pageSize
’’a i
;
’’i j
string
÷÷ 
orderBy
÷÷ 
=
÷÷  
string
÷÷! '
.
÷÷' (
Empty
÷÷( -
;
÷÷- .
string
◊◊ 
whereClause
◊◊ "
=
◊◊# $
$str
◊◊% ,
;
◊◊, -
List
ÿÿ 
<
ÿÿ %
UserSignUpAgreementList
ÿÿ ,
>
ÿÿ, -
agreementLists
ÿÿ. <
=
ÿÿ= >
new
ÿÿ? B
List
ÿÿC G
<
ÿÿG H%
UserSignUpAgreementList
ÿÿH _
>
ÿÿ_ `
(
ÿÿ` a
)
ÿÿa b
;
ÿÿb c
if
⁄⁄ 
(
⁄⁄ %
requestSprocParameterVM
⁄⁄ +
.
⁄⁄+ ,
SortColumns
⁄⁄, 7
.
⁄⁄7 8
Count
⁄⁄8 =
>
⁄⁄> ?
$num
⁄⁄@ A
)
⁄⁄A B
{
€€ 
orderBy
‹‹ 
+=
‹‹ 
OrderBy
‹‹ &
.
‹‹& '
GenerateOrderBy
‹‹' 6
(
‹‹6 7%
requestSprocParameterVM
‹‹7 N
.
‹‹N O
SortColumns
‹‹O Z
)
‹‹Z [
;
‹‹[ \
}
›› 
if
ﬁﬁ 
(
ﬁﬁ %
requestSprocParameterVM
ﬁﬁ +
.
ﬁﬁ+ ,
SearchColumns
ﬁﬁ, 9
.
ﬁﬁ9 :
Count
ﬁﬁ: ?
>
ﬁﬁ@ A
$num
ﬁﬁB C
)
ﬁﬁC D
{
ﬂﬂ 
whereClause
‡‡ 
+=
‡‡  "
WhereClause
‡‡# .
.
‡‡. /!
GenerateWhereClause
‡‡/ B
(
‡‡B C%
requestSprocParameterVM
‡‡C Z
.
‡‡Z [
SearchColumns
‡‡[ h
)
‡‡h i
;
‡‡i j
}
·· 
MySqlParameter
„„ 
[
„„ 
]
„„  

parameters
„„! +
=
„„, -
new
„„. 1
MySqlParameter
„„2 @
[
„„@ A
]
„„A B
{
„„C D
new
‰‰ 
MySqlParameter
‰‰ &
(
‰‰& '
$str
‰‰' 4
,
‰‰4 5
page
‰‰6 :
)
‰‰: ;
,
‰‰; <
new
ÂÂ 
MySqlParameter
ÂÂ &
(
ÂÂ& '
$str
ÂÂ' 8
,
ÂÂ8 9
limit
ÂÂ: ?
)
ÂÂ? @
,
ÂÂ@ A
new
ÊÊ 
MySqlParameter
ÊÊ &
(
ÊÊ& '
$str
ÊÊ' 2
,
ÊÊ2 3
orderBy
ÊÊ4 ;
)
ÊÊ; <
,
ÊÊ< =
new
ÁÁ 
MySqlParameter
ÁÁ &
(
ÁÁ& '
$str
ÁÁ' 6
,
ÁÁ6 7
whereClause
ÁÁ7 B
)
ÁÁB C
,
ÁÁC D
new
ËË 
MySqlParameter
ËË &
(
ËË& '
$str
ËË' 1
,
ËË1 2%
requestSprocParameterVM
ËË3 J
.
ËËJ K
userID
ËËK Q
)
ËËQ R
}
ÈÈ 
;
ÈÈ ,
UserSignUpAgreementListDetails
ÍÍ .,
userSignUpAgreementListDetails
ÍÍ/ M
=
ÍÍN O
await
ÍÍP U
_iDbRepository
ÍÍV d
.
ÍÍd e+
UserSignUpAgreementListAsyncÍÍe Å
(ÍÍÅ Ç
$strÍÍÇ ©
,ÍÍ© ™

parametersÍÍ´ µ
)ÍÍµ ∂
;ÍÍ∂ ∑)
UserSignUpAgreementListData
ÏÏ +)
userSignUpAgreementListData
ÏÏ, G
=
ÏÏH I
new
ÏÏJ M)
UserSignUpAgreementListData
ÏÏN i
{
ÌÌ 
AgreementUserList
ÓÓ %
=
ÓÓ& ',
userSignUpAgreementListDetails
ÓÓ( F
.
ÓÓF G&
UserSignUpAgreementLists
ÓÓG _
.
ÓÓ_ `
ToList
ÓÓ` f
(
ÓÓf g
)
ÓÓg h
,
ÓÓh i
Count
ÔÔ 
=
ÔÔ ,
userSignUpAgreementListDetails
ÔÔ :
.
ÔÔ: ;
	SpCountVM
ÔÔ; D
.
ÔÔD E
Select
ÔÔE K
(
ÔÔK L
x
ÔÔL M
=>
ÔÔN P
x
ÔÔQ R
.
ÔÔR S
TotalRecord
ÔÔS ^
)
ÔÔ^ _
.
ÔÔ_ `
FirstOrDefault
ÔÔ` n
(
ÔÔn o
)
ÔÔo p
}
 
;
 
return
ÚÚ '
_iHttpsResponseRepository
ÚÚ 0
.
ÚÚ0 1
ReturnResult
ÚÚ1 =
(
ÚÚ= >
APIStatusCode
ÚÚ> K
.
ÚÚK L
SUCCESS
ÚÚL S
,
ÚÚS T
APIState
ÚÚU ]
.
ÚÚ] ^
SUCCESS
ÚÚ^ e
,
ÚÚe f*
userSignUpAgreementListDataÚÚg Ç
,ÚÚÇ É
nullÚÚÑ à
)ÚÚà â
;ÚÚâ ä
}
ÛÛ 
catch
ÙÙ 
(
ÙÙ 
	Exception
ÙÙ 
e
ÙÙ 
)
ÙÙ 
{
ıı 
_logger
ˆˆ 
.
ˆˆ 
LogError
ˆˆ  
(
ˆˆ  !
e
ˆˆ! "
.
ˆˆ" #
ToString
ˆˆ# +
(
ˆˆ+ ,
)
ˆˆ, -
)
ˆˆ- .
;
ˆˆ. /
return
˜˜ 
await
˜˜ '
_iHttpsResponseRepository
˜˜ 6
.
˜˜6 7%
ReturnExceptionResponse
˜˜7 N
(
˜˜N O
e
˜˜O P
)
˜˜P Q
;
˜˜Q R
}
¯¯ 
}
˘˘ 	
[
ÄÄ 	
HttpPost
ÄÄ	 
]
ÄÄ 
public
ÅÅ 
async
ÅÅ 
Task
ÅÅ 
<
ÅÅ 
IActionResult
ÅÅ '
>
ÅÅ' (&
PublishAgreementTemplate
ÅÅ) A
(
ÅÅA B
[
ÅÅB C
FromBody
ÅÅC K
]
ÅÅK L 
RequestParameterVM
ÅÅM _ 
requestParameterVM
ÅÅ` r
)
ÅÅr s
{
ÇÇ 	
if
ÉÉ 
(
ÉÉ  
requestParameterVM
ÉÉ "
==
ÉÉ# %
null
ÉÉ& *
)
ÉÉ* +
{
ÑÑ 
var
ÖÖ !
invalidParameterMSG
ÖÖ '
=
ÖÖ( )
await
ÖÖ* /$
_dynamicMessageService
ÖÖ0 F
.
ÖÖF G
Get
ÖÖG J
(
ÖÖJ K
INVALID_PARAMETER
ÖÖK \
)
ÖÖ\ ]
;
ÖÖ] ^
return
ÜÜ '
_iHttpsResponseRepository
ÜÜ 0
.
ÜÜ0 1
ReturnResult
ÜÜ1 =
(
ÜÜ= >
APIStatusCode
ÜÜ> K
.
ÜÜK L
ERROR
ÜÜL Q
,
ÜÜQ R
APIState
ÜÜS [
.
ÜÜ[ \
FAILED
ÜÜ\ b
,
ÜÜb c
null
ÜÜd h
,
ÜÜh i
new
ÜÜj m
UserMessage
ÜÜn y
(
ÜÜy z
)
ÜÜz {
{
ÜÜ| }
messageContentÜÜ~ å
=ÜÜç é
newÜÜè í
MessageContentÜÜì °
{ÜÜ¢ £
messageTypeÜÜ§ Ø
=ÜÜ∞ ±#
invalidParameterMSGÜÜ≤ ≈
.ÜÜ≈ ∆
messageTypeÜÜ∆ —
,ÜÜ— “
messageCodeÜÜ” ﬁ
=ÜÜﬂ ‡#
invalidParameterMSGÜÜ· Ù
.ÜÜÙ ı
messageCodeÜÜı Ä
,ÜÜÄ Å
messageÜÜÇ â
=ÜÜä ã#
invalidParameterMSGÜÜå ü
.ÜÜü †
messageÜÜ† ß
}ÜÜ® ©
}ÜÜ™ ´
)ÜÜ´ ¨
;ÜÜ¨ ≠
}
áá 
try
àà 
{
ââ 
int
ää 
agreementTypeID
ää #
=
ää$ % 
requestParameterVM
ää& 8
.
ää8 9
agreementTypeID
ää9 H
;
ääH I
int
ãã 
?
ãã 

maxVersion
ãã 
=
ãã  !
await
ãã" '$
_iFJTIdentityDbContext
ãã( >
.
ãã> ?
	Agreement
ãã? H
.
ããH I
Where
ããI N
(
ããN O
x
ããO P
=>
ããQ S
x
ããT U
.
ããU V
agreementTypeID
ããV e
==
ããf h
agreementTypeID
ããi x
)
ããx y
.
ããy z
MaxAsyncããz Ç
(ããÇ É
xããÉ Ñ
=>ããÖ á
xããà â
.ããâ ä
versionããä ë
)ããë í
;ããí ì
	Agreement
åå 
	agreement
åå #
=
åå$ %
await
åå& +$
_iFJTIdentityDbContext
åå, B
.
ååB C
	Agreement
ååC L
.
ååL M!
FirstOrDefaultAsync
ååM `
(
åå` a
x
ååa b
=>
ååc e
x
ååf g
.
ååg h
agreementTypeID
ååh w
==
ååx z
agreementTypeIDåå{ ä
&&ååã ç
xååé è
.ååè ê
isPublishedååê õ
==ååú û
falseååü §
)åå§ •
;åå• ¶
if
çç 
(
çç 
	agreement
çç 
==
çç  
null
çç! %
)
çç% &
{
éé 
var
èè 
notFoundMSG
èè #
=
èè$ %
await
èè& +$
_dynamicMessageService
èè, B
.
èèB C
Get
èèC F
(
èèF G
	NOT_FOUND
èèG P
)
èèP Q
;
èèQ R
return
êê '
_iHttpsResponseRepository
êê 4
.
êê4 5
ReturnResult
êê5 A
(
êêA B
APIStatusCode
êêB O
.
êêO P
ERROR
êêP U
,
êêU V
APIState
êêW _
.
êê_ `
FAILED
êê` f
,
êêf g
null
êêh l
,
êêl m
new
êên q
UserMessage
êêr }
(
êê} ~
)
êê~ 
{êêÄ Å
messageContentêêÇ ê
=êêë í
newêêì ñ
MessageContentêêó •
{êê¶ ß
messageTypeêê® ≥
=êê¥ µ
notFoundMSGêê∂ ¡
.êê¡ ¬
messageTypeêê¬ Õ
,êêÕ Œ
messageCodeêêœ ⁄
=êê€ ‹
notFoundMSGêê› Ë
.êêË È
messageCodeêêÈ Ù
,êêÙ ı
messageêêˆ ˝
=êê˛ ˇ
stringêêÄ Ü
.êêÜ á
Formatêêá ç
(êêç é
notFoundMSGêêé ô
.êêô ö
messageêêö °
,êê° ¢ 
AGREEMENT_ENTITYêê£ ≥
)êê≥ ¥
}êêµ ∂
}êê∑ ∏
)êê∏ π
;êêπ ∫
}
ëë 
	agreement
íí 
.
íí 
version
íí !
=
íí" #

maxVersion
íí$ .
!=
íí/ 1
null
íí2 6
?
íí7 8

maxVersion
íí9 C
:
ííD E
$num
ííF G
;
ííG H
	agreement
ìì 
.
ìì 
isPublished
ìì %
=
ìì& '
true
ìì( ,
;
ìì, -
	agreement
îî 
.
îî 
publishedDate
îî '
=
îî( )
DateTime
îî* 2
.
îî2 3
UtcNow
îî3 9
;
îî9 :
	agreement
ïï 
.
ïï 
	updatedBy
ïï #
=
ïï$ % 
requestParameterVM
ïï& 8
.
ïï8 9
userName
ïï9 A
;
ïïA B
	agreement
ññ 
.
ññ 
updateByRole
ññ &
=
ññ' ( 
requestParameterVM
ññ) ;
.
ññ; <
userRoleName
ññ< H
;
ññH I
	agreement
óó 
.
óó 
	updatedAt
óó #
=
óó$ %
DateTime
óó& .
.
óó. /
UtcNow
óó/ 5
;
óó5 6
await
òò $
_iFJTIdentityDbContext
òò ,
.
òò, -
CustomSaveChanges
òò- >
(
òò> ?
)
òò? @
;
òò@ A
var
öö !
agreementPublishMSG
öö '
=
öö( )
await
öö* /$
_dynamicMessageService
öö0 F
.
ööF G
Get
ööG J
(
ööJ K
$str
ööK f
)
ööf g
;
öög h
return
õõ '
_iHttpsResponseRepository
õõ 0
.
õõ0 1
ReturnResult
õõ1 =
(
õõ= >
APIStatusCode
õõ> K
.
õõK L
SUCCESS
õõL S
,
õõS T
APIState
õõU ]
.
õõ] ^
SUCCESS
õõ^ e
,
õõe f
null
õõg k
,
õõk l
new
õõm p
UserMessage
õõq |
(
õõ| }
)
õõ} ~
{õõ Ä
messageõõÅ à
=õõâ ä#
agreementPublishMSGõõã û
.õõû ü
messageõõü ¶
}õõß ®
)õõ® ©
;õõ© ™
}
úú 
catch
ùù 
(
ùù 
	Exception
ùù 
e
ùù 
)
ùù 
{
ûû 
_logger
üü 
.
üü 
LogError
üü  
(
üü  !
e
üü! "
.
üü" #
ToString
üü# +
(
üü+ ,
)
üü, -
)
üü- .
;
üü. /
return
†† 
await
†† '
_iHttpsResponseRepository
†† 6
.
††6 7%
ReturnExceptionResponse
††7 N
(
††N O
e
††O P
)
††P Q
;
††Q R
}
°° 
}
¢¢ 	
[
©© 	
HttpPost
©©	 
]
©© 
public
™™ 
async
™™ 
Task
™™ 
<
™™ 
IActionResult
™™ '
>
™™' (+
RetriveArchieveVersionDetails
™™) F
(
™™F G
[
™™G H
FromBody
™™H P
]
™™P Q%
RequestSprocParameterVM
™™R i&
requestSprocParameterVM™™j Å
)™™Å Ç
{
´´ 	
if
¨¨ 
(
¨¨ %
requestSprocParameterVM
¨¨ '
==
¨¨( *
null
¨¨+ /
)
¨¨/ 0
{
≠≠ 
var
ÆÆ !
invalidParameterMSG
ÆÆ '
=
ÆÆ( )
await
ÆÆ* /$
_dynamicMessageService
ÆÆ0 F
.
ÆÆF G
Get
ÆÆG J
(
ÆÆJ K
INVALID_PARAMETER
ÆÆK \
)
ÆÆ\ ]
;
ÆÆ] ^
return
ØØ '
_iHttpsResponseRepository
ØØ 0
.
ØØ0 1
ReturnResult
ØØ1 =
(
ØØ= >
APIStatusCode
ØØ> K
.
ØØK L
ERROR
ØØL Q
,
ØØQ R
APIState
ØØS [
.
ØØ[ \
FAILED
ØØ\ b
,
ØØb c
null
ØØd h
,
ØØh i
new
ØØj m
UserMessage
ØØn y
(
ØØy z
)
ØØz {
{
ØØ| }
messageContentØØ~ å
=ØØç é
newØØè í
MessageContentØØì °
{ØØ¢ £
messageTypeØØ§ Ø
=ØØ∞ ±#
invalidParameterMSGØØ≤ ≈
.ØØ≈ ∆
messageTypeØØ∆ —
,ØØ— “
messageCodeØØ” ﬁ
=ØØﬂ ‡#
invalidParameterMSGØØ· Ù
.ØØÙ ı
messageCodeØØı Ä
,ØØÄ Å
messageØØÇ â
=ØØä ã#
invalidParameterMSGØØå ü
.ØØü †
messageØØ† ß
}ØØ® ©
}ØØ™ ´
)ØØ´ ¨
;ØØ¨ ≠
}
∞∞ 
try
±± 
{
≤≤ 
int
≥≥ 
page
≥≥ 
=
≥≥ %
requestSprocParameterVM
≥≥ 2
.
≥≥2 3
Page
≥≥3 7
==
≥≥8 :
$num
≥≥; <
?
≥≥= >
$num
≥≥? @
:
≥≥A B%
requestSprocParameterVM
≥≥C Z
.
≥≥Z [
Page
≥≥[ _
;
≥≥_ `
int
¥¥ 
limit
¥¥ 
=
¥¥ %
requestSprocParameterVM
¥¥ 3
.
¥¥3 4
pageSize
¥¥4 <
==
¥¥= ?
$num
¥¥@ A
?
¥¥B C
$num
¥¥D F
:
¥¥G H%
requestSprocParameterVM
¥¥I `
.
¥¥` a
pageSize
¥¥a i
;
¥¥i j
string
µµ 
orderBy
µµ 
=
µµ  
string
µµ! '
.
µµ' (
Empty
µµ( -
;
µµ- .
string
∂∂ 
whereClause
∂∂ "
=
∂∂# $
$str
∂∂% ,
;
∂∂, -
List
∑∑ 
<
∑∑ (
ArchieveVersionDetailsList
∑∑ /
>
∑∑/ 0
agreementLists
∑∑1 ?
=
∑∑@ A
new
∑∑B E
List
∑∑F J
<
∑∑J K(
ArchieveVersionDetailsList
∑∑K e
>
∑∑e f
(
∑∑f g
)
∑∑g h
;
∑∑h i
if
ππ 
(
ππ %
requestSprocParameterVM
ππ +
.
ππ+ ,
SortColumns
ππ, 7
.
ππ7 8
Count
ππ8 =
>
ππ> ?
$num
ππ@ A
)
ππA B
{
∫∫ 
orderBy
ªª 
+=
ªª 
OrderBy
ªª &
.
ªª& '
GenerateOrderBy
ªª' 6
(
ªª6 7%
requestSprocParameterVM
ªª7 N
.
ªªN O
SortColumns
ªªO Z
)
ªªZ [
;
ªª[ \
}
ºº 
if
ΩΩ 
(
ΩΩ %
requestSprocParameterVM
ΩΩ +
.
ΩΩ+ ,
SearchColumns
ΩΩ, 9
.
ΩΩ9 :
Count
ΩΩ: ?
>
ΩΩ@ A
$num
ΩΩB C
)
ΩΩC D
{
ææ 
whereClause
øø 
+=
øø  "
WhereClause
øø# .
.
øø. /!
GenerateWhereClause
øø/ B
(
øøB C%
requestSprocParameterVM
øøC Z
.
øøZ [
SearchColumns
øø[ h
)
øøh i
;
øøi j
}
¿¿ 
MySqlParameter
¬¬ 
[
¬¬ 
]
¬¬  

parameters
¬¬! +
=
¬¬, -
new
¬¬. 1
MySqlParameter
¬¬2 @
[
¬¬@ A
]
¬¬A B
{
¬¬C D
new
√√ 
MySqlParameter
√√ &
(
√√& '
$str
√√' 4
,
√√4 5
page
√√6 :
)
√√: ;
,
√√; <
new
ƒƒ 
MySqlParameter
ƒƒ &
(
ƒƒ& '
$str
ƒƒ' 8
,
ƒƒ8 9
limit
ƒƒ: ?
)
ƒƒ? @
,
ƒƒ@ A
new
≈≈ 
MySqlParameter
≈≈ &
(
≈≈& '
$str
≈≈' 2
,
≈≈2 3
orderBy
≈≈4 ;
)
≈≈; <
,
≈≈< =
new
∆∆ 
MySqlParameter
∆∆ &
(
∆∆& '
$str
∆∆' 6
,
∆∆6 7
whereClause
∆∆7 B
)
∆∆B C
,
∆∆C D
new
«« 
MySqlParameter
«« &
(
««& '
$str
««' :
,
««: ;%
requestSprocParameterVM
««; R
.
««R S
agreementID
««S ^
)
««^ _
,
««_ `
new
»» 
MySqlParameter
»» &
(
»»& '
$str
»»' 1
,
»»1 2%
requestSprocParameterVM
»»3 J
.
»»J K
userID
»»K Q
)
»»Q R
}
…… 
;
…… /
!ArchieveVersionDetailsListDetails
   1/
!archieveVersionDetailsListDetails
  2 S
=
  T U
await
  V [
_iDbRepository
  \ j
.
  j k.
ArchieveVersionDetailsListAsync  k ä
(  ä ã
$str  ã ±
,  ± ≤

parameters  ≥ Ω
)  Ω æ
;  æ ø
var
ÃÃ ,
archieveVersionDetailsListData
ÃÃ 2
=
ÃÃ3 4
new
ÃÃ5 8,
ArchieveVersionDetailsListData
ÃÃ9 W
{
ÕÕ 
ArchieveList
ŒŒ  
=
ŒŒ! "/
!archieveVersionDetailsListDetails
ŒŒ# D
.
ŒŒD E)
ArchieveVersionDetailsLists
ŒŒE `
.
ŒŒ` a
ToList
ŒŒa g
(
ŒŒg h
)
ŒŒh i
,
ŒŒi j
Count
œœ 
=
œœ /
!archieveVersionDetailsListDetails
œœ =
.
œœ= >
	SpCountVM
œœ> G
.
œœG H
Select
œœH N
(
œœN O
x
œœO P
=>
œœQ S
x
œœT U
.
œœU V
TotalRecord
œœV a
)
œœa b
.
œœb c
FirstOrDefault
œœc q
(
œœq r
)
œœr s
}
–– 
;
–– 
return
—— '
_iHttpsResponseRepository
—— 0
.
——0 1
ReturnResult
——1 =
(
——= >
APIStatusCode
——> K
.
——K L
SUCCESS
——L S
,
——S T
APIState
——U ]
.
——] ^
SUCCESS
——^ e
,
——e f-
archieveVersionDetailsListData——g Ö
,——Ö Ü
null——á ã
)——ã å
;——å ç
}
““ 
catch
”” 
(
”” 
	Exception
”” 
e
”” 
)
”” 
{
‘‘ 
_logger
’’ 
.
’’ 
LogError
’’  
(
’’  !
e
’’! "
.
’’" #
ToString
’’# +
(
’’+ ,
)
’’, -
)
’’- .
;
’’. /
return
÷÷ 
await
÷÷ '
_iHttpsResponseRepository
÷÷ 6
.
÷÷6 7%
ReturnExceptionResponse
÷÷7 N
(
÷÷N O
e
÷÷O P
)
÷÷P Q
;
÷÷Q R
}
◊◊ 
}
ÿÿ 	
[
ﬂﬂ 	
HttpPost
ﬂﬂ	 
]
ﬂﬂ 
public
‡‡ 
async
‡‡ 
Task
‡‡ 
<
‡‡ 
IActionResult
‡‡ '
>
‡‡' ()
CheckDuplicateAgreementType
‡‡) D
(
‡‡D E
[
‡‡E F
FromBody
‡‡F N
]
‡‡N O 
RequestParameterVM
‡‡P b 
requestParameterVM
‡‡c u
)
‡‡u v
{
·· 	
if
‚‚ 
(
‚‚  
requestParameterVM
‚‚ "
==
‚‚# %
null
‚‚& *
)
‚‚* +
{
„„ 
var
‰‰ !
invalidParameterMSG
‰‰ '
=
‰‰( )
await
‰‰* /$
_dynamicMessageService
‰‰0 F
.
‰‰F G
Get
‰‰G J
(
‰‰J K
INVALID_PARAMETER
‰‰K \
)
‰‰\ ]
;
‰‰] ^
return
ÂÂ '
_iHttpsResponseRepository
ÂÂ 0
.
ÂÂ0 1
ReturnResult
ÂÂ1 =
(
ÂÂ= >
APIStatusCode
ÂÂ> K
.
ÂÂK L
ERROR
ÂÂL Q
,
ÂÂQ R
APIState
ÂÂS [
.
ÂÂ[ \
FAILED
ÂÂ\ b
,
ÂÂb c
null
ÂÂd h
,
ÂÂh i
new
ÂÂj m
UserMessage
ÂÂn y
(
ÂÂy z
)
ÂÂz {
{
ÂÂ| }
messageContentÂÂ~ å
=ÂÂç é
newÂÂè í
MessageContentÂÂì °
{ÂÂ¢ £
messageTypeÂÂ§ Ø
=ÂÂ∞ ±#
invalidParameterMSGÂÂ≤ ≈
.ÂÂ≈ ∆
messageTypeÂÂ∆ —
,ÂÂ— “
messageCodeÂÂ” ﬁ
=ÂÂﬂ ‡#
invalidParameterMSGÂÂ· Ù
.ÂÂÙ ı
messageCodeÂÂı Ä
,ÂÂÄ Å
messageÂÂÇ â
=ÂÂä ã#
invalidParameterMSGÂÂå ü
.ÂÂü †
messageÂÂ† ß
}ÂÂ® ©
}ÂÂ™ ´
)ÂÂ´ ¨
;ÂÂ¨ ≠
}
ÊÊ 
try
ÁÁ 
{
ËË 
bool
ÈÈ 
isDuplicate
ÈÈ  
=
ÈÈ! "
false
ÈÈ# (
;
ÈÈ( )
int
ÍÍ 
?
ÍÍ 
agreementTypeID
ÍÍ $
=
ÍÍ% &
await
ÍÍ' ,$
_iFJTIdentityDbContext
ÍÍ- C
.
ÍÍC D
AgreementType
ÍÍD Q
.
ÍÍQ R
Where
ÍÍR W
(
ÍÍW X
x
ÍÍX Y
=>
ÍÍZ \
x
ÍÍ] ^
.
ÍÍ^ _
agreementTypeID
ÍÍ_ n
==
ÍÍo q!
requestParameterVMÍÍr Ñ
.ÍÍÑ Ö
agreementTypeIDÍÍÖ î
&&ÍÍï ó
xÍÍò ô
.ÍÍô ö
displayNameÍÍö •
==ÍÍ¶ ®"
requestParameterVMÍÍ© ª
.ÍÍª º
displayNameÍÍº «
&&ÍÍ»  
xÍÍÀ Ã
.ÍÍÃ Õ
templateTypeÍÍÕ Ÿ
==ÍÍ⁄ ‹"
requestParameterVMÍÍ› Ô
.ÍÍÔ 
templateTypeÍÍ ¸
&&ÍÍ˝ ˇ
xÍÍÄ Å
.ÍÍÅ Ç
	isDeletedÍÍÇ ã
==ÍÍå é
falseÍÍè î
)ÍÍî ï
.ÍÍï ñ
SelectÍÍñ ú
(ÍÍú ù
xÍÍù û
=>ÍÍü °
xÍÍ¢ £
.ÍÍ£ §
agreementTypeIDÍÍ§ ≥
)ÍÍ≥ ¥
.ÍÍ¥ µ#
FirstOrDefaultAsyncÍÍµ »
(ÍÍ» …
)ÍÍ…  
;ÍÍ  À
if
ÎÎ 
(
ÎÎ 
!
ÎÎ 
(
ÎÎ 
agreementTypeID
ÎÎ %
==
ÎÎ& (
null
ÎÎ) -
||
ÎÎ. 0
agreementTypeID
ÎÎ1 @
==
ÎÎA C
$num
ÎÎD E
)
ÎÎE F
)
ÎÎF G
{
ÏÏ 
isDuplicate
ÌÌ 
=
ÌÌ  !
true
ÌÌ" &
;
ÌÌ& '
}
ÓÓ 
CommonResponse
ÔÔ 
commonResponse
ÔÔ -
=
ÔÔ. /
new
ÔÔ0 3
CommonResponse
ÔÔ4 B
{
 
isDuplicate
ÒÒ 
=
ÒÒ  !
isDuplicate
ÒÒ" -
}
ÚÚ 
;
ÚÚ 
return
ÙÙ '
_iHttpsResponseRepository
ÙÙ 0
.
ÙÙ0 1
ReturnResult
ÙÙ1 =
(
ÙÙ= >
APIStatusCode
ÙÙ> K
.
ÙÙK L
SUCCESS
ÙÙL S
,
ÙÙS T
APIState
ÙÙU ]
.
ÙÙ] ^
SUCCESS
ÙÙ^ e
,
ÙÙe f
commonResponse
ÙÙg u
,
ÙÙu v
null
ÙÙw {
)
ÙÙ{ |
;
ÙÙ| }
}
ıı 
catch
ˆˆ 
(
ˆˆ 
	Exception
ˆˆ 
e
ˆˆ 
)
ˆˆ 
{
˜˜ 
_logger
¯¯ 
.
¯¯ 
LogError
¯¯  
(
¯¯  !
e
¯¯! "
.
¯¯" #
ToString
¯¯# +
(
¯¯+ ,
)
¯¯, -
)
¯¯- .
;
¯¯. /
return
˘˘ 
await
˘˘ '
_iHttpsResponseRepository
˘˘ 6
.
˘˘6 7%
ReturnExceptionResponse
˘˘7 N
(
˘˘N O
e
˘˘O P
)
˘˘P Q
;
˘˘Q R
}
˙˙ 
}
˚˚ 	
[
ÇÇ 	
HttpPost
ÇÇ	 
]
ÇÇ 
public
ÉÉ 
async
ÉÉ 
Task
ÉÉ 
<
ÉÉ 
IActionResult
ÉÉ '
>
ÉÉ' (
SaveAgreementType
ÉÉ) :
(
ÉÉ: ;
[
ÉÉ; <
FromBody
ÉÉ< D
]
ÉÉD E 
RequestParameterVM
ÉÉF X 
requestParameterVM
ÉÉY k
)
ÉÉk l
{
ÑÑ 	
if
ÖÖ 
(
ÖÖ  
requestParameterVM
ÖÖ "
==
ÖÖ# %
null
ÖÖ& *
)
ÖÖ* +
{
ÜÜ 
var
áá !
invalidParameterMSG
áá '
=
áá( )
await
áá* /$
_dynamicMessageService
áá0 F
.
ááF G
Get
ááG J
(
ááJ K
INVALID_PARAMETER
ááK \
)
áá\ ]
;
áá] ^
return
àà '
_iHttpsResponseRepository
àà 0
.
àà0 1
ReturnResult
àà1 =
(
àà= >
APIStatusCode
àà> K
.
ààK L
ERROR
ààL Q
,
ààQ R
APIState
ààS [
.
àà[ \
FAILED
àà\ b
,
ààb c
null
ààd h
,
ààh i
new
ààj m
UserMessage
ààn y
(
àày z
)
ààz {
{
àà| }
messageContentàà~ å
=ààç é
newààè í
MessageContentààì °
{àà¢ £
messageTypeàà§ Ø
=àà∞ ±#
invalidParameterMSGàà≤ ≈
.àà≈ ∆
messageTypeàà∆ —
,àà— “
messageCodeàà” ﬁ
=ààﬂ ‡#
invalidParameterMSGàà· Ù
.ààÙ ı
messageCodeààı Ä
,ààÄ Å
messageààÇ â
=ààä ã#
invalidParameterMSGààå ü
.ààü †
messageàà† ß
}àà® ©
}àà™ ´
)àà´ ¨
;àà¨ ≠
}
ââ 
try
ää 
{
ãã 
var
åå 
agreementType
åå !
=
åå" #
await
åå$ )$
_iFJTIdentityDbContext
åå* @
.
åå@ A
AgreementType
ååA N
.
ååN O
Where
ååO T
(
ååT U
x
ååU V
=>
ååW Y
x
ååZ [
.
åå[ \
agreementTypeID
åå\ k
==
åål n!
requestParameterVMååo Å
.ååÅ Ç
agreementTypeIDååÇ ë
)ååë í
.ååí ì#
FirstOrDefaultAsyncååì ¶
(åå¶ ß
)ååß ®
;åå® ©
if
çç 
(
çç 
agreementType
çç !
==
çç" $
null
çç% )
)
çç) *
{
éé 
var
èè 
notFoundMSG
èè #
=
èè$ %
await
èè& +$
_dynamicMessageService
èè, B
.
èèB C
Get
èèC F
(
èèF G
	NOT_FOUND
èèG P
)
èèP Q
;
èèQ R
return
êê '
_iHttpsResponseRepository
êê 4
.
êê4 5
ReturnResult
êê5 A
(
êêA B
APIStatusCode
êêB O
.
êêO P
ERROR
êêP U
,
êêU V
APIState
êêW _
.
êê_ `
FAILED
êê` f
,
êêf g
null
êêh l
,
êêl m
new
êên q
UserMessage
êêr }
(
êê} ~
)
êê~ 
{êêÄ Å
messageContentêêÇ ê
=êêë í
newêêì ñ
MessageContentêêó •
{êê¶ ß
messageTypeêê® ≥
=êê¥ µ
notFoundMSGêê∂ ¡
.êê¡ ¬
messageTypeêê¬ Õ
,êêÕ Œ
messageCodeêêœ ⁄
=êê€ ‹
notFoundMSGêê› Ë
.êêË È
messageCodeêêÈ Ù
,êêÙ ı
messageêêˆ ˝
=êê˛ ˇ
stringêêÄ Ü
.êêÜ á
Formatêêá ç
(êêç é
notFoundMSGêêé ô
.êêô ö
messageêêö °
,êê° ¢ 
AGREEMENT_ENTITYêê£ ≥
)êê≥ ¥
}êêµ ∂
}êê∑ ∏
)êê∏ π
;êêπ ∫
}
ëë 
agreementType
íí 
.
íí 
displayName
íí )
=
íí* + 
requestParameterVM
íí, >
.
íí> ?
displayName
íí? J
;
ííJ K
agreementType
ìì 
.
ìì 
	updatedBy
ìì '
=
ìì( ) 
requestParameterVM
ìì* <
.
ìì< =
userName
ìì= E
;
ììE F
agreementType
îî 
.
îî 
updateByRole
îî *
=
îî+ , 
requestParameterVM
îî- ?
.
îî? @
userRoleName
îî@ L
;
îîL M
agreementType
ïï 
.
ïï 
	updatedAt
ïï '
=
ïï( )
DateTime
ïï* 2
.
ïï2 3
UtcNow
ïï3 9
;
ïï9 :
await
ññ $
_iFJTIdentityDbContext
ññ ,
.
ññ, -
CustomSaveChanges
ññ- >
(
ññ> ?
)
ññ? @
;
ññ@ A
CommonResponse
òò 
commonResponse
òò -
=
òò. /
new
òò0 3
CommonResponse
òò4 B
{
ôô 
agreementTypeID
öö #
=
öö$ % 
requestParameterVM
öö& 8
.
öö8 9
agreementTypeID
öö9 H
}
õõ 
;
õõ 
var
ùù 
savedMSG
ùù 
=
ùù 
await
ùù $$
_dynamicMessageService
ùù% ;
.
ùù; <
Get
ùù< ?
(
ùù? @
SAVED
ùù@ E
)
ùùE F
;
ùùF G
return
ûû '
_iHttpsResponseRepository
ûû 0
.
ûû0 1
ReturnResult
ûû1 =
(
ûû= >
APIStatusCode
ûû> K
.
ûûK L
SUCCESS
ûûL S
,
ûûS T
APIState
ûûU ]
.
ûû] ^
SUCCESS
ûû^ e
,
ûûe f
commonResponse
ûûg u
,
ûûu v
new
ûûw z
UserMessageûû{ Ü
(ûûÜ á
)ûûá à
{ûûâ ä
messageûûã í
=ûûì î
stringûûï õ
.ûûõ ú
Formatûûú ¢
(ûû¢ £
savedMSGûû£ ´
.ûû´ ¨
messageûû¨ ≥
,ûû≥ ¥ 
AGREEMENT_ENTITYûûµ ≈
)ûû≈ ∆
}ûû« »
)ûû» …
;ûû…  
}
üü 
catch
†† 
(
†† 
	Exception
†† 
e
†† 
)
†† 
{
°° 
_logger
¢¢ 
.
¢¢ 
LogError
¢¢  
(
¢¢  !
e
¢¢! "
.
¢¢" #
ToString
¢¢# +
(
¢¢+ ,
)
¢¢, -
)
¢¢- .
;
¢¢. /
return
££ 
await
££ '
_iHttpsResponseRepository
££ 6
.
££6 7%
ReturnExceptionResponse
££7 N
(
££N O
e
££O P
)
££P Q
;
££Q R
}
§§ 
}
•• 	
[
¨¨ 	
HttpPost
¨¨	 
]
¨¨ 
public
≠≠ 
async
≠≠ 
Task
≠≠ 
<
≠≠ 
IActionResult
≠≠ '
>
≠≠' (
GetAgreedUserList
≠≠) :
(
≠≠: ;
[
≠≠; <
FromBody
≠≠< D
]
≠≠D E%
RequestSprocParameterVM
≠≠F ]%
requestSprocParameterVM
≠≠^ u
)
≠≠u v
{
ÆÆ 	
if
ØØ 
(
ØØ %
requestSprocParameterVM
ØØ '
==
ØØ( *
null
ØØ+ /
)
ØØ/ 0
{
∞∞ 
var
±± !
invalidParameterMSG
±± '
=
±±( )
await
±±* /$
_dynamicMessageService
±±0 F
.
±±F G
Get
±±G J
(
±±J K
INVALID_PARAMETER
±±K \
)
±±\ ]
;
±±] ^
return
≤≤ '
_iHttpsResponseRepository
≤≤ 0
.
≤≤0 1
ReturnResult
≤≤1 =
(
≤≤= >
APIStatusCode
≤≤> K
.
≤≤K L
ERROR
≤≤L Q
,
≤≤Q R
APIState
≤≤S [
.
≤≤[ \
FAILED
≤≤\ b
,
≤≤b c
null
≤≤d h
,
≤≤h i
new
≤≤j m
UserMessage
≤≤n y
(
≤≤y z
)
≤≤z {
{
≤≤| }
messageContent≤≤~ å
=≤≤ç é
new≤≤è í
MessageContent≤≤ì °
{≤≤¢ £
messageType≤≤§ Ø
=≤≤∞ ±#
invalidParameterMSG≤≤≤ ≈
.≤≤≈ ∆
messageType≤≤∆ —
,≤≤— “
messageCode≤≤” ﬁ
=≤≤ﬂ ‡#
invalidParameterMSG≤≤· Ù
.≤≤Ù ı
messageCode≤≤ı Ä
,≤≤Ä Å
message≤≤Ç â
=≤≤ä ã#
invalidParameterMSG≤≤å ü
.≤≤ü †
message≤≤† ß
}≤≤® ©
}≤≤™ ´
)≤≤´ ¨
;≤≤¨ ≠
}
≥≥ 
try
¥¥ 
{
µµ 
int
∂∂ 
page
∂∂ 
=
∂∂ %
requestSprocParameterVM
∂∂ 2
.
∂∂2 3
Page
∂∂3 7
==
∂∂8 :
$num
∂∂; <
?
∂∂= >
$num
∂∂? @
:
∂∂A B%
requestSprocParameterVM
∂∂C Z
.
∂∂Z [
Page
∂∂[ _
;
∂∂_ `
int
∑∑ 
limit
∑∑ 
=
∑∑ %
requestSprocParameterVM
∑∑ 3
.
∑∑3 4
pageSize
∑∑4 <
==
∑∑= ?
$num
∑∑@ A
?
∑∑B C
$num
∑∑D F
:
∑∑G H%
requestSprocParameterVM
∑∑I `
.
∑∑` a
pageSize
∑∑a i
;
∑∑i j
string
∏∏ 
orderBy
∏∏ 
=
∏∏  
string
∏∏! '
.
∏∏' (
Empty
∏∏( -
;
∏∏- .
string
ππ 
whereClause
ππ "
=
ππ# $
$str
ππ% ,
;
ππ, -
List
∫∫ 
<
∫∫ !
GetAgreedUserListVM
∫∫ (
>
∫∫( )
agreementLists
∫∫* 8
=
∫∫9 :
new
∫∫; >
List
∫∫? C
<
∫∫C D!
GetAgreedUserListVM
∫∫D W
>
∫∫W X
(
∫∫X Y
)
∫∫Y Z
;
∫∫Z [
if
ºº 
(
ºº %
requestSprocParameterVM
ºº +
.
ºº+ ,
SortColumns
ºº, 7
.
ºº7 8
Count
ºº8 =
>
ºº> ?
$num
ºº@ A
)
ººA B
{
ΩΩ 
orderBy
ææ 
+=
ææ 
OrderBy
ææ &
.
ææ& '
GenerateOrderBy
ææ' 6
(
ææ6 7%
requestSprocParameterVM
ææ7 N
.
ææN O
SortColumns
ææO Z
)
ææZ [
;
ææ[ \
}
øø 
if
¿¿ 
(
¿¿ %
requestSprocParameterVM
¿¿ +
.
¿¿+ ,
SearchColumns
¿¿, 9
.
¿¿9 :
Count
¿¿: ?
>
¿¿@ A
$num
¿¿B C
)
¿¿C D
{
¡¡ 
whereClause
¬¬ 
+=
¬¬  "
WhereClause
¬¬# .
.
¬¬. /!
GenerateWhereClause
¬¬/ B
(
¬¬B C%
requestSprocParameterVM
¬¬C Z
.
¬¬Z [
SearchColumns
¬¬[ h
)
¬¬h i
;
¬¬i j
}
√√ 
MySqlParameter
≈≈ 
[
≈≈ 
]
≈≈  

parameters
≈≈! +
=
≈≈, -
new
≈≈. 1
MySqlParameter
≈≈2 @
[
≈≈@ A
]
≈≈A B
{
≈≈C D
new
∆∆ 
MySqlParameter
∆∆ &
(
∆∆& '
$str
∆∆' 4
,
∆∆4 5
page
∆∆6 :
)
∆∆: ;
,
∆∆; <
new
«« 
MySqlParameter
«« &
(
««& '
$str
««' 8
,
««8 9
limit
««: ?
)
««? @
,
««@ A
new
»» 
MySqlParameter
»» &
(
»»& '
$str
»»' 2
,
»»2 3
orderBy
»»4 ;
)
»»; <
,
»»< =
new
…… 
MySqlParameter
…… &
(
……& '
$str
……' 6
,
……6 7
whereClause
……7 B
)
……B C
,
……C D
new
   
MySqlParameter
   &
(
  & '
$str
  ' :
,
  : ;%
requestSprocParameterVM
  < S
.
  S T
agreementTypeID
  T c
)
  c d
,
  d e
new
ÀÀ 
MySqlParameter
ÀÀ &
(
ÀÀ& '
$str
ÀÀ' 1
,
ÀÀ1 2%
requestSprocParameterVM
ÀÀ3 J
.
ÀÀJ K
userID
ÀÀK Q
)
ÀÀQ R
}
ÃÃ 
;
ÃÃ (
GetAgreedUserListVMDetails
ÕÕ *(
getAgreedUserListVMDetails
ÕÕ+ E
=
ÕÕF G
await
ÕÕH M
_iDbRepository
ÕÕN \
.
ÕÕ\ ]$
GetAgreedUserListAsync
ÕÕ] s
(
ÕÕs t
$strÕÕt ç
,ÕÕç é

parametersÕÕè ô
)ÕÕô ö
;ÕÕö õ
var
œœ %
getAgreedUserListVMData
œœ +
=
œœ, -
new
œœ. 1%
GetAgreedUserListVMData
œœ2 I
(
œœI J
)
œœJ K
{
–– 
AgreedUserList
—— "
=
——# $(
getAgreedUserListVMDetails
——% ?
.
——? @"
GetAgreedUserListVMs
——@ T
.
——T U
ToList
——U [
(
——[ \
)
——\ ]
,
——] ^
Count
““ 
=
““ (
getAgreedUserListVMDetails
““ 6
.
““6 7
	SpCountVM
““7 @
.
““@ A
Select
““A G
(
““G H
x
““H I
=>
““J L
x
““M N
.
““N O
TotalRecord
““O Z
)
““Z [
.
““[ \
FirstOrDefault
““\ j
(
““j k
)
““k l
}
”” 
;
”” 
return
’’ '
_iHttpsResponseRepository
’’ 0
.
’’0 1
ReturnResult
’’1 =
(
’’= >
APIStatusCode
’’> K
.
’’K L
SUCCESS
’’L S
,
’’S T
APIState
’’U ]
.
’’] ^
SUCCESS
’’^ e
,
’’e f%
getAgreedUserListVMData
’’g ~
,
’’~ 
null’’Ä Ñ
)’’Ñ Ö
;’’Ö Ü
}
÷÷ 
catch
◊◊ 
(
◊◊ 
	Exception
◊◊ 
e
◊◊ 
)
◊◊ 
{
ÿÿ 
_logger
ŸŸ 
.
ŸŸ 
LogError
ŸŸ  
(
ŸŸ  !
e
ŸŸ! "
.
ŸŸ" #
ToString
ŸŸ# +
(
ŸŸ+ ,
)
ŸŸ, -
)
ŸŸ- .
;
ŸŸ. /
return
⁄⁄ 
await
⁄⁄ '
_iHttpsResponseRepository
⁄⁄ 6
.
⁄⁄6 7%
ReturnExceptionResponse
⁄⁄7 N
(
⁄⁄N O
e
⁄⁄O P
)
⁄⁄P Q
;
⁄⁄Q R
}
€€ 
}
‹‹ 	
[
‰‰ 	
HttpPost
‰‰	 
]
‰‰ 
public
ÂÂ 
async
ÂÂ 
Task
ÂÂ 
<
ÂÂ 
IActionResult
ÂÂ '
>
ÂÂ' (#
CreateUpdateAgreement
ÂÂ) >
(
ÂÂ> ?
int
ÂÂ? B
agreementID
ÂÂC N
,
ÂÂN O
[
ÂÂP Q
FromBody
ÂÂQ Y
]
ÂÂY Z
AgreementVM
ÂÂ[ f
agreementVM
ÂÂg r
)
ÂÂr s
{
ÊÊ 	
if
ÁÁ 
(
ÁÁ 
agreementVM
ÁÁ 
==
ÁÁ 
null
ÁÁ #
)
ÁÁ# $
{
ËË 
var
ÈÈ !
invalidParameterMSG
ÈÈ '
=
ÈÈ( )
await
ÈÈ* /$
_dynamicMessageService
ÈÈ0 F
.
ÈÈF G
Get
ÈÈG J
(
ÈÈJ K
INVALID_PARAMETER
ÈÈK \
)
ÈÈ\ ]
;
ÈÈ] ^
return
ÍÍ '
_iHttpsResponseRepository
ÍÍ 0
.
ÍÍ0 1
ReturnResult
ÍÍ1 =
(
ÍÍ= >
APIStatusCode
ÍÍ> K
.
ÍÍK L
ERROR
ÍÍL Q
,
ÍÍQ R
APIState
ÍÍS [
.
ÍÍ[ \
FAILED
ÍÍ\ b
,
ÍÍb c
null
ÍÍd h
,
ÍÍh i
new
ÍÍj m
UserMessage
ÍÍn y
(
ÍÍy z
)
ÍÍz {
{
ÍÍ| }
messageContentÍÍ~ å
=ÍÍç é
newÍÍè í
MessageContentÍÍì °
{ÍÍ¢ £
messageTypeÍÍ§ Ø
=ÍÍ∞ ±#
invalidParameterMSGÍÍ≤ ≈
.ÍÍ≈ ∆
messageTypeÍÍ∆ —
,ÍÍ— “
messageCodeÍÍ” ﬁ
=ÍÍﬂ ‡#
invalidParameterMSGÍÍ· Ù
.ÍÍÙ ı
messageCodeÍÍı Ä
,ÍÍÄ Å
messageÍÍÇ â
=ÍÍä ã#
invalidParameterMSGÍÍå ü
.ÍÍü †
messageÍÍ† ß
}ÍÍ® ©
}ÍÍ™ ´
)ÍÍ´ ¨
;ÍÍ¨ ≠
}
ÎÎ 
try
ÏÏ 
{
ÌÌ 
if
ÓÓ 
(
ÓÓ 
!
ÓÓ 
string
ÓÓ 
.
ÓÓ 
IsNullOrEmpty
ÓÓ )
(
ÓÓ) *
agreementVM
ÓÓ* 5
.
ÓÓ5 6
agreementContent
ÓÓ6 F
)
ÓÓF G
)
ÓÓG H
{
ÔÔ 
agreementVM
 
.
  
agreementContent
  0
=
1 2$
_textAngularValueForDB
3 I
.
I J&
SetTextAngularValueForDB
J b
(
b c
agreementVM
c n
.
n o
agreementContent
o 
) Ä
;Ä Å
if
ÒÒ 
(
ÒÒ 
agreementVM
ÒÒ #
.
ÒÒ# $
agreementContent
ÒÒ$ 4
==
ÒÒ5 7
null
ÒÒ8 <
)
ÒÒ< =
{
ÚÚ 
var
ÛÛ 
somethingWrongMSG
ÛÛ -
=
ÛÛ. /
await
ÛÛ0 5$
_dynamicMessageService
ÛÛ6 L
.
ÛÛL M
Get
ÛÛM P
(
ÛÛP Q
SOMTHING_WRONG
ÛÛQ _
)
ÛÛ_ `
;
ÛÛ` a
return
ÙÙ '
_iHttpsResponseRepository
ÙÙ 8
.
ÙÙ8 9
ReturnResult
ÙÙ9 E
(
ÙÙE F
APIStatusCode
ÙÙF S
.
ÙÙS T
ERROR
ÙÙT Y
,
ÙÙY Z
APIState
ÙÙ[ c
.
ÙÙc d
FAILED
ÙÙd j
,
ÙÙj k
null
ÙÙl p
,
ÙÙp q
new
ÙÙr u
UserMessageÙÙv Å
(ÙÙÅ Ç
)ÙÙÇ É
{ÙÙÑ Ö
messageContentÙÙÜ î
=ÙÙï ñ
newÙÙó ö
MessageContentÙÙõ ©
{ÙÙ™ ´
messageTypeÙÙ¨ ∑
=ÙÙ∏ π!
somethingWrongMSGÙÙ∫ À
.ÙÙÀ Ã
messageTypeÙÙÃ ◊
,ÙÙ◊ ÿ
messageCodeÙÙŸ ‰
=ÙÙÂ Ê!
somethingWrongMSGÙÙÁ ¯
.ÙÙ¯ ˘
messageCodeÙÙ˘ Ñ
,ÙÙÑ Ö
messageÙÙÜ ç
=ÙÙé è!
somethingWrongMSGÙÙê °
.ÙÙ° ¢
messageÙÙ¢ ©
}ÙÙ™ ´
}ÙÙ¨ ≠
)ÙÙ≠ Æ
;ÙÙÆ Ø
}
ıı 
}
ˆˆ 
if
¯¯ 
(
¯¯ 
!
¯¯ 
string
¯¯ 
.
¯¯ 
IsNullOrEmpty
¯¯ )
(
¯¯) *
agreementVM
¯¯* 5
.
¯¯5 6
agreementSubject
¯¯6 F
)
¯¯F G
)
¯¯G H
{
˘˘ 
agreementVM
˙˙ 
.
˙˙  
agreementSubject
˙˙  0
=
˙˙1 2$
_textAngularValueForDB
˙˙3 I
.
˙˙I J&
SetTextAngularValueForDB
˙˙J b
(
˙˙b c
agreementVM
˙˙c n
.
˙˙n o
agreementSubject
˙˙o 
)˙˙ Ä
;˙˙Ä Å
if
˚˚ 
(
˚˚ 
agreementVM
˚˚ #
.
˚˚# $
agreementSubject
˚˚$ 4
==
˚˚5 7
null
˚˚8 <
)
˚˚< =
{
¸¸ 
var
˝˝ 
somethingWrongMSG
˝˝ -
=
˝˝. /
await
˝˝0 5$
_dynamicMessageService
˝˝6 L
.
˝˝L M
Get
˝˝M P
(
˝˝P Q
SOMTHING_WRONG
˝˝Q _
)
˝˝_ `
;
˝˝` a
return
˛˛ '
_iHttpsResponseRepository
˛˛ 8
.
˛˛8 9
ReturnResult
˛˛9 E
(
˛˛E F
APIStatusCode
˛˛F S
.
˛˛S T
ERROR
˛˛T Y
,
˛˛Y Z
APIState
˛˛[ c
.
˛˛c d
FAILED
˛˛d j
,
˛˛j k
null
˛˛l p
,
˛˛p q
new
˛˛r u
UserMessage˛˛v Å
(˛˛Å Ç
)˛˛Ç É
{˛˛Ñ Ö
messageContent˛˛Ü î
=˛˛ï ñ
new˛˛ó ö
MessageContent˛˛õ ©
{˛˛™ ´
messageType˛˛¨ ∑
=˛˛∏ π!
somethingWrongMSG˛˛∫ À
.˛˛À Ã
messageType˛˛Ã ◊
,˛˛◊ ÿ
messageCode˛˛Ÿ ‰
=˛˛Â Ê!
somethingWrongMSG˛˛Á ¯
.˛˛¯ ˘
messageCode˛˛˘ Ñ
,˛˛Ñ Ö
message˛˛Ü ç
=˛˛é è!
somethingWrongMSG˛˛ê °
.˛˛° ¢
message˛˛¢ ©
}˛˛™ ´
}˛˛¨ ≠
)˛˛≠ Æ
;˛˛Æ Ø
}
ˇˇ 
}
ÄÄ 
if
ÇÇ 
(
ÇÇ 
agreementID
ÇÇ 
!=
ÇÇ  "
$num
ÇÇ# $
)
ÇÇ$ %
{
ÉÉ 
var
ÖÖ 
	agreement
ÖÖ !
=
ÖÖ" #
await
ÖÖ$ )$
_iFJTIdentityDbContext
ÖÖ* @
.
ÖÖ@ A
	Agreement
ÖÖA J
.
ÖÖJ K!
FirstOrDefaultAsync
ÖÖK ^
(
ÖÖ^ _
x
ÖÖ_ `
=>
ÖÖa c
x
ÖÖd e
.
ÖÖe f
agreementID
ÖÖf q
==
ÖÖr t
agreementIDÖÖu Ä
&&ÖÖÅ É
xÖÖÑ Ö
.ÖÖÖ Ü
	isDeletedÖÖÜ è
==ÖÖê í
falseÖÖì ò
)ÖÖò ô
;ÖÖô ö
if
ÜÜ 
(
ÜÜ 
	agreement
ÜÜ !
==
ÜÜ" $
null
ÜÜ% )
)
ÜÜ) *
{
áá 
var
àà 
notFoundMSG
àà '
=
àà( )
await
àà* /$
_dynamicMessageService
àà0 F
.
ààF G
Get
ààG J
(
ààJ K
	NOT_FOUND
ààK T
)
ààT U
;
ààU V
return
ââ '
_iHttpsResponseRepository
ââ 8
.
ââ8 9
ReturnResult
ââ9 E
(
ââE F
APIStatusCode
ââF S
.
ââS T
ERROR
ââT Y
,
ââY Z
APIState
ââ[ c
.
ââc d
FAILED
ââd j
,
ââj k
null
ââl p
,
ââp q
new
ââr u
UserMessageââv Å
(ââÅ Ç
)ââÇ É
{ââÑ Ö
messageContentââÜ î
=ââï ñ
newââó ö
MessageContentââõ ©
{ââ™ ´
messageTypeââ¨ ∑
=ââ∏ π
notFoundMSGââ∫ ≈
.ââ≈ ∆
messageTypeââ∆ —
,ââ— “
messageCodeââ” ﬁ
=ââﬂ ‡
notFoundMSGââ· Ï
.ââÏ Ì
messageCodeââÌ ¯
,ââ¯ ˘
messageââ˙ Å
=ââÇ É
stringââÑ ä
.ââä ã
Formatââã ë
(ââë í
notFoundMSGââí ù
.ââù û
messageââû •
,ââ• ¶ 
AGREEMENT_ENTITYââß ∑
)ââ∑ ∏
}ââπ ∫
}ââª º
)ââº Ω
;ââΩ æ
}
ää 
	agreement
ãã 
.
ãã 
agreementContent
ãã .
=
ãã/ 0
agreementVM
ãã1 <
.
ãã< =
agreementContent
ãã= M
;
ããM N
	agreement
åå 
.
åå 
system_variables
åå .
=
åå/ 0
agreementVM
åå1 <
.
åå< =
system_variables
åå= M
;
ååM N
	agreement
çç 
.
çç 
agreementSubject
çç .
=
çç/ 0
agreementVM
çç1 <
.
çç< =
agreementSubject
çç= M
;
ççM N
	agreement
éé 
.
éé 
	updatedAt
éé '
=
éé( )
DateTime
éé* 2
.
éé2 3
UtcNow
éé3 9
;
éé9 :
	agreement
èè 
.
èè 
	updatedBy
èè '
=
èè( )
agreementVM
èè* 5
.
èè5 6
	updatedBy
èè6 ?
;
èè? @
	agreement
êê 
.
êê 
updateByRole
êê *
=
êê+ ,
agreementVM
êê- 8
.
êê8 9
updateByRole
êê9 E
;
êêE F
await
ëë $
_iFJTIdentityDbContext
ëë 0
.
ëë0 1
CustomSaveChanges
ëë1 B
(
ëëB C
)
ëëC D
;
ëëD E
var
ìì 

updatedMSG
ìì "
=
ìì# $
await
ìì% *$
_dynamicMessageService
ìì+ A
.
ììA B
Get
ììB E
(
ììE F
UPDATED
ììF M
)
ììM N
;
ììN O
return
îî '
_iHttpsResponseRepository
îî 4
.
îî4 5
ReturnResult
îî5 A
(
îîA B
APIStatusCode
îîB O
.
îîO P
SUCCESS
îîP W
,
îîW X
APIState
îîY a
.
îîa b
SUCCESS
îîb i
,
îîi j
null
îîk o
,
îîo p
new
îîq t
UserMessageîîu Ä
(îîÄ Å
)îîÅ Ç
{îîÉ Ñ
messageîîÖ å
=îîç é
stringîîè ï
.îîï ñ
Formatîîñ ú
(îîú ù

updatedMSGîîù ß
.îîß ®
messageîî® Ø
,îîØ ∞ 
AGREEMENT_ENTITYîî± ¡
)îî¡ ¬
}îî√ ƒ
)îîƒ ≈
;îî≈ ∆
}
ïï 
else
ññ 
{
óó 
var
ôô 
	agreement
ôô !
=
ôô" #
new
ôô$ '
	Agreement
ôô( 1
(
ôô1 2
)
ôô2 3
{
öö 
agreementTypeID
õõ '
=
õõ( )
agreementVM
õõ* 5
.
õõ5 6
agreementTypeID
õõ6 E
,
õõE F
agreementContent
úú (
=
úú) *
agreementVM
úú+ 6
.
úú6 7
agreementContent
úú7 G
,
úúG H
system_variables
ùù (
=
ùù) *
agreementVM
ùù+ 6
.
ùù6 7
system_variables
ùù7 G
,
ùùG H
agreementSubject
ûû (
=
ûû) *
agreementVM
ûû+ 6
.
ûû6 7
agreementSubject
ûû7 G
,
ûûG H
isPublished
üü #
=
üü$ %
false
üü& +
,
üü+ ,
	isDeleted
†† !
=
††" #
false
††$ )
,
††) *
version
°° 
=
°°  !
agreementVM
°°" -
.
°°- .
version
°°. 5
,
°°5 6
createByRole
¢¢ $
=
¢¢% &
agreementVM
¢¢' 2
.
¢¢2 3
createByRole
¢¢3 ?
,
¢¢? @
	createdAt
££ !
=
££" #
DateTime
££$ ,
.
££, -
UtcNow
££- 3
,
££3 4
	createdBy
§§ !
=
§§" #
agreementVM
§§$ /
.
§§/ 0
	createdBy
§§0 9
,
§§9 :
updateByRole
•• $
=
••% &
agreementVM
••' 2
.
••2 3
updateByRole
••3 ?
,
••? @
	updatedAt
¶¶ !
=
¶¶" #
DateTime
¶¶$ ,
.
¶¶, -
UtcNow
¶¶- 3
,
¶¶3 4
	updatedBy
ßß !
=
ßß" #
agreementVM
ßß$ /
.
ßß/ 0
	updatedBy
ßß0 9
}
®® 
;
®® $
_iFJTIdentityDbContext
©© *
.
©©* +
	Agreement
©©+ 4
.
©©4 5
Add
©©5 8
(
©©8 9
	agreement
©©9 B
)
©©B C
;
©©C D
await
™™ $
_iFJTIdentityDbContext
™™ 0
.
™™0 1
CustomSaveChanges
™™1 B
(
™™B C
)
™™C D
;
™™D E
var
¨¨ 

createdMSG
¨¨ "
=
¨¨# $
await
¨¨% *$
_dynamicMessageService
¨¨+ A
.
¨¨A B
Get
¨¨B E
(
¨¨E F
CREATED
¨¨F M
)
¨¨M N
;
¨¨N O
return
≠≠ '
_iHttpsResponseRepository
≠≠ 4
.
≠≠4 5
ReturnResult
≠≠5 A
(
≠≠A B
APIStatusCode
≠≠B O
.
≠≠O P
SUCCESS
≠≠P W
,
≠≠W X
APIState
≠≠Y a
.
≠≠a b
SUCCESS
≠≠b i
,
≠≠i j
null
≠≠k o
,
≠≠o p
new
≠≠q t
UserMessage≠≠u Ä
(≠≠Ä Å
)≠≠Å Ç
{≠≠É Ñ
message≠≠Ö å
=≠≠ç é
string≠≠è ï
.≠≠ï ñ
Format≠≠ñ ú
(≠≠ú ù

createdMSG≠≠ù ß
.≠≠ß ®
message≠≠® Ø
,≠≠Ø ∞ 
AGREEMENT_ENTITY≠≠± ¡
)≠≠¡ ¬
}≠≠√ ƒ
)≠≠ƒ ≈
;≠≠≈ ∆
}
ÆÆ 
}
ØØ 
catch
∞∞ 
(
∞∞ 
	Exception
∞∞ 
e
∞∞ 
)
∞∞ 
{
±± 
_logger
≤≤ 
.
≤≤ 
LogError
≤≤  
(
≤≤  !
e
≤≤! "
.
≤≤" #
ToString
≤≤# +
(
≤≤+ ,
)
≤≤, -
)
≤≤- .
;
≤≤. /
return
≥≥ 
await
≥≥ '
_iHttpsResponseRepository
≥≥ 6
.
≥≥6 7%
ReturnExceptionResponse
≥≥7 N
(
≥≥N O
e
≥≥O P
)
≥≥P Q
;
≥≥Q R
}
¥¥ 
}
µµ 	
[
ºº 	
HttpPost
ºº	 
]
ºº 
public
ΩΩ 
async
ΩΩ 
Task
ΩΩ 
<
ΩΩ 
IActionResult
ΩΩ '
>
ΩΩ' ()
GetAgreementTemplateDetails
ΩΩ) D
(
ΩΩD E
[
ΩΩE F
FromBody
ΩΩF N
]
ΩΩN O1
#RequestDownloadAgreementParameterVM
ΩΩP s
parameterVM
ΩΩt 
)ΩΩ Ä
{
ææ 	
if
øø 
(
øø 
parameterVM
øø 
==
øø 
null
øø #
)
øø# $
{
¿¿ 
var
¡¡ !
invalidParameterMSG
¡¡ '
=
¡¡( )
await
¡¡* /$
_dynamicMessageService
¡¡0 F
.
¡¡F G
Get
¡¡G J
(
¡¡J K
INVALID_PARAMETER
¡¡K \
)
¡¡\ ]
;
¡¡] ^
return
¬¬ '
_iHttpsResponseRepository
¬¬ 0
.
¬¬0 1
ReturnResult
¬¬1 =
(
¬¬= >
APIStatusCode
¬¬> K
.
¬¬K L
ERROR
¬¬L Q
,
¬¬Q R
APIState
¬¬S [
.
¬¬[ \
FAILED
¬¬\ b
,
¬¬b c
null
¬¬d h
,
¬¬h i
new
¬¬j m
UserMessage
¬¬n y
(
¬¬y z
)
¬¬z {
{
¬¬| }
messageContent¬¬~ å
=¬¬ç é
new¬¬è í
MessageContent¬¬ì °
{¬¬¢ £
messageType¬¬§ Ø
=¬¬∞ ±#
invalidParameterMSG¬¬≤ ≈
.¬¬≈ ∆
messageType¬¬∆ —
,¬¬— “
messageCode¬¬” ﬁ
=¬¬ﬂ ‡#
invalidParameterMSG¬¬· Ù
.¬¬Ù ı
messageCode¬¬ı Ä
,¬¬Ä Å
message¬¬Ç â
=¬¬ä ã#
invalidParameterMSG¬¬å ü
.¬¬ü †
message¬¬† ß
}¬¬® ©
}¬¬™ ´
)¬¬´ ¨
;¬¬¨ ≠
}
√√ 
try
ƒƒ 
{
≈≈ 
List
∆∆ 
<
∆∆ (
DownloadAgreementDetailsVM
∆∆ /
>
∆∆/ 0,
downloadAgreementDetailsVMList
∆∆1 O
=
∆∆P Q
new
∆∆R U
List
∆∆V Z
<
∆∆Z [(
DownloadAgreementDetailsVM
∆∆[ u
>
∆∆u v
(
∆∆v w
)
∆∆w x
;
∆∆x y
MySqlParameter
«« 
[
«« 
]
««  

parameters
««! +
=
««, -
new
««. 1
MySqlParameter
««2 @
[
««@ A
]
««A B
{
««C D
new
»» 
MySqlParameter
»» &
(
»»& '
$str
»»' :
,
»»: ;
parameterVM
»»< G
.
»»G H
userAgreementID
»»H W
)
»»W X
,
»»X Y
new
…… 
MySqlParameter
…… &
(
……& '
$str
……' :
,
……: ;
parameterVM
……< G
.
……G H
agreementTypeID
……H W
)
……W X
}
   
;
   /
!DownloadAgreementDetailsVMDetails
ÃÃ 1/
!downloadAgreementDetailsVMDetails
ÃÃ2 S
=
ÃÃT U
await
ÃÃV [
_iDbRepository
ÃÃ\ j
.
ÃÃj k,
DownloadAgreementDetailsAsyncÃÃk à
(ÃÃà â
$strÃÃâ ¨
,ÃÃ¨ ≠

parametersÃÃÆ ∏
)ÃÃ∏ π
;ÃÃπ ∫
var
ÕÕ !
agreementRecordList
ÕÕ '
=
ÕÕ( )/
!downloadAgreementDetailsVMDetails
ÕÕ* K
.
ÕÕK L)
DownloadAgreementDetailsVMs
ÕÕL g
.
ÕÕg h
ToList
ÕÕh n
(
ÕÕn o
)
ÕÕo p
;
ÕÕp q
if
ŒŒ 
(
ŒŒ !
agreementRecordList
ŒŒ '
==
ŒŒ( *
null
ŒŒ+ /
)
ŒŒ/ 0
{
œœ 
var
–– 
notFoundMSG
–– #
=
––$ %
await
––& +$
_dynamicMessageService
––, B
.
––B C
Get
––C F
(
––F G
	NOT_FOUND
––G P
)
––P Q
;
––Q R
return
—— '
_iHttpsResponseRepository
—— 4
.
——4 5
ReturnResult
——5 A
(
——A B
APIStatusCode
——B O
.
——O P
ERROR
——P U
,
——U V
APIState
——W _
.
——_ `
FAILED
——` f
,
——f g
null
——h l
,
——l m
new
——n q
UserMessage
——r }
(
——} ~
)
——~ 
{——Ä Å
messageContent——Ç ê
=——ë í
new——ì ñ
MessageContent——ó •
{——¶ ß
messageType——® ≥
=——¥ µ
notFoundMSG——∂ ¡
.——¡ ¬
messageType——¬ Õ
,——Õ Œ
messageCode——œ ⁄
=——€ ‹
notFoundMSG——› Ë
.——Ë È
messageCode——È Ù
,——Ù ı
message——ˆ ˝
=——˛ ˇ
string——Ä Ü
.——Ü á
Format——á ç
(——ç é
notFoundMSG——é ô
.——ô ö
message——ö °
,——° ¢ 
AGREEMENT_ENTITY——£ ≥
)——≥ ¥
}——µ ∂
}——∑ ∏
)——∏ π
;——π ∫
}
““ 
var
”” 
companyLogo
”” 
=
””  !
await
””" '$
_iFJTIdentityDbContext
””( >
.
””> ?!
Systemconfigrations
””? R
.
””R S
Where
””S X
(
””X Y
x
””Y Z
=>
””[ ]
x
””^ _
.
””_ `
key
””` c
==
””d f
COMPANY_LOGO_KEY
””g w
)
””w x
.
””x y
Select
””y 
(”” Ä
x””Ä Å
=>””Ç Ñ
x””Ö Ü
.””Ü á
values””á ç
)””ç é
.””é è#
FirstOrDefaultAsync””è ¢
(””¢ £
)””£ §
;””§ •
foreach
‘‘ 
(
‘‘ 
var
‘‘ 
	agreement
‘‘ &
in
‘‘' )!
agreementRecordList
‘‘* =
)
‘‘= >
{
’’ 
if
÷÷ 
(
÷÷ 
!
÷÷ 
string
÷÷ 
.
÷÷  
IsNullOrEmpty
÷÷  -
(
÷÷- .
	agreement
÷÷. 7
.
÷÷7 8
agreementContent
÷÷8 H
)
÷÷H I
)
÷÷I J
{
◊◊ 
	agreement
ÿÿ !
.
ÿÿ! "
agreementContent
ÿÿ" 2
=
ÿÿ3 4$
_textAngularValueForDB
ÿÿ5 K
.
ÿÿK L&
GetTextAngularValueForDB
ÿÿL d
(
ÿÿd e
	agreement
ÿÿe n
.
ÿÿn o
agreementContent
ÿÿo 
)ÿÿ Ä
;ÿÿÄ Å
if
ŸŸ 
(
ŸŸ 
	agreement
ŸŸ %
.
ŸŸ% &
agreementContent
ŸŸ& 6
==
ŸŸ7 9
null
ŸŸ: >
)
ŸŸ> ?
{
⁄⁄ 
var
€€ 
somethingWrongMSG
€€  1
=
€€2 3
await
€€4 9$
_dynamicMessageService
€€: P
.
€€P Q
Get
€€Q T
(
€€T U
SOMTHING_WRONG
€€U c
)
€€c d
;
€€d e
return
‹‹ "'
_iHttpsResponseRepository
‹‹# <
.
‹‹< =
ReturnResult
‹‹= I
(
‹‹I J
APIStatusCode
‹‹J W
.
‹‹W X
ERROR
‹‹X ]
,
‹‹] ^
APIState
‹‹_ g
.
‹‹g h
FAILED
‹‹h n
,
‹‹n o
null
‹‹p t
,
‹‹t u
new
‹‹v y
UserMessage‹‹z Ö
(‹‹Ö Ü
)‹‹Ü á
{‹‹à â
messageContent‹‹ä ò
=‹‹ô ö
new‹‹õ û
MessageContent‹‹ü ≠
{‹‹Æ Ø
messageType‹‹∞ ª
=‹‹º Ω!
somethingWrongMSG‹‹æ œ
.‹‹œ –
messageType‹‹– €
,‹‹€ ‹
messageCode‹‹› Ë
=‹‹È Í!
somethingWrongMSG‹‹Î ¸
.‹‹¸ ˝
messageCode‹‹˝ à
,‹‹à â
message‹‹ä ë
=‹‹í ì!
somethingWrongMSG‹‹î •
.‹‹• ¶
message‹‹¶ ≠
}‹‹Æ Ø
}‹‹∞ ±
)‹‹± ≤
;‹‹≤ ≥
}
›› 
}
ﬁﬁ 
	agreement
·· 
.
·· 
agreementContent
·· .
=
··/ 0
	agreement
··1 :
.
··: ;
agreementContent
··; K
.
··K L
Replace
··L S
(
··S T1
#SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG
··T w
,
··w x
COMPANY_NAME··y Ö
)··Ö Ü
.
‚‚  !
Replace
‚‚! (
(
‚‚( )1
#SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG
‚‚) L
,
‚‚L M
companyLogo
‚‚N Y
)
‚‚Y Z
;
‚‚Z [
}
„„ 
return
ÂÂ '
_iHttpsResponseRepository
ÂÂ 0
.
ÂÂ0 1
ReturnResult
ÂÂ1 =
(
ÂÂ= >
APIStatusCode
ÂÂ> K
.
ÂÂK L
SUCCESS
ÂÂL S
,
ÂÂS T
APIState
ÂÂU ]
.
ÂÂ] ^
SUCCESS
ÂÂ^ e
,
ÂÂe f!
agreementRecordList
ÂÂg z
,
ÂÂz {
nullÂÂ| Ä
)ÂÂÄ Å
;ÂÂÅ Ç
}
ÊÊ 
catch
ÁÁ 
(
ÁÁ 
	Exception
ÁÁ 
e
ÁÁ 
)
ÁÁ 
{
ËË 
_logger
ÈÈ 
.
ÈÈ 
LogError
ÈÈ  
(
ÈÈ  !
e
ÈÈ! "
.
ÈÈ" #
ToString
ÈÈ# +
(
ÈÈ+ ,
)
ÈÈ, -
)
ÈÈ- .
;
ÈÈ. /
return
ÍÍ 
await
ÍÍ '
_iHttpsResponseRepository
ÍÍ 6
.
ÍÍ6 7%
ReturnExceptionResponse
ÍÍ7 N
(
ÍÍN O
e
ÍÍO P
)
ÍÍP Q
;
ÍÍQ R
}
ÎÎ 
}
ÏÏ 	
public
ÛÛ 
async
ÛÛ 
Task
ÛÛ 
<
ÛÛ 
IActionResult
ÛÛ '
>
ÛÛ' (
GetAgreementTypes
ÛÛ) :
(
ÛÛ: ;
string
ÛÛ; A
templateType
ÛÛB N
)
ÛÛN O
{
ÙÙ 	
try
ıı 
{
ˆˆ 
List
˜˜ 
<
˜˜ 
AgreementType
˜˜ "
>
˜˜" #
agreementTypeList
˜˜$ 5
=
˜˜6 7
new
˜˜8 ;
List
˜˜< @
<
˜˜@ A
AgreementType
˜˜A N
>
˜˜N O
(
˜˜O P
)
˜˜P Q
;
˜˜Q R
if
˘˘ 
(
˘˘ 
templateType
˘˘  
==
˘˘! #
null
˘˘$ (
)
˘˘( )
{
˙˙ 
agreementTypeList
˚˚ %
=
˚˚& '
await
˚˚( -$
_iFJTIdentityDbContext
˚˚. D
.
˚˚D E
AgreementType
˚˚E R
.
˚˚R S
Where
˚˚S X
(
˚˚X Y
x
˚˚Y Z
=>
˚˚[ ]
x
˚˚^ _
.
˚˚_ `
	isDeleted
˚˚` i
==
˚˚j l
false
˚˚m r
)
˚˚r s
.
˚˚s t
Include
˚˚t {
(
˚˚{ |
x
˚˚| }
=>˚˚~ Ä
x˚˚Å Ç
.˚˚Ç É

agreements˚˚É ç
)˚˚ç é
.˚˚é è
ToListAsync˚˚è ö
(˚˚ö õ
)˚˚õ ú
;˚˚ú ù
}
¸¸ 
else
˝˝ 
{
˛˛ 
agreementTypeList
ˇˇ %
=
ˇˇ& '
await
ˇˇ( -$
_iFJTIdentityDbContext
ˇˇ. D
.
ˇˇD E
AgreementType
ˇˇE R
.
ˇˇR S
Where
ˇˇS X
(
ˇˇX Y
x
ˇˇY Z
=>
ˇˇ[ ]
x
ˇˇ^ _
.
ˇˇ_ `
templateType
ˇˇ` l
==
ˇˇm o
templateType
ˇˇp |
&&
ˇˇ} 
xˇˇÄ Å
.ˇˇÅ Ç
	isDeletedˇˇÇ ã
==ˇˇå é
falseˇˇè î
)ˇˇî ï
.ˇˇï ñ
Includeˇˇñ ù
(ˇˇù û
xˇˇû ü
=>ˇˇ† ¢
xˇˇ£ §
.ˇˇ§ •

agreementsˇˇ• Ø
)ˇˇØ ∞
.ˇˇ∞ ±
ToListAsyncˇˇ± º
(ˇˇº Ω
)ˇˇΩ æ
;ˇˇæ ø
}
ÄÄ 
if
ÅÅ 
(
ÅÅ 
agreementTypeList
ÅÅ %
==
ÅÅ& (
null
ÅÅ) -
)
ÅÅ- .
{
ÇÇ 
var
ÉÉ 
notFoundMSG
ÉÉ #
=
ÉÉ$ %
await
ÉÉ& +$
_dynamicMessageService
ÉÉ, B
.
ÉÉB C
Get
ÉÉC F
(
ÉÉF G
	NOT_FOUND
ÉÉG P
)
ÉÉP Q
;
ÉÉQ R
return
ÑÑ '
_iHttpsResponseRepository
ÑÑ 4
.
ÑÑ4 5
ReturnResult
ÑÑ5 A
(
ÑÑA B
APIStatusCode
ÑÑB O
.
ÑÑO P
ERROR
ÑÑP U
,
ÑÑU V
APIState
ÑÑW _
.
ÑÑ_ `
FAILED
ÑÑ` f
,
ÑÑf g
null
ÑÑh l
,
ÑÑl m
new
ÑÑn q
UserMessage
ÑÑr }
(
ÑÑ} ~
)
ÑÑ~ 
{ÑÑÄ Å
messageContentÑÑÇ ê
=ÑÑë í
newÑÑì ñ
MessageContentÑÑó •
{ÑÑ¶ ß
messageTypeÑÑ® ≥
=ÑÑ¥ µ
notFoundMSGÑÑ∂ ¡
.ÑÑ¡ ¬
messageTypeÑÑ¬ Õ
,ÑÑÕ Œ
messageCodeÑÑœ ⁄
=ÑÑ€ ‹
notFoundMSGÑÑ› Ë
.ÑÑË È
messageCodeÑÑÈ Ù
,ÑÑÙ ı
messageÑÑˆ ˝
=ÑÑ˛ ˇ
stringÑÑÄ Ü
.ÑÑÜ á
FormatÑÑá ç
(ÑÑç é
notFoundMSGÑÑé ô
.ÑÑô ö
messageÑÑö °
,ÑÑ° ¢ 
AGREEMENT_ENTITYÑÑ£ ≥
)ÑÑ≥ ¥
}ÑÑµ ∂
}ÑÑ∑ ∏
)ÑÑ∏ π
;ÑÑπ ∫
}
ÖÖ 
foreach
áá 
(
áá 
var
áá 
agreementType
áá *
in
áá+ -
agreementTypeList
áá. ?
)
áá? @
{
àà 
if
ââ 
(
ââ 
agreementType
ââ %
.
ââ% &

agreements
ââ& 0
.
ââ0 1
Count
ââ1 6
>
ââ7 8
$num
ââ9 :
)
ââ: ;
{
ää 
foreach
ãã 
(
ãã  !
var
ãã! $
	agreement
ãã% .
in
ãã/ 1
agreementType
ãã2 ?
.
ãã? @

agreements
ãã@ J
)
ããJ K
{
åå 
if
çç 
(
çç  
!
çç  !
string
çç! '
.
çç' (
IsNullOrEmpty
çç( 5
(
çç5 6
	agreement
çç6 ?
.
çç? @
agreementContent
çç@ P
)
ççP Q
)
ççQ R
{
éé 
	agreement
èè  )
.
èè) *
agreementContent
èè* :
=
èè; <$
_textAngularValueForDB
èè= S
.
èèS T&
GetTextAngularValueForDB
èèT l
(
èèl m
	agreement
èèm v
.
èèv w
agreementContentèèw á
)èèá à
;èèà â
if
êê  "
(
êê# $
	agreement
êê$ -
.
êê- .
agreementContent
êê. >
==
êê? A
null
êêB F
)
êêF G
{
ëë  !
var
íí$ '
somethingWrongMSG
íí( 9
=
íí: ;
await
íí< A$
_dynamicMessageService
ííB X
.
ííX Y
Get
ííY \
(
íí\ ]
SOMTHING_WRONG
íí] k
)
íík l
;
ííl m
return
ìì$ *'
_iHttpsResponseRepository
ìì+ D
.
ììD E
ReturnResult
ììE Q
(
ììQ R
APIStatusCode
ììR _
.
ìì_ `
ERROR
ìì` e
,
ììe f
APIState
ììg o
.
ììo p
FAILED
ììp v
,
ììv w
null
ììx |
,
ìì| }
newìì~ Å
UserMessageììÇ ç
(ììç é
)ììé è
{ììê ë
messageContentììí †
=ìì° ¢
newìì£ ¶
MessageContentììß µ
{ìì∂ ∑
messageTypeìì∏ √
=ììƒ ≈!
somethingWrongMSGìì∆ ◊
.ìì◊ ÿ
messageTypeììÿ „
,ìì„ ‰
messageCodeììÂ 
=ììÒ Ú!
somethingWrongMSGììÛ Ñ
.ììÑ Ö
messageCodeììÖ ê
,ììê ë
messageììí ô
=ììö õ!
somethingWrongMSGììú ≠
.ìì≠ Æ
messageììÆ µ
}ìì∂ ∑
}ìì∏ π
)ììπ ∫
;ìì∫ ª
}
îî  !
}
ïï 
if
óó 
(
óó  
!
óó  !
string
óó! '
.
óó' (
IsNullOrEmpty
óó( 5
(
óó5 6
	agreement
óó6 ?
.
óó? @
agreementSubject
óó@ P
)
óóP Q
)
óóQ R
{
òò 
	agreement
ôô  )
.
ôô) *
agreementSubject
ôô* :
=
ôô; <$
_textAngularValueForDB
ôô= S
.
ôôS T&
GetTextAngularValueForDB
ôôT l
(
ôôl m
	agreement
ôôm v
.
ôôv w
agreementSubjectôôw á
)ôôá à
;ôôà â
if
öö  "
(
öö# $
	agreement
öö$ -
.
öö- .
agreementSubject
öö. >
==
öö? A
null
ööB F
)
ööF G
{
õõ  !
var
úú$ '
somethingWrongMSG
úú( 9
=
úú: ;
await
úú< A$
_dynamicMessageService
úúB X
.
úúX Y
Get
úúY \
(
úú\ ]
SOMTHING_WRONG
úú] k
)
úúk l
;
úúl m
return
ùù$ *'
_iHttpsResponseRepository
ùù+ D
.
ùùD E
ReturnResult
ùùE Q
(
ùùQ R
APIStatusCode
ùùR _
.
ùù_ `
ERROR
ùù` e
,
ùùe f
APIState
ùùg o
.
ùùo p
FAILED
ùùp v
,
ùùv w
null
ùùx |
,
ùù| }
newùù~ Å
UserMessageùùÇ ç
(ùùç é
)ùùé è
{ùùê ë
messageContentùùí †
=ùù° ¢
newùù£ ¶
MessageContentùùß µ
{ùù∂ ∑
messageTypeùù∏ √
=ùùƒ ≈!
somethingWrongMSGùù∆ ◊
.ùù◊ ÿ
messageTypeùùÿ „
,ùù„ ‰
messageCodeùùÂ 
=ùùÒ Ú!
somethingWrongMSGùùÛ Ñ
.ùùÑ Ö
messageCodeùùÖ ê
,ùùê ë
messageùùí ô
=ùùö õ!
somethingWrongMSGùùú ≠
.ùù≠ Æ
messageùùÆ µ
}ùù∂ ∑
}ùù∏ π
)ùùπ ∫
;ùù∫ ª
}
ûû  !
}
üü 
}
†† 
}
°° 
}
¢¢ 
return
§§ '
_iHttpsResponseRepository
§§ 0
.
§§0 1
ReturnResult
§§1 =
(
§§= >
APIStatusCode
§§> K
.
§§K L
SUCCESS
§§L S
,
§§S T
APIState
§§U ]
.
§§] ^
SUCCESS
§§^ e
,
§§e f
agreementTypeList
§§g x
,
§§x y
null
§§z ~
)
§§~ 
;§§ Ä
}
•• 
catch
¶¶ 
(
¶¶ 
	Exception
¶¶ 
e
¶¶ 
)
¶¶ 
{
ßß 
_logger
®® 
.
®® 
LogError
®®  
(
®®  !
e
®®! "
.
®®" #
ToString
®®# +
(
®®+ ,
)
®®, -
)
®®- .
;
®®. /
return
©© 
await
©© '
_iHttpsResponseRepository
©© 6
.
©©6 7%
ReturnExceptionResponse
©©7 N
(
©©N O
e
©©O P
)
©©P Q
;
©©Q R
}
™™ 
}
´´ 	
}
¨¨ 
}≠≠ ˜°
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
HHÄ Å
messageContent
HHÇ ê
=
HHë í
new
HHì ñ
MessageContent
HHó •
{
HH¶ ß
messageType
HH® ≥
=
HH¥ µ!
invalidParameterMSG
HH∂ …
.
HH…  
messageType
HH  ’
,
HH’ ÷
messageCode
HH◊ ‚
=
HH„ ‰!
invalidParameterMSG
HHÂ ¯
.
HH¯ ˘
messageCode
HH˘ Ñ
,
HHÑ Ö
message
HHÜ ç
=
HHé è!
invalidParameterMSG
HHê £
.
HH£ §
message
HH§ ´
}
HH¨ ≠
}
HHÆ Ø
)
HHØ ∞
;
HH∞ ±
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
NameIdentifier	ppu É
)
ppÉ Ñ
.
ppÑ Ö
Value
ppÖ ä
:
ppã å
null
ppç ë
;
ppë í
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
ttÄ Å
messageContent
ttÇ ê
=
ttë í
new
ttì ñ
MessageContent
ttó •
{
tt¶ ß
messageType
tt® ≥
=
tt¥ µ
somethingWrongMSG
tt∂ «
.
tt« »
messageType
tt» ”
,
tt” ‘
messageCode
tt’ ‡
=
tt· ‚
somethingWrongMSG
tt„ Ù
.
ttÙ ı
messageCode
ttı Ä
,
ttÄ Å
message
ttÇ â
=
ttä ã
somethingWrongMSG
ttå ù
.
ttù û
message
ttû •
}
tt¶ ß
}
tt® ©
)
tt© ™
;
tt™ ´
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
UserMessage	v Å
(
Å Ç
)
Ç É
{
Ñ Ö
messageContent
Ü î
=
ï ñ
new
ó ö
MessageContent
õ ©
{
™ ´
messageType
¨ ∑
=
∏ π
somethingWrongMSG
∫ À
.
À Ã
messageType
Ã ◊
,
◊ ÿ
messageCode
Ÿ ‰
=
Â Ê
somethingWrongMSG
Á ¯
.
¯ ˘
messageCode
˘ Ñ
,
Ñ Ö
message
Ü ç
=
é è
somethingWrongMSG
ê °
.
° ¢
message
¢ ©
}
™ ´
}
¨ ≠
)
≠ Æ
;
Æ Ø
}
ÄÄ 
long
ÅÅ 
.
ÅÅ 
TryParse
ÅÅ !
(
ÅÅ! "
	timeStamp
ÅÅ" +
,
ÅÅ+ ,
out
ÅÅ- 0
long
ÅÅ1 5
longTimeStamp
ÅÅ6 C
)
ÅÅC D
;
ÅÅD E
DateTime
ÇÇ 
tokenCreationdate
ÇÇ .
=
ÇÇ/ 0
new
ÇÇ1 4
DateTime
ÇÇ5 =
(
ÇÇ= >
$num
ÇÇ> B
,
ÇÇB C
$num
ÇÇD E
,
ÇÇE F
$num
ÇÇG H
,
ÇÇH I
$num
ÇÇJ K
,
ÇÇK L
$num
ÇÇM N
,
ÇÇN O
$num
ÇÇP Q
,
ÇÇQ R
$num
ÇÇS T
,
ÇÇT U
System
ÇÇV \
.
ÇÇ\ ]
DateTimeKind
ÇÇ] i
.
ÇÇi j
Utc
ÇÇj m
)
ÇÇm n
;
ÇÇn o
tokenCreationdate
ÉÉ %
=
ÉÉ& '
tokenCreationdate
ÉÉ( 9
.
ÉÉ9 :

AddSeconds
ÉÉ: D
(
ÉÉD E
longTimeStamp
ÉÉE R
)
ÉÉR S
.
ÉÉS T
ToUniversalTime
ÉÉT c
(
ÉÉc d
)
ÉÉd e
;
ÉÉe f
int
ÜÜ 
isValid
ÜÜ 
=
ÜÜ  !
DateTime
ÜÜ" *
.
ÜÜ* +
Compare
ÜÜ+ 2
(
ÜÜ2 3
tokenCreationdate
ÜÜ3 D
,
ÜÜD E
userTemp
ÜÜF N
.
ÜÜN O
changePasswordAt
ÜÜO _
.
ÜÜ_ `
Value
ÜÜ` e
)
ÜÜe f
;
ÜÜf g
if
áá 
(
áá 
isValid
áá 
>
áá  !
$num
áá" #
)
áá# $
{
àà 
return
ââ '
_iHttpsResponseRepository
ââ 8
.
ââ8 9
ReturnResult
ââ9 E
(
ââE F
APIStatusCode
ââF S
.
ââS T
SUCCESS
ââT [
,
ââ[ \
APIState
ââ] e
.
ââe f
SUCCESS
ââf m
,
ââm n
null
ââo s
,
ââs t
null
ââu y
)
âây z
;
ââz {
}
ää 
else
ãã 
{
åå 
return
çç '
_iHttpsResponseRepository
çç 8
.
çç8 9
ReturnResult
çç9 E
(
ççE F
APIStatusCode
ççF S
.
ççS T
UNAUTHORIZED
ççT `
,
çç` a
APIState
ççb j
.
ççj k
SUCCESS
ççk r
,
ççr s
null
ççt x
,
ççx y
null
ççz ~
)
çç~ 
;çç Ä
}
éé 
}
èè 
else
êê 
{
ëë 
return
íí '
_iHttpsResponseRepository
íí 4
.
íí4 5
ReturnResult
íí5 A
(
ííA B
APIStatusCode
ííB O
.
ííO P
SUCCESS
ííP W
,
ííW X
APIState
ííY a
.
íía b
SUCCESS
ííb i
,
ííi j
null
íík o
,
íío p
null
ííq u
)
ííu v
;
íív w
}
ìì 
}
îî 
catch
ïï 
(
ïï 
	Exception
ïï 
e
ïï 
)
ïï 
{
ññ 
_logger
óó 
.
óó 
LogError
óó  
(
óó  !
e
óó! "
.
óó" #
ToString
óó# +
(
óó+ ,
)
óó, -
)
óó- .
;
óó. /
return
òò 
await
òò '
_iHttpsResponseRepository
òò 6
.
òò6 7%
ReturnExceptionResponse
òò7 N
(
òòN O
e
òòO P
)
òòP Q
;
òòQ R
}
ôô 
}
öö 	
[
úú 	
HttpGet
úú	 
]
úú 
public
ùù 
async
ùù 
Task
ùù 
<
ùù 
IActionResult
ùù '
>
ùù' (
SetSuperAdmin
ùù) 6
(
ùù6 7
string
ùù7 =
userId
ùù> D
,
ùùD E
bool
ùùF J
isSuperAdmin
ùùK W
)
ùùW X
{
ûû 	
if
üü 
(
üü 
userId
üü 
==
üü 
null
üü 
)
üü 
{
†† 
var
°° !
invalidParameterMSG
°° '
=
°°( )
await
°°* /$
_dynamicMessageService
°°0 F
.
°°F G
Get
°°G J
(
°°J K
INVALID_PARAMETER
°°K \
)
°°\ ]
;
°°] ^
return
¢¢ '
_iHttpsResponseRepository
¢¢ 0
.
¢¢0 1
ReturnResult
¢¢1 =
(
¢¢= >
APIStatusCode
¢¢> K
.
¢¢K L
ERROR
¢¢L Q
,
¢¢Q R
APIState
¢¢S [
.
¢¢[ \
FAILED
¢¢\ b
,
¢¢b c
null
¢¢d h
,
¢¢h i
new
¢¢j m
UserMessage
¢¢n y
(
¢¢y z
)
¢¢z {
{
¢¢| }
messageContent¢¢~ å
=¢¢ç é
new¢¢è í
MessageContent¢¢ì °
{¢¢¢ £
messageType¢¢§ Ø
=¢¢∞ ±#
invalidParameterMSG¢¢≤ ≈
.¢¢≈ ∆
messageType¢¢∆ —
,¢¢— “
messageCode¢¢” ﬁ
=¢¢ﬂ ‡#
invalidParameterMSG¢¢· Ù
.¢¢Ù ı
messageCode¢¢ı Ä
,¢¢Ä Å
message¢¢Ç â
=¢¢ä ã#
invalidParameterMSG¢¢å ü
.¢¢ü †
message¢¢† ß
}¢¢® ©
}¢¢™ ´
)¢¢´ ¨
;¢¢¨ ≠
}
££ 
try
§§ 
{
•• 
var
¶¶ 
userTemp
¶¶ 
=
¶¶ 
await
¶¶ $
_userManager
¶¶% 1
.
¶¶1 2
FindByIdAsync
¶¶2 ?
(
¶¶? @
userId
¶¶@ F
)
¶¶F G
;
¶¶G H
if
ßß 
(
ßß 
userTemp
ßß 
==
ßß 
null
ßß  $
)
ßß$ %
{
®® 
var
©© 
notFoundMSG
©© #
=
©©$ %
await
©©& +$
_dynamicMessageService
©©, B
.
©©B C
Get
©©C F
(
©©F G
	NOT_FOUND
©©G P
)
©©P Q
;
©©Q R
return
™™ '
_iHttpsResponseRepository
™™ 4
.
™™4 5
ReturnResult
™™5 A
(
™™A B
APIStatusCode
™™B O
.
™™O P
ERROR
™™P U
,
™™U V
APIState
™™W _
.
™™_ `
FAILED
™™` f
,
™™f g
null
™™h l
,
™™l m
new
™™n q
UserMessage
™™r }
(
™™} ~
)
™™~ 
{™™Ä Å
messageContent™™Ç ê
=™™ë í
new™™ì ñ
MessageContent™™ó •
{™™¶ ß
messageType™™® ≥
=™™¥ µ
notFoundMSG™™∂ ¡
.™™¡ ¬
messageType™™¬ Õ
,™™Õ Œ
messageCode™™œ ⁄
=™™€ ‹
notFoundMSG™™› Ë
.™™Ë È
messageCode™™È Ù
,™™Ù ı
message™™ˆ ˝
=™™˛ ˇ
string™™Ä Ü
.™™Ü á
Format™™á ç
(™™ç é
notFoundMSG™™é ô
.™™ô ö
message™™ö °
,™™° ¢
USER_ENTITY™™£ Æ
)™™Æ Ø
}™™∞ ±
}™™≤ ≥
)™™≥ ¥
;™™¥ µ
}
´´ 
userTemp
¨¨ 
.
¨¨ 
isSuperAdmin
¨¨ %
=
¨¨& '
isSuperAdmin
¨¨( 4
;
¨¨4 5
await
≠≠ 
_userManager
≠≠ "
.
≠≠" #
UpdateAsync
≠≠# .
(
≠≠. /
userTemp
≠≠/ 7
)
≠≠7 8
;
≠≠8 9
return
ØØ '
_iHttpsResponseRepository
ØØ 0
.
ØØ0 1
ReturnResult
ØØ1 =
(
ØØ= >
APIStatusCode
ØØ> K
.
ØØK L
SUCCESS
ØØL S
,
ØØS T
APIState
ØØU ]
.
ØØ] ^
SUCCESS
ØØ^ e
,
ØØe f
null
ØØg k
,
ØØk l
null
ØØm q
)
ØØq r
;
ØØr s
}
∞∞ 
catch
±± 
(
±± 
	Exception
±± 
e
±± 
)
±± 
{
≤≤ 
_logger
≥≥ 
.
≥≥ 
LogError
≥≥  
(
≥≥  !
e
≥≥! "
.
≥≥" #
ToString
≥≥# +
(
≥≥+ ,
)
≥≥, -
)
≥≥- .
;
≥≥. /
return
¥¥ 
await
¥¥ '
_iHttpsResponseRepository
¥¥ 6
.
¥¥6 7%
ReturnExceptionResponse
¥¥7 N
(
¥¥N O
e
¥¥O P
)
¥¥P Q
;
¥¥Q R
}
µµ 
}
∂∂ 	
}
∑∑ 
}∏∏ ›U
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
}xx ÷&
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
}WW åƒ
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
;	CC Ä
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
;	qq Ä
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
$str	vÜ 
;
ÜÜ 
_db
áá 
.
áá 
ExecuteSqlCommand
áá !
(
áá! "
script
áá" (
.
áá( )
Replace
áá) 0
(
áá0 1
$str
áá1 B
,
ááB C
FJTMainDBName
ááD Q
)
ááQ R
.
ááR S
Replace
ááS Z
(
ááZ [
$str
áá[ m
,
áám n
IdentityDBName
ááo }
)
áá} ~
)
áá~ 
;áá Ä
}
àà 	
private
ää 
static
ää 
void
ää 9
+Seed_fun_ApplyLongDateTimeFormatByParaValue
ää G
(
ääG H
)
ääH I
{
ãã 	
_db
åå 
.
åå 
ExecuteSqlCommand
åå !
(
åå! "
$str
åå" f
)
ååf g
;
ååg h
_db
éé 
.
éé 
ExecuteSqlCommand
éé !
(
éé! "
$str
éî" 
)
îî 
;
îî 
}
ïï 	
private
óó 
static
óó 
void
óó ,
Seed_fun_ApplyCommonDateFormat
óó :
(
óó: ;
)
óó; <
{
òò 	
_db
ôô 
.
ôô 
ExecuteSqlCommand
ôô !
(
ôô! "
$str
ôô" Y
)
ôôY Z
;
ôôZ [
_db
õõ 
.
õõ 
ExecuteSqlCommand
õõ !
(
õõ! "
$str
õ£" 
)
££ 
;
££ 
}
§§ 	
private
¶¶ 
static
¶¶ 
void
¶¶ ;
-Seed_fun_ApplyCommonDateTimeFormatByParaValue
¶¶ I
(
¶¶I J
)
¶¶J K
{
ßß 	
_db
®® 
.
®® 
ExecuteSqlCommand
®® !
(
®®! "
$str
®®" h
)
®®h i
;
®®i j
_db
™™ 
.
™™ 
ExecuteSqlCommand
™™ !
(
™™! "
$str
™±" 
)
±± 
;
±± 
}
≤≤ 	
private
¥¥ 
static
¥¥ 
void
¥¥ 7
)Seed_fun_getLastAgreementPublishedVersion
¥¥ E
(
¥¥E F
)
¥¥F G
{
µµ 	
_db
∂∂ 
.
∂∂ 
ExecuteSqlCommand
∂∂ !
(
∂∂! "
$str
∂∂" d
)
∂∂d e
;
∂∂e f
_db
∏∏ 
.
∏∏ 
ExecuteSqlCommand
∏∏ !
(
∏∏! "
$str
∏ƒ" 
)
ƒƒ 
;
ƒƒ 
}
≈≈ 	
private
«« 
static
«« 
void
«« 8
*Seed_fun_getDraftAgreementPublishedVersion
«« F
(
««F G
)
««G H
{
»» 	
_db
…… 
.
…… 
ExecuteSqlCommand
…… !
(
……! "
$str
……" e
)
……e f
;
……f g
_db
ÀÀ 
.
ÀÀ 
ExecuteSqlCommand
ÀÀ !
(
ÀÀ! "
$str
À›" 
)
›› 
;
›› 
}
ﬁﬁ 	
private
‡‡ 
static
‡‡ 
void
‡‡ (
Seed_fun_getDateTimeFormat
‡‡ 6
(
‡‡6 7
)
‡‡7 8
{
·· 	
_db
‚‚ 
.
‚‚ 
ExecuteSqlCommand
‚‚ !
(
‚‚! "
$str
‚‚" U
)
‚‚U V
;
‚‚V W
_db
‰‰ 
.
‰‰ 
ExecuteSqlCommand
‰‰ !
(
‰‰! "
$str
‰Í" 
)
ÍÍ 
;
ÍÍ 
}
ÎÎ 	
private
ÌÌ 
static
ÌÌ 
void
ÌÌ "
Seed_fun_getTimeZone
ÌÌ 0
(
ÌÌ0 1
)
ÌÌ1 2
{
ÓÓ 	
_db
ÔÔ 
.
ÔÔ 
ExecuteSqlCommand
ÔÔ !
(
ÔÔ! "
$str
ÔÔ" O
)
ÔÔO P
;
ÔÔP Q
_db
ÒÒ 
.
ÒÒ 
ExecuteSqlCommand
ÒÒ !
(
ÒÒ! "
$str
Ò˜" 
)
˜˜ 
;
˜˜ 
}
¯¯ 	
private
˙˙ 
static
˙˙ 
void
˙˙ /
!Seed_fun_getAgreementTypeNameById
˙˙ =
(
˙˙= >
)
˙˙> ?
{
˚˚ 	
_db
¸¸ 
.
¸¸ 
ExecuteSqlCommand
¸¸ !
(
¸¸! "
$str
¸¸" \
)
¸¸\ ]
;
¸¸] ^
_db
˛˛ 
.
˛˛ 
ExecuteSqlCommand
˛˛ !
(
˛˛! "
$str
˛Ü" 
)
ÜÜ 
;
ÜÜ 
}
áá 	
private
ââ 
static
ââ 
void
ââ 4
&Seed_fun_getLastAgreementPublishedDate
ââ B
(
ââB C
)
ââC D
{
ää 	
_db
ãã 
.
ãã 
ExecuteSqlCommand
ãã !
(
ãã! "
$str
ãã" a
)
ããa b
;
ããb c
_db
çç 
.
çç 
ExecuteSqlCommand
çç !
(
çç! "
$str
çó" 
)
óó 
;
óó 
}
òò 	
private
öö 
static
öö 
void
öö /
!Seed_fun_getEmpployeeNameByUserID
öö =
(
öö= >
)
öö> ?
{
õõ 	
_db
úú 
.
úú 
ExecuteSqlCommand
úú !
(
úú! "
$str
úú" \
)
úú\ ]
;
úú] ^
_db
ûû 
.
ûû 
ExecuteSqlCommand
ûû !
(
ûû! "
$str
û´" 
)
´´ 
;
´´ 
}
¨¨ 	
private
ÆÆ 
static
ÆÆ 
void
ÆÆ *
Seed_Sproc_getAgreedUserList
ÆÆ 8
(
ÆÆ8 9
)
ÆÆ9 :
{
ØØ 	
_db
∞∞ 
.
∞∞ 
ExecuteSqlCommand
∞∞ !
(
∞∞! "
$str
∞∞" X
)
∞∞X Y
;
∞∞Y Z
_db
≤≤ 
.
≤≤ 
ExecuteSqlCommand
≤≤ !
(
≤≤! "
$str
≤≤" e
+
≤≤f g
$str≥≥ I
+
≥≥J K
$str¥¥ M
+
¥¥N O
$strµµ P
+
µµQ R
$str∂∂ 6
+
∂∂7 8
$str∑∑ 2
+
∑∑3 4
$str∏∏ 0
+
∏∏1 2
$strππ 
+
ππ 	
$str∫∫ 
+
∫∫ 
$strªª ?
+
ªª@ A
$strºº B
+
ººC D
$strΩΩ U
+
ΩΩV W
$strææ :
+
ææ; <
$strøø 
+
øø 
$str¿¿ H
+
¿¿I J
$str¡¡ S
+
¡¡T U
$str¬¬ J
+
¬¬K L
$str√√ +
+
√√, -
$strƒƒ B
+
ƒƒC D
$str≈≈ 
+
≈≈ 
$str∆∆ %
+
∆∆& '
$str«« ,
+
««- .
$str»» '
+
»»( )
$str…… <
+
……= >
$str   2
+
  3 4
$strÀÀ 0
+
ÀÀ1 2
$strÃÃ u
+
ÃÃv w
$strÕÕ o
+
ÕÕp q
$str	ŒŒ π
+ŒŒ∫ ª
$str	œœ ï
+œœñ ó
$str–– 5
+
––6 7
$str—— S
+
——T U
$str““ 8
+
““9 :
$str	”” ë
+””í ì
$str‘‘ #
+
‘‘$ %
$str’’ 
+
’’ 
$str÷÷ t
+
÷÷u v
$str	◊◊ é
+◊◊è ê
$strÿÿ M
+
ÿÿN O
$strŸŸ |
+
ŸŸ} ~
$str⁄⁄ Q
+
⁄⁄R S
$str€€ 
+
€€ 
$str‹‹ ]
+
‹‹^ _
$str›› H
+
››I J
$strﬁﬁ 
+
ﬁﬁ 
$strﬂﬂ 
+
ﬂﬂ 
$str‡‡ 8
+
‡‡9 :
$str·· e
+
··f g
$str‚‚ 
+
‚‚ 
$str„„ 
+
„„ 
$str‰‰ z
+
‰‰{ |
$strÂÂ |
+
ÂÂ} ~
$str	ÊÊ õ
+ÊÊú ù
$strÁÁ N
+
ÁÁO P
$strËË _
+
ËË` a
$strÈÈ &
+
ÈÈ' (
$strÍÍ 
+
ÍÍ 
$str	ÎÎ ∞
+ÎÎ± ≤
$strÏÏ ^
+
ÏÏ_ `
$strÌÌ J
+
ÌÌK L
$strÓÓ 9
+
ÓÓ: ;
$strÔÔ 
+
ÔÔ 
$str	 õ
+ú ù
$strÒÒ ^
+
ÒÒ_ `
$strÚÚ ?
+
ÚÚ@ A
$strÛÛ 9
+
ÛÛ: ;
$strÙÙ 
+
ÙÙ 
$strıı 

)
ıı
 
;
ıı 
}
ˆˆ 	
private
¯¯ 
static
¯¯ 
void
¯¯ ,
Seed_Sproc_GetAgreementDetails
¯¯ :
(
¯¯: ;
)
¯¯; <
{
˘˘ 	
_db
˙˙ 
.
˙˙ 
ExecuteSqlCommand
˙˙ !
(
˙˙! "
$str
˙˙" Z
)
˙˙Z [
;
˙˙[ \
_db
¸¸ 
.
¸¸ 
ExecuteSqlCommand
¸¸ !
(
¸¸! "
$str
¸¸" [
+
¸¸\ ]
$str˝˝ 
+
˝˝ 
$str˛˛ 
+
˛˛ 	
$strˇˇ 
+
ˇˇ 
$strÄÄ 
+
ÄÄ 
$strÅÅ 
+
ÅÅ 
$strÇÇ I
+
ÇÇJ K
$strÉÉ m
+
ÉÉn o
$strÑÑ V
+
ÑÑW X
$strÖÖ P
+
ÖÖQ R
$strÜÜ "
+
ÜÜ# $
$stráá N
+
ááO P
$stràà 

)
àà
 
;
àà 
}
ââ 	
private
ãã 
static
ãã 
void
ãã 4
&Seed_Sproc_GetDownloadAgreementDetails
ãã B
(
ããB C
)
ããC D
{
åå 	
_db
çç 
.
çç 
ExecuteSqlCommand
çç !
(
çç! "
$str
çç" b
)
ççb c
;
ççc d
_db
èè 
.
èè 
ExecuteSqlCommand
èè !
(
èè! "
$str
èè" a
+
èèb c
$strêê ,
+
êê- .
$strëë %
+
ëë& '
$stríí 
+
íí 	
$strìì 
+
ìì 
$strîî /
+
îî0 1
$strïï ,
+
ïï- .
$strññ 6
+
ññ7 8
$stróó 4
+
óó5 6
$stròò 
+
òò 
$str	ôô É
+ôôÑ Ö
$ströö 2
+
öö3 4
$strõõ !
+
õõ" #
$strúú x
+
úúy z
$str	ùù Å
+ùùÇ É
$strûû 2
+
ûû3 4
$strüü 
+
üü 
$str†† 
+
††  !
$str°° %
+
°°& '
$str¢¢ (
+
¢¢) *
$str££ k
+
££l m
$str§§ e
+
§§f g
$str•• /
+
••0 1
$str¶¶ K
+
¶¶L M
$str	ßß ã
+ßßå ç
$str®® 
+
®® 
$str©© 3
+
©©4 5
$str™™ 
+
™™  !
$str´´ x
+
´´y z
$str	¨¨ É
+¨¨Ñ Ö
$str≠≠ 
+
≠≠ 
$strÆÆ 
+
ÆÆ  
$strØØ -
+
ØØ. /
$str∞∞ j
+
∞∞k l
$str±± /
+
±±0 1
$str≤≤ S
+
≤≤T U
$str≥≥ }
+
≥≥~ 
$str¥¥ 
+
¥¥ 
$strµµ 
+
µµ 
$str∂∂ [
+
∂∂\ ]
$str∑∑ 9
+
∑∑: ;
$str∏∏ 3
+
∏∏4 5
$strππ 
+
ππ 
$str∫∫ 

)
∫∫
 
;
∫∫ 
}
ªª 	
private
ΩΩ 
static
ΩΩ 
void
ΩΩ .
 Seed_Sproc_RetrieveAgreementList
ΩΩ <
(
ΩΩ< =
)
ΩΩ= >
{
ææ 	
_db
øø 
.
øø 
ExecuteSqlCommand
øø !
(
øø! "
$str
øø" \
)
øø\ ]
;
øø] ^
_db
¡¡ 
.
¡¡ 
ExecuteSqlCommand
¡¡ !
(
¡¡! "
$str
¡¡" c
+
¡¡d e
$str¬¬ C
+
¬¬D E
$str√√ G
+
√√H I
$strƒƒ J
+
ƒƒK L
$str≈≈ 0
+
≈≈1 2
$str∆∆ 0
+
∆∆1 2
$str«« )
+
««* +
$str»» 
+
»» 	
$str…… 
+
…… 
$str   
+
   
$strÀÀ 9
+
ÀÀ: ;
$strÃÃ <
+
ÃÃ= >
$strÕÕ O
+
ÕÕP Q
$strŒŒ 4
+
ŒŒ5 6
$strœœ 
+
œœ 
$str–– E
+
––F G
$str—— U
+
——V W
$str““ 
+
““ 
$str”” K
+
””L M
$str‘‘ .
+
‘‘/ 0
$str’’ 6
+
’’7 8
$str÷÷ B
+
÷÷C D
$str◊◊ .
+
◊◊/ 0
$strÿÿ +
+
ÿÿ, -
$strŸŸ  
+
ŸŸ! "
$str⁄⁄ 1
+
⁄⁄2 3
$str€€ [
+
€€\ ]
$str‹‹ z
+
‹‹{ |
$str	›› ú
+››ù û
$strﬁﬁ U
+
ﬁﬁV W
$strﬂﬂ g
+
ﬂﬂh i
$str‡‡ .
+
‡‡/ 0
$str·· A
+
··B C
$str‚‚ Y
+
‚‚Z [
$str„„ b
+
„„c d
$str‰‰ S
+
‰‰T U
$strÂÂ e
+
ÂÂf g
$strÊÊ :
+
ÊÊ; <
$strÁÁ 9
+
ÁÁ: ;
$strËË 7
+
ËË8 9
$strÈÈ -
+
ÈÈ. /
$strÍÍ I
+
ÍÍJ K
$strÎÎ I
+
ÎÎJ K
$strÏÏ Q
+
ÏÏR S
$strÌÌ D
+
ÌÌE F
$str	ÓÓ •
+ÓÓ¶ ß
$str	ÔÔ à
+ÔÔâ ä
$str +
+
, -
$str	ÒÒ æ
+ÒÒø ¿
$strÚÚ n
+
ÚÚo p
$strÛÛ 9
+
ÛÛ: ;
$strÙÙ ?
+
ÙÙ@ A
$strıı *
+
ıı+ ,
$strˆˆ 
+
ˆˆ 
$str˜˜ 
+
˜˜ 
$str¯¯ n
+
¯¯o p
$str˘˘ ~
+˘˘ Ä
$str˙˙ G
+
˙˙H I
$str˚˚ v
+
˚˚w x
$str¸¸ K
+
¸¸L M
$str˝˝ 
+
˝˝ 
$str˛˛ W
+
˛˛X Y
$strˇˇ B
+
ˇˇC D
$strÄÄ 
+
ÄÄ 
$strÅÅ 
+
ÅÅ 
$strÇÇ N
+
ÇÇO P
$strÉÉ u
+
ÉÉv w
$strÑÑ 
+
ÑÑ 
$strÖÖ 
+
ÖÖ 
$strÜÜ t
+
ÜÜu v
$stráá v
+
ááw x
$str	àà ï
+ààñ ó
$strââ H
+
ââI J
$strää Y
+
ääZ [
$strãã  
+
ãã! "
$stråå 
+
åå 
$str	çç ∞
+çç± ≤
$stréé Z
+
éé[ \
$strèè E
+
èèF G
$strêê 4
+
êê5 6
$strëë 
+
ëë 
$str	íí À
+ííÃ Õ
$strìì X
+
ììY Z
$strîî 9
+
îî: ;
$strïï 3
+
ïï4 5
$strññ 
+
ññ 
$stróó 

)
óó
 
;
óó 
}
òò 	
private
öö 
static
öö 
void
öö 7
)Seed_Sproc_RetrieveArchieveVesrionDetails
öö E
(
ööE F
)
ööF G
{
õõ 	
_db
úú 
.
úú 
ExecuteSqlCommand
úú !
(
úú! "
$str
úú" e
)
úúe f
;
úúf g
_db
ûû 
.
ûû 
ExecuteSqlCommand
ûû !
(
ûû! "
$str
ûû" p
+
ûûq r
$strüü G
+
üüH I
$str†† K
+
††L M
$str°° N
+
°°O P
$str¢¢ 8
+
¢¢9 :
$str££ +
+
££, -
$str§§ ,
+
§§- .
$str•• 
+
•• 	
$str¶¶ 
+
¶¶ 
$strßß =
+
ßß> ?
$str®® @
+
®®A B
$str©© S
+
©©T U
$str™™ 8
+
™™9 :
$str´´ F
+
´´G H
$str¨¨ K
+
¨¨L M
$str≠≠ 
+
≠≠ 
$strÆÆ L
+
ÆÆM N
$strØØ 5
+
ØØ6 7
$str∞∞ !
+
∞∞" #
$str±± %
+
±±& '
$str≤≤ K
+
≤≤L M
$str≥≥ u
+
≥≥v w
$str	¥¥ ∞
+¥¥± ≤
$strµµ 1
+
µµ2 3
$str∂∂ -
+
∂∂. /
$str∑∑ 
+
∑∑  !
$str∏∏ /
+
∏∏0 1
$strππ *
+
ππ+ ,
$str∫∫ r
+
∫∫s t
$strªª 
+
ªª 
$strºº 
+
ºº 
$strΩΩ r
+
ΩΩs t
$strææ |
+
ææ} ~
$strøø K
+
øøL M
$str¿¿ z
+
¿¿{ |
$str¡¡ O
+
¡¡P Q
$str¬¬ 
+
¬¬ 
$str√√ [
+
√√\ ]
$strƒƒ F
+
ƒƒG H
$str≈≈ 
+
≈≈  
$str∆∆ 
+
∆∆ 
$str«« x
+
««y z
$str»» z
+
»»{ |
$str	…… ô
+……ö õ
$str   L
+
  M N
$strÀÀ ]
+
ÀÀ^ _
$strÃÃ $
+
ÃÃ% &
$strÕÕ 
+
ÕÕ 
$str	ŒŒ µ
+ŒŒ∂ ∑
$strœœ \
+
œœ] ^
$str–– H
+
––I J
$str—— 7
+
——8 9
$str	““ “
+““” ‘
$str”” \
+
””] ^
$str‘‘ =
+
‘‘> ?
$str’’ 7
+
’’8 9
$str÷÷ 
+
÷÷ 
$str◊◊ 

)
◊◊
 
;
◊◊ 
}
ÿÿ 	
private
⁄⁄ 
static
⁄⁄ 
void
⁄⁄ 8
*Seed_Sproc_RetrieveUserSignUpAgreementList
⁄⁄ F
(
⁄⁄F G
)
⁄⁄G H
{
€€ 	
_db
‹‹ 
.
‹‹ 
ExecuteSqlCommand
‹‹ !
(
‹‹! "
$str
‹‹" f
)
‹‹f g
;
‹‹g h
_db
ﬁﬁ 
.
ﬁﬁ 
ExecuteSqlCommand
ﬁﬁ !
(
ﬁﬁ! "
$str
ﬁﬁ" t
+
ﬁﬁu v
$strﬂﬂ +
+
ﬂﬂ, -
$str‡‡ /
+
‡‡0 1
$str·· 2
+
··3 4
$str‚‚ 8
+
‚‚9 :
$str„„ /
+
„„0 1
$str‰‰ 
+
‰‰ 	
$strÂÂ 
+
ÂÂ 
$strÊÊ 
+
ÊÊ 
$strÁÁ .
+
ÁÁ/ 0
$strËË ;
+
ËË< =
$strÈÈ G
+
ÈÈH I
$strÍÍ 9
+
ÍÍ: ;
$strÎÎ C
+
ÎÎD E
$strÏÏ V
+
ÏÏW X
$strÌÌ U
+
ÌÌV W
$strÓÓ +
+
ÓÓ, -
$strÔÔ +
+
ÔÔ, -
$str -
+
. /
$strÒÒ +
+
ÒÒ, -
$strÚÚ 3
+
ÚÚ4 5
$str	ÛÛ ì
+ÛÛî ï
$strÙÙ +
+
ÙÙ, -
$strıı 7
+
ıı8 9
$strˆˆ &
+
ˆˆ' (
$str	˜˜ î
+˜˜ï ñ
$str¯¯ {
+
¯¯| }
$str˘˘ i
+
˘˘j k
$str˙˙ X
+
˙˙Y Z
$str˚˚ Q
+
˚˚R S
$str¸¸ )
+
¸¸* +
$str˝˝ k
+
˝˝l m
$str˛˛ -
+
˛˛. /
$strˇˇ [
+
ˇˇ\ ]
$strÄÄ 6
+
ÄÄ7 8
$strÅÅ N
+
ÅÅO P
$strÇÇ  
+
ÇÇ! "
$strÉÉ E
+
ÉÉF G
$strÑÑ M
+
ÑÑN O
$strÖÖ 
+
ÖÖ  
$strÜÜ M
+
ÜÜN O
$stráá !
+
áá" #
$stràà L
+
ààM N
$strââ 7
+
ââ8 9
$strää !
+
ää" #
$strãã J
+
ããK L
$stråå J
+
ååK L
$strçç l
+
ççm n
$stréé 
+
éé  
$strèè 0
+
èè1 2
$strêê !
+
êê" #
$str	ëë ∂
+ëë∑ ∏
$stríí >
+
íí? @
$strìì *
+
ìì+ ,
$strîî 2
+
îî3 4
$strïï 
+
ïï 
$str	ññ ∫
+ññª º
$stróó =
+
óó> ?
$stròò )
+
òò* +
$strôô 4
+
ôô5 6
$ströö 

)
öö
 
;
öö 
}
õõ 	
}
úú 
}ùù Ù#
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
}:: ù
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
} Ç
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
} ﬂ
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
} ˜ñ
áD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\AspNetIdentity\FJTIdentityDb\20210119072727_InitialIdentityDbMigration.cs
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
ÄÄ 
:
ÄÄ 
table
ÄÄ "
=>
ÄÄ# %
{
ÅÅ 
table
ÇÇ 
.
ÇÇ 

PrimaryKey
ÇÇ $
(
ÇÇ$ %
$str
ÇÇ% :
,
ÇÇ: ;
x
ÇÇ< =
=>
ÇÇ> @
x
ÇÇA B
.
ÇÇB C
Id
ÇÇC E
)
ÇÇE F
;
ÇÇF G
table
ÉÉ 
.
ÉÉ 

ForeignKey
ÉÉ $
(
ÉÉ$ %
name
ÑÑ 
:
ÑÑ 
$str
ÑÑ F
,
ÑÑF G
column
ÖÖ 
:
ÖÖ 
x
ÖÖ  !
=>
ÖÖ" $
x
ÖÖ% &
.
ÖÖ& '
UserId
ÖÖ' -
,
ÖÖ- .
principalTable
ÜÜ &
:
ÜÜ& '
$str
ÜÜ( 5
,
ÜÜ5 6
principalColumn
áá '
:
áá' (
$str
áá) -
,
áá- .
onDelete
àà  
:
àà  !
ReferentialAction
àà" 3
.
àà3 4
Cascade
àà4 ;
)
àà; <
;
àà< =
}
ââ 
)
ââ 
;
ââ 
migrationBuilder
ãã 
.
ãã 
CreateTable
ãã (
(
ãã( )
name
åå 
:
åå 
$str
åå (
,
åå( )
columns
çç 
:
çç 
table
çç 
=>
çç !
new
çç" %
{
éé 
LoginProvider
èè !
=
èè" #
table
èè$ )
.
èè) *
Column
èè* 0
<
èè0 1
string
èè1 7
>
èè7 8
(
èè8 9
	maxLength
èè9 B
:
èèB C
$num
èèD G
,
èèG H
nullable
èèI Q
:
èèQ R
false
èèS X
)
èèX Y
,
èèY Z
ProviderKey
êê 
=
êê  !
table
êê" '
.
êê' (
Column
êê( .
<
êê. /
string
êê/ 5
>
êê5 6
(
êê6 7
	maxLength
êê7 @
:
êê@ A
$num
êêB E
,
êêE F
nullable
êêG O
:
êêO P
false
êêQ V
)
êêV W
,
êêW X!
ProviderDisplayName
ëë '
=
ëë( )
table
ëë* /
.
ëë/ 0
Column
ëë0 6
<
ëë6 7
string
ëë7 =
>
ëë= >
(
ëë> ?
nullable
ëë? G
:
ëëG H
true
ëëI M
)
ëëM N
,
ëëN O
UserId
íí 
=
íí 
table
íí "
.
íí" #
Column
íí# )
<
íí) *
string
íí* 0
>
íí0 1
(
íí1 2
nullable
íí2 :
:
íí: ;
false
íí< A
)
ííA B
}
ìì 
,
ìì 
constraints
îî 
:
îî 
table
îî "
=>
îî# %
{
ïï 
table
ññ 
.
ññ 

PrimaryKey
ññ $
(
ññ$ %
$str
ññ% :
,
ññ: ;
x
ññ< =
=>
ññ> @
new
ññA D
{
ññE F
x
ññG H
.
ññH I
LoginProvider
ññI V
,
ññV W
x
ññX Y
.
ññY Z
ProviderKey
ññZ e
}
ññf g
)
ññg h
;
ññh i
table
óó 
.
óó 

ForeignKey
óó $
(
óó$ %
name
òò 
:
òò 
$str
òò F
,
òòF G
column
ôô 
:
ôô 
x
ôô  !
=>
ôô" $
x
ôô% &
.
ôô& '
UserId
ôô' -
,
ôô- .
principalTable
öö &
:
öö& '
$str
öö( 5
,
öö5 6
principalColumn
õõ '
:
õõ' (
$str
õõ) -
,
õõ- .
onDelete
úú  
:
úú  !
ReferentialAction
úú" 3
.
úú3 4
Cascade
úú4 ;
)
úú; <
;
úú< =
}
ùù 
)
ùù 
;
ùù 
migrationBuilder
üü 
.
üü 
CreateTable
üü (
(
üü( )
name
†† 
:
†† 
$str
†† '
,
††' (
columns
°° 
:
°° 
table
°° 
=>
°° !
new
°°" %
{
¢¢ 
UserId
££ 
=
££ 
table
££ "
.
££" #
Column
££# )
<
££) *
string
££* 0
>
££0 1
(
££1 2
nullable
££2 :
:
££: ;
false
££< A
)
££A B
,
££B C
RoleId
§§ 
=
§§ 
table
§§ "
.
§§" #
Column
§§# )
<
§§) *
string
§§* 0
>
§§0 1
(
§§1 2
nullable
§§2 :
:
§§: ;
false
§§< A
)
§§A B
}
•• 
,
•• 
constraints
¶¶ 
:
¶¶ 
table
¶¶ "
=>
¶¶# %
{
ßß 
table
®® 
.
®® 

PrimaryKey
®® $
(
®®$ %
$str
®®% 9
,
®®9 :
x
®®; <
=>
®®= ?
new
®®@ C
{
®®D E
x
®®F G
.
®®G H
UserId
®®H N
,
®®N O
x
®®P Q
.
®®Q R
RoleId
®®R X
}
®®Y Z
)
®®Z [
;
®®[ \
table
©© 
.
©© 

ForeignKey
©© $
(
©©$ %
name
™™ 
:
™™ 
$str
™™ E
,
™™E F
column
´´ 
:
´´ 
x
´´  !
=>
´´" $
x
´´% &
.
´´& '
RoleId
´´' -
,
´´- .
principalTable
¨¨ &
:
¨¨& '
$str
¨¨( 5
,
¨¨5 6
principalColumn
≠≠ '
:
≠≠' (
$str
≠≠) -
,
≠≠- .
onDelete
ÆÆ  
:
ÆÆ  !
ReferentialAction
ÆÆ" 3
.
ÆÆ3 4
Cascade
ÆÆ4 ;
)
ÆÆ; <
;
ÆÆ< =
table
ØØ 
.
ØØ 

ForeignKey
ØØ $
(
ØØ$ %
name
∞∞ 
:
∞∞ 
$str
∞∞ E
,
∞∞E F
column
±± 
:
±± 
x
±±  !
=>
±±" $
x
±±% &
.
±±& '
UserId
±±' -
,
±±- .
principalTable
≤≤ &
:
≤≤& '
$str
≤≤( 5
,
≤≤5 6
principalColumn
≥≥ '
:
≥≥' (
$str
≥≥) -
,
≥≥- .
onDelete
¥¥  
:
¥¥  !
ReferentialAction
¥¥" 3
.
¥¥3 4
Cascade
¥¥4 ;
)
¥¥; <
;
¥¥< =
}
µµ 
)
µµ 
;
µµ 
migrationBuilder
∑∑ 
.
∑∑ 
CreateTable
∑∑ (
(
∑∑( )
name
∏∏ 
:
∏∏ 
$str
∏∏ (
,
∏∏( )
columns
ππ 
:
ππ 
table
ππ 
=>
ππ !
new
ππ" %
{
∫∫ 
UserId
ªª 
=
ªª 
table
ªª "
.
ªª" #
Column
ªª# )
<
ªª) *
string
ªª* 0
>
ªª0 1
(
ªª1 2
nullable
ªª2 :
:
ªª: ;
false
ªª< A
)
ªªA B
,
ªªB C
LoginProvider
ºº !
=
ºº" #
table
ºº$ )
.
ºº) *
Column
ºº* 0
<
ºº0 1
string
ºº1 7
>
ºº7 8
(
ºº8 9
	maxLength
ºº9 B
:
ººB C
$num
ººD G
,
ººG H
nullable
ººI Q
:
ººQ R
false
ººS X
)
ººX Y
,
ººY Z
Name
ΩΩ 
=
ΩΩ 
table
ΩΩ  
.
ΩΩ  !
Column
ΩΩ! '
<
ΩΩ' (
string
ΩΩ( .
>
ΩΩ. /
(
ΩΩ/ 0
	maxLength
ΩΩ0 9
:
ΩΩ9 :
$num
ΩΩ; >
,
ΩΩ> ?
nullable
ΩΩ@ H
:
ΩΩH I
false
ΩΩJ O
)
ΩΩO P
,
ΩΩP Q
Value
ææ 
=
ææ 
table
ææ !
.
ææ! "
Column
ææ" (
<
ææ( )
string
ææ) /
>
ææ/ 0
(
ææ0 1
nullable
ææ1 9
:
ææ9 :
true
ææ; ?
)
ææ? @
}
øø 
,
øø 
constraints
¿¿ 
:
¿¿ 
table
¿¿ "
=>
¿¿# %
{
¡¡ 
table
¬¬ 
.
¬¬ 

PrimaryKey
¬¬ $
(
¬¬$ %
$str
¬¬% :
,
¬¬: ;
x
¬¬< =
=>
¬¬> @
new
¬¬A D
{
¬¬E F
x
¬¬G H
.
¬¬H I
UserId
¬¬I O
,
¬¬O P
x
¬¬Q R
.
¬¬R S
LoginProvider
¬¬S `
,
¬¬` a
x
¬¬b c
.
¬¬c d
Name
¬¬d h
}
¬¬i j
)
¬¬j k
;
¬¬k l
table
√√ 
.
√√ 

ForeignKey
√√ $
(
√√$ %
name
ƒƒ 
:
ƒƒ 
$str
ƒƒ F
,
ƒƒF G
column
≈≈ 
:
≈≈ 
x
≈≈  !
=>
≈≈" $
x
≈≈% &
.
≈≈& '
UserId
≈≈' -
,
≈≈- .
principalTable
∆∆ &
:
∆∆& '
$str
∆∆( 5
,
∆∆5 6
principalColumn
«« '
:
««' (
$str
««) -
,
««- .
onDelete
»»  
:
»»  !
ReferentialAction
»»" 3
.
»»3 4
Cascade
»»4 ;
)
»»; <
;
»»< =
}
…… 
)
…… 
;
…… 
migrationBuilder
ÀÀ 
.
ÀÀ 
CreateTable
ÀÀ (
(
ÀÀ( )
name
ÃÃ 
:
ÃÃ 
$str
ÃÃ *
,
ÃÃ* +
columns
ÕÕ 
:
ÕÕ 
table
ÕÕ 
=>
ÕÕ !
new
ÕÕ" %
{
ŒŒ 
Id
œœ 
=
œœ 
table
œœ 
.
œœ 
Column
œœ %
<
œœ% &
int
œœ& )
>
œœ) *
(
œœ* +
nullable
œœ+ 3
:
œœ3 4
false
œœ5 :
)
œœ: ;
.
–– 

Annotation
–– #
(
––# $
$str
––$ C
,
––C D*
MySqlValueGenerationStrategy
––E a
.
––a b
IdentityColumn
––b p
)
––p q
,
––q r
ClientId
—— 
=
—— 
table
—— $
.
——$ %
Column
——% +
<
——+ ,
string
——, 2
>
——2 3
(
——3 4
nullable
——4 <
:
——< =
false
——> C
)
——C D
,
——D E
UserId
““ 
=
““ 
table
““ "
.
““" #
Column
““# )
<
““) *
string
““* 0
>
““0 1
(
““1 2
nullable
““2 :
:
““: ;
true
““< @
)
““@ A
,
““A B
	isDeleted
”” 
=
”” 
table
””  %
.
””% &
Column
””& ,
<
””, -
bool
””- 1
>
””1 2
(
””2 3
nullable
””3 ;
:
””; <
false
””= B
)
””B C
}
’’ 
,
’’ 
constraints
÷÷ 
:
÷÷ 
table
÷÷ "
=>
÷÷# %
{
◊◊ 
table
ÿÿ 
.
ÿÿ 

PrimaryKey
ÿÿ $
(
ÿÿ$ %
$str
ÿÿ% <
,
ÿÿ< =
x
ÿÿ> ?
=>
ÿÿ@ B
x
ÿÿC D
.
ÿÿD E
Id
ÿÿE G
)
ÿÿG H
;
ÿÿH I
table
ŸŸ 
.
ŸŸ 

ForeignKey
ŸŸ $
(
ŸŸ$ %
name
⁄⁄ 
:
⁄⁄ 
$str
⁄⁄ H
,
⁄⁄H I
column
€€ 
:
€€ 
x
€€  !
=>
€€" $
x
€€% &
.
€€& '
UserId
€€' -
,
€€- .
principalTable
‹‹ &
:
‹‹& '
$str
‹‹( 5
,
‹‹5 6
principalColumn
›› '
:
››' (
$str
››) -
,
››- .
onDelete
ﬁﬁ  
:
ﬁﬁ  !
ReferentialAction
ﬁﬁ" 3
.
ﬁﬁ3 4
Restrict
ﬁﬁ4 <
)
ﬁﬁ< =
;
ﬁﬁ= >
}
ﬂﬂ 
)
ﬂﬂ 
;
ﬂﬂ 
migrationBuilder
·· 
.
·· 
CreateIndex
·· (
(
··( )
name
‚‚ 
:
‚‚ 
$str
‚‚ 2
,
‚‚2 3
table
„„ 
:
„„ 
$str
„„ )
,
„„) *
column
‰‰ 
:
‰‰ 
$str
‰‰  
)
‰‰  !
;
‰‰! "
migrationBuilder
ÊÊ 
.
ÊÊ 
CreateIndex
ÊÊ (
(
ÊÊ( )
name
ÁÁ 
:
ÁÁ 
$str
ÁÁ %
,
ÁÁ% &
table
ËË 
:
ËË 
$str
ËË $
,
ËË$ %
column
ÈÈ 
:
ÈÈ 
$str
ÈÈ (
,
ÈÈ( )
unique
ÍÍ 
:
ÍÍ 
true
ÍÍ 
)
ÍÍ 
;
ÍÍ 
migrationBuilder
ÏÏ 
.
ÏÏ 
CreateIndex
ÏÏ (
(
ÏÏ( )
name
ÌÌ 
:
ÌÌ 
$str
ÌÌ 2
,
ÌÌ2 3
table
ÓÓ 
:
ÓÓ 
$str
ÓÓ )
,
ÓÓ) *
column
ÔÔ 
:
ÔÔ 
$str
ÔÔ  
)
ÔÔ  !
;
ÔÔ! "
migrationBuilder
ÒÒ 
.
ÒÒ 
CreateIndex
ÒÒ (
(
ÒÒ( )
name
ÚÚ 
:
ÚÚ 
$str
ÚÚ 2
,
ÚÚ2 3
table
ÛÛ 
:
ÛÛ 
$str
ÛÛ )
,
ÛÛ) *
column
ÙÙ 
:
ÙÙ 
$str
ÙÙ  
)
ÙÙ  !
;
ÙÙ! "
migrationBuilder
ˆˆ 
.
ˆˆ 
CreateIndex
ˆˆ (
(
ˆˆ( )
name
˜˜ 
:
˜˜ 
$str
˜˜ 1
,
˜˜1 2
table
¯¯ 
:
¯¯ 
$str
¯¯ (
,
¯¯( )
column
˘˘ 
:
˘˘ 
$str
˘˘  
)
˘˘  !
;
˘˘! "
migrationBuilder
˚˚ 
.
˚˚ 
CreateIndex
˚˚ (
(
˚˚( )
name
¸¸ 
:
¸¸ 
$str
¸¸ "
,
¸¸" #
table
˝˝ 
:
˝˝ 
$str
˝˝ $
,
˝˝$ %
column
˛˛ 
:
˛˛ 
$str
˛˛ )
)
˛˛) *
;
˛˛* +
migrationBuilder
ÄÄ 
.
ÄÄ 
CreateIndex
ÄÄ (
(
ÄÄ( )
name
ÅÅ 
:
ÅÅ 
$str
ÅÅ %
,
ÅÅ% &
table
ÇÇ 
:
ÇÇ 
$str
ÇÇ $
,
ÇÇ$ %
column
ÉÉ 
:
ÉÉ 
$str
ÉÉ ,
,
ÉÉ, -
unique
ÑÑ 
:
ÑÑ 
true
ÑÑ 
)
ÑÑ 
;
ÑÑ 
migrationBuilder
ÜÜ 
.
ÜÜ 
CreateIndex
ÜÜ (
(
ÜÜ( )
name
áá 
:
áá 
$str
áá 4
,
áá4 5
table
àà 
:
àà 
$str
àà +
,
àà+ ,
column
ââ 
:
ââ 
$str
ââ  
)
ââ  !
;
ââ! "
}
ää 	
	protected
åå 
override
åå 
void
åå 
Down
åå  $
(
åå$ %
MigrationBuilder
åå% 5
migrationBuilder
åå6 F
)
ååF G
{
çç 	
migrationBuilder
éé 
.
éé 
	DropTable
éé &
(
éé& '
name
èè 
:
èè 
$str
èè (
)
èè( )
;
èè) *
migrationBuilder
ëë 
.
ëë 
	DropTable
ëë &
(
ëë& '
name
íí 
:
íí 
$str
íí (
)
íí( )
;
íí) *
migrationBuilder
îî 
.
îî 
	DropTable
îî &
(
îî& '
name
ïï 
:
ïï 
$str
ïï (
)
ïï( )
;
ïï) *
migrationBuilder
óó 
.
óó 
	DropTable
óó &
(
óó& '
name
òò 
:
òò 
$str
òò '
)
òò' (
;
òò( )
migrationBuilder
öö 
.
öö 
	DropTable
öö &
(
öö& '
name
õõ 
:
õõ 
$str
õõ (
)
õõ( )
;
õõ) *
migrationBuilder
ùù 
.
ùù 
	DropTable
ùù &
(
ùù& '
name
ûû 
:
ûû 
$str
ûû *
)
ûû* +
;
ûû+ ,
migrationBuilder
†† 
.
†† 
	DropTable
†† &
(
††& '
name
°° 
:
°° 
$str
°°  
)
°°  !
;
°°! "
migrationBuilder
££ 
.
££ 
	DropTable
££ &
(
££& '
name
§§ 
:
§§ 
$str
§§  
)
§§  !
;
§§! "
migrationBuilder
¶¶ 
.
¶¶ 
	DropTable
¶¶ &
(
¶¶& '
name
ßß 
:
ßß 
$str
ßß #
)
ßß# $
;
ßß$ %
migrationBuilder
©© 
.
©© 
	DropTable
©© &
(
©©& '
name
™™ 
:
™™ 
$str
™™ #
)
™™# $
;
™™$ %
}
´´ 	
}
¨¨ 
}≠≠ ™û
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
ÄÄ 	
migrationBuilder
ÅÅ 
.
ÅÅ 
	DropTable
ÅÅ &
(
ÅÅ& '
name
ÇÇ 
:
ÇÇ 
$str
ÇÇ &
)
ÇÇ& '
;
ÇÇ' (
migrationBuilder
ÑÑ 
.
ÑÑ 
	DropTable
ÑÑ &
(
ÑÑ& '
name
ÖÖ 
:
ÖÖ 
$str
ÖÖ !
)
ÖÖ! "
;
ÖÖ" #
migrationBuilder
áá 
.
áá 
	DropTable
áá &
(
áá& '
name
àà 
:
àà 
$str
àà &
)
àà& '
;
àà' (
}
ââ 	
}
ää 
}ãã ≤:
âD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\AspNetIdentity\FJTIdentityDb\20210223095330_AddTable_systemconfigrations.cs
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
}66 ü
çD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\AspNetIdentity\FJTIdentityDb\20210616043730_Add_changePasswordAt_aspnetusers.cs
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
} ∂Ú
úD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\IdentityServer\ConfigurationDb\20210715060059_InitialIdentityServerConfigurationDbMigration.cs
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
ÅÅ 
.
ÅÅ 
CreateTable
ÅÅ (
(
ÅÅ( )
name
ÇÇ 
:
ÇÇ 
$str
ÇÇ )
,
ÇÇ) *
columns
ÉÉ 
:
ÉÉ 
table
ÉÉ 
=>
ÉÉ !
new
ÉÉ" %
{
ÑÑ 
Id
ÖÖ 
=
ÖÖ 
table
ÖÖ 
.
ÖÖ 
Column
ÖÖ %
<
ÖÖ% &
int
ÖÖ& )
>
ÖÖ) *
(
ÖÖ* +
nullable
ÖÖ+ 3
:
ÖÖ3 4
false
ÖÖ5 :
)
ÖÖ: ;
.
ÜÜ 

Annotation
ÜÜ #
(
ÜÜ# $
$str
ÜÜ$ C
,
ÜÜC D*
MySqlValueGenerationStrategy
ÜÜE a
.
ÜÜa b
IdentityColumn
ÜÜb p
)
ÜÜp q
,
ÜÜq r
Type
áá 
=
áá 
table
áá  
.
áá  !
Column
áá! '
<
áá' (
string
áá( .
>
áá. /
(
áá/ 0
	maxLength
áá0 9
:
áá9 :
$num
áá; >
,
áá> ?
nullable
áá@ H
:
ááH I
false
ááJ O
)
ááO P
,
ááP Q
ApiResourceId
àà !
=
àà" #
table
àà$ )
.
àà) *
Column
àà* 0
<
àà0 1
int
àà1 4
>
àà4 5
(
àà5 6
nullable
àà6 >
:
àà> ?
false
àà@ E
)
ààE F
}
ââ 
,
ââ 
constraints
ää 
:
ää 
table
ää "
=>
ää# %
{
ãã 
table
åå 
.
åå 

PrimaryKey
åå $
(
åå$ %
$str
åå% ;
,
åå; <
x
åå= >
=>
åå? A
x
ååB C
.
ååC D
Id
ååD F
)
ååF G
;
ååG H
table
çç 
.
çç 

ForeignKey
çç $
(
çç$ %
name
éé 
:
éé 
$str
éé O
,
ééO P
column
èè 
:
èè 
x
èè  !
=>
èè" $
x
èè% &
.
èè& '
ApiResourceId
èè' 4
,
èè4 5
principalTable
êê &
:
êê& '
$str
êê( 6
,
êê6 7
principalColumn
ëë '
:
ëë' (
$str
ëë) -
,
ëë- .
onDelete
íí  
:
íí  !
ReferentialAction
íí" 3
.
íí3 4
Cascade
íí4 ;
)
íí; <
;
íí< =
}
ìì 
)
ìì 
;
ìì 
migrationBuilder
ïï 
.
ïï 
CreateTable
ïï (
(
ïï( )
name
ññ 
:
ññ 
$str
ññ -
,
ññ- .
columns
óó 
:
óó 
table
óó 
=>
óó !
new
óó" %
{
òò 
Id
ôô 
=
ôô 
table
ôô 
.
ôô 
Column
ôô %
<
ôô% &
int
ôô& )
>
ôô) *
(
ôô* +
nullable
ôô+ 3
:
ôô3 4
false
ôô5 :
)
ôô: ;
.
öö 

Annotation
öö #
(
öö# $
$str
öö$ C
,
ööC D*
MySqlValueGenerationStrategy
ööE a
.
ööa b
IdentityColumn
ööb p
)
ööp q
,
ööq r
Key
õõ 
=
õõ 
table
õõ 
.
õõ  
Column
õõ  &
<
õõ& '
string
õõ' -
>
õõ- .
(
õõ. /
	maxLength
õõ/ 8
:
õõ8 9
$num
õõ: =
,
õõ= >
nullable
õõ? G
:
õõG H
false
õõI N
)
õõN O
,
õõO P
Value
úú 
=
úú 
table
úú !
.
úú! "
Column
úú" (
<
úú( )
string
úú) /
>
úú/ 0
(
úú0 1
	maxLength
úú1 :
:
úú: ;
$num
úú< @
,
úú@ A
nullable
úúB J
:
úúJ K
false
úúL Q
)
úúQ R
,
úúR S
ApiResourceId
ùù !
=
ùù" #
table
ùù$ )
.
ùù) *
Column
ùù* 0
<
ùù0 1
int
ùù1 4
>
ùù4 5
(
ùù5 6
nullable
ùù6 >
:
ùù> ?
false
ùù@ E
)
ùùE F
}
ûû 
,
ûû 
constraints
üü 
:
üü 
table
üü "
=>
üü# %
{
†† 
table
°° 
.
°° 

PrimaryKey
°° $
(
°°$ %
$str
°°% ?
,
°°? @
x
°°A B
=>
°°C E
x
°°F G
.
°°G H
Id
°°H J
)
°°J K
;
°°K L
table
¢¢ 
.
¢¢ 

ForeignKey
¢¢ $
(
¢¢$ %
name
££ 
:
££ 
$str
££ S
,
££S T
column
§§ 
:
§§ 
x
§§  !
=>
§§" $
x
§§% &
.
§§& '
ApiResourceId
§§' 4
,
§§4 5
principalTable
•• &
:
••& '
$str
••( 6
,
••6 7
principalColumn
¶¶ '
:
¶¶' (
$str
¶¶) -
,
¶¶- .
onDelete
ßß  
:
ßß  !
ReferentialAction
ßß" 3
.
ßß3 4
Cascade
ßß4 ;
)
ßß; <
;
ßß< =
}
®® 
)
®® 
;
®® 
migrationBuilder
™™ 
.
™™ 
CreateTable
™™ (
(
™™( )
name
´´ 
:
´´ 
$str
´´ )
,
´´) *
columns
¨¨ 
:
¨¨ 
table
¨¨ 
=>
¨¨ !
new
¨¨" %
{
≠≠ 
Id
ÆÆ 
=
ÆÆ 
table
ÆÆ 
.
ÆÆ 
Column
ÆÆ %
<
ÆÆ% &
int
ÆÆ& )
>
ÆÆ) *
(
ÆÆ* +
nullable
ÆÆ+ 3
:
ÆÆ3 4
false
ÆÆ5 :
)
ÆÆ: ;
.
ØØ 

Annotation
ØØ #
(
ØØ# $
$str
ØØ$ C
,
ØØC D*
MySqlValueGenerationStrategy
ØØE a
.
ØØa b
IdentityColumn
ØØb p
)
ØØp q
,
ØØq r
Scope
∞∞ 
=
∞∞ 
table
∞∞ !
.
∞∞! "
Column
∞∞" (
<
∞∞( )
string
∞∞) /
>
∞∞/ 0
(
∞∞0 1
	maxLength
∞∞1 :
:
∞∞: ;
$num
∞∞< ?
,
∞∞? @
nullable
∞∞A I
:
∞∞I J
false
∞∞K P
)
∞∞P Q
,
∞∞Q R
ApiResourceId
±± !
=
±±" #
table
±±$ )
.
±±) *
Column
±±* 0
<
±±0 1
int
±±1 4
>
±±4 5
(
±±5 6
nullable
±±6 >
:
±±> ?
false
±±@ E
)
±±E F
}
≤≤ 
,
≤≤ 
constraints
≥≥ 
:
≥≥ 
table
≥≥ "
=>
≥≥# %
{
¥¥ 
table
µµ 
.
µµ 

PrimaryKey
µµ $
(
µµ$ %
$str
µµ% ;
,
µµ; <
x
µµ= >
=>
µµ? A
x
µµB C
.
µµC D
Id
µµD F
)
µµF G
;
µµG H
table
∂∂ 
.
∂∂ 

ForeignKey
∂∂ $
(
∂∂$ %
name
∑∑ 
:
∑∑ 
$str
∑∑ O
,
∑∑O P
column
∏∏ 
:
∏∏ 
x
∏∏  !
=>
∏∏" $
x
∏∏% &
.
∏∏& '
ApiResourceId
∏∏' 4
,
∏∏4 5
principalTable
ππ &
:
ππ& '
$str
ππ( 6
,
ππ6 7
principalColumn
∫∫ '
:
∫∫' (
$str
∫∫) -
,
∫∫- .
onDelete
ªª  
:
ªª  !
ReferentialAction
ªª" 3
.
ªª3 4
Cascade
ªª4 ;
)
ªª; <
;
ªª< =
}
ºº 
)
ºº 
;
ºº 
migrationBuilder
ææ 
.
ææ 
CreateTable
ææ (
(
ææ( )
name
øø 
:
øø 
$str
øø *
,
øø* +
columns
¿¿ 
:
¿¿ 
table
¿¿ 
=>
¿¿ !
new
¿¿" %
{
¡¡ 
Id
¬¬ 
=
¬¬ 
table
¬¬ 
.
¬¬ 
Column
¬¬ %
<
¬¬% &
int
¬¬& )
>
¬¬) *
(
¬¬* +
nullable
¬¬+ 3
:
¬¬3 4
false
¬¬5 :
)
¬¬: ;
.
√√ 

Annotation
√√ #
(
√√# $
$str
√√$ C
,
√√C D*
MySqlValueGenerationStrategy
√√E a
.
√√a b
IdentityColumn
√√b p
)
√√p q
,
√√q r
Description
ƒƒ 
=
ƒƒ  !
table
ƒƒ" '
.
ƒƒ' (
Column
ƒƒ( .
<
ƒƒ. /
string
ƒƒ/ 5
>
ƒƒ5 6
(
ƒƒ6 7
	maxLength
ƒƒ7 @
:
ƒƒ@ A
$num
ƒƒB F
,
ƒƒF G
nullable
ƒƒH P
:
ƒƒP Q
true
ƒƒR V
)
ƒƒV W
,
ƒƒW X
Value
≈≈ 
=
≈≈ 
table
≈≈ !
.
≈≈! "
Column
≈≈" (
<
≈≈( )
string
≈≈) /
>
≈≈/ 0
(
≈≈0 1
	maxLength
≈≈1 :
:
≈≈: ;
$num
≈≈< @
,
≈≈@ A
nullable
≈≈B J
:
≈≈J K
false
≈≈L Q
)
≈≈Q R
,
≈≈R S

Expiration
∆∆ 
=
∆∆  
table
∆∆! &
.
∆∆& '
Column
∆∆' -
<
∆∆- .
DateTime
∆∆. 6
>
∆∆6 7
(
∆∆7 8
nullable
∆∆8 @
:
∆∆@ A
true
∆∆B F
)
∆∆F G
,
∆∆G H
Type
«« 
=
«« 
table
««  
.
««  !
Column
««! '
<
««' (
string
««( .
>
««. /
(
««/ 0
	maxLength
««0 9
:
««9 :
$num
««; >
,
««> ?
nullable
««@ H
:
««H I
false
««J O
)
««O P
,
««P Q
Created
»» 
=
»» 
table
»» #
.
»»# $
Column
»»$ *
<
»»* +
DateTime
»»+ 3
>
»»3 4
(
»»4 5
nullable
»»5 =
:
»»= >
false
»»? D
)
»»D E
,
»»E F
ApiResourceId
…… !
=
……" #
table
……$ )
.
……) *
Column
……* 0
<
……0 1
int
……1 4
>
……4 5
(
……5 6
nullable
……6 >
:
……> ?
false
……@ E
)
……E F
}
   
,
   
constraints
ÀÀ 
:
ÀÀ 
table
ÀÀ "
=>
ÀÀ# %
{
ÃÃ 
table
ÕÕ 
.
ÕÕ 

PrimaryKey
ÕÕ $
(
ÕÕ$ %
$str
ÕÕ% <
,
ÕÕ< =
x
ÕÕ> ?
=>
ÕÕ@ B
x
ÕÕC D
.
ÕÕD E
Id
ÕÕE G
)
ÕÕG H
;
ÕÕH I
table
ŒŒ 
.
ŒŒ 

ForeignKey
ŒŒ $
(
ŒŒ$ %
name
œœ 
:
œœ 
$str
œœ P
,
œœP Q
column
–– 
:
–– 
x
––  !
=>
––" $
x
––% &
.
––& '
ApiResourceId
––' 4
,
––4 5
principalTable
—— &
:
——& '
$str
——( 6
,
——6 7
principalColumn
““ '
:
““' (
$str
““) -
,
““- .
onDelete
””  
:
””  !
ReferentialAction
””" 3
.
””3 4
Cascade
””4 ;
)
””; <
;
””< =
}
‘‘ 
)
‘‘ 
;
‘‘ 
migrationBuilder
÷÷ 
.
÷÷ 
CreateTable
÷÷ (
(
÷÷( )
name
◊◊ 
:
◊◊ 
$str
◊◊ &
,
◊◊& '
columns
ÿÿ 
:
ÿÿ 
table
ÿÿ 
=>
ÿÿ !
new
ÿÿ" %
{
ŸŸ 
Id
⁄⁄ 
=
⁄⁄ 
table
⁄⁄ 
.
⁄⁄ 
Column
⁄⁄ %
<
⁄⁄% &
int
⁄⁄& )
>
⁄⁄) *
(
⁄⁄* +
nullable
⁄⁄+ 3
:
⁄⁄3 4
false
⁄⁄5 :
)
⁄⁄: ;
.
€€ 

Annotation
€€ #
(
€€# $
$str
€€$ C
,
€€C D*
MySqlValueGenerationStrategy
€€E a
.
€€a b
IdentityColumn
€€b p
)
€€p q
,
€€q r
Type
‹‹ 
=
‹‹ 
table
‹‹  
.
‹‹  !
Column
‹‹! '
<
‹‹' (
string
‹‹( .
>
‹‹. /
(
‹‹/ 0
	maxLength
‹‹0 9
:
‹‹9 :
$num
‹‹; >
,
‹‹> ?
nullable
‹‹@ H
:
‹‹H I
false
‹‹J O
)
‹‹O P
,
‹‹P Q
ScopeId
›› 
=
›› 
table
›› #
.
››# $
Column
››$ *
<
››* +
int
››+ .
>
››. /
(
››/ 0
nullable
››0 8
:
››8 9
false
››: ?
)
››? @
}
ﬁﬁ 
,
ﬁﬁ 
constraints
ﬂﬂ 
:
ﬂﬂ 
table
ﬂﬂ "
=>
ﬂﬂ# %
{
‡‡ 
table
·· 
.
·· 

PrimaryKey
·· $
(
··$ %
$str
··% 8
,
··8 9
x
··: ;
=>
··< >
x
··? @
.
··@ A
Id
··A C
)
··C D
;
··D E
table
‚‚ 
.
‚‚ 

ForeignKey
‚‚ $
(
‚‚$ %
name
„„ 
:
„„ 
$str
„„ C
,
„„C D
column
‰‰ 
:
‰‰ 
x
‰‰  !
=>
‰‰" $
x
‰‰% &
.
‰‰& '
ScopeId
‰‰' .
,
‰‰. /
principalTable
ÂÂ &
:
ÂÂ& '
$str
ÂÂ( 3
,
ÂÂ3 4
principalColumn
ÊÊ '
:
ÊÊ' (
$str
ÊÊ) -
,
ÊÊ- .
onDelete
ÁÁ  
:
ÁÁ  !
ReferentialAction
ÁÁ" 3
.
ÁÁ3 4
Cascade
ÁÁ4 ;
)
ÁÁ; <
;
ÁÁ< =
}
ËË 
)
ËË 
;
ËË 
migrationBuilder
ÍÍ 
.
ÍÍ 
CreateTable
ÍÍ (
(
ÍÍ( )
name
ÎÎ 
:
ÎÎ 
$str
ÎÎ *
,
ÎÎ* +
columns
ÏÏ 
:
ÏÏ 
table
ÏÏ 
=>
ÏÏ !
new
ÏÏ" %
{
ÌÌ 
Id
ÓÓ 
=
ÓÓ 
table
ÓÓ 
.
ÓÓ 
Column
ÓÓ %
<
ÓÓ% &
int
ÓÓ& )
>
ÓÓ) *
(
ÓÓ* +
nullable
ÓÓ+ 3
:
ÓÓ3 4
false
ÓÓ5 :
)
ÓÓ: ;
.
ÔÔ 

Annotation
ÔÔ #
(
ÔÔ# $
$str
ÔÔ$ C
,
ÔÔC D*
MySqlValueGenerationStrategy
ÔÔE a
.
ÔÔa b
IdentityColumn
ÔÔb p
)
ÔÔp q
,
ÔÔq r
Key
 
=
 
table
 
.
  
Column
  &
<
& '
string
' -
>
- .
(
. /
	maxLength
/ 8
:
8 9
$num
: =
,
= >
nullable
? G
:
G H
false
I N
)
N O
,
O P
Value
ÒÒ 
=
ÒÒ 
table
ÒÒ !
.
ÒÒ! "
Column
ÒÒ" (
<
ÒÒ( )
string
ÒÒ) /
>
ÒÒ/ 0
(
ÒÒ0 1
	maxLength
ÒÒ1 :
:
ÒÒ: ;
$num
ÒÒ< @
,
ÒÒ@ A
nullable
ÒÒB J
:
ÒÒJ K
false
ÒÒL Q
)
ÒÒQ R
,
ÒÒR S
ScopeId
ÚÚ 
=
ÚÚ 
table
ÚÚ #
.
ÚÚ# $
Column
ÚÚ$ *
<
ÚÚ* +
int
ÚÚ+ .
>
ÚÚ. /
(
ÚÚ/ 0
nullable
ÚÚ0 8
:
ÚÚ8 9
false
ÚÚ: ?
)
ÚÚ? @
}
ÛÛ 
,
ÛÛ 
constraints
ÙÙ 
:
ÙÙ 
table
ÙÙ "
=>
ÙÙ# %
{
ıı 
table
ˆˆ 
.
ˆˆ 

PrimaryKey
ˆˆ $
(
ˆˆ$ %
$str
ˆˆ% <
,
ˆˆ< =
x
ˆˆ> ?
=>
ˆˆ@ B
x
ˆˆC D
.
ˆˆD E
Id
ˆˆE G
)
ˆˆG H
;
ˆˆH I
table
˜˜ 
.
˜˜ 

ForeignKey
˜˜ $
(
˜˜$ %
name
¯¯ 
:
¯¯ 
$str
¯¯ G
,
¯¯G H
column
˘˘ 
:
˘˘ 
x
˘˘  !
=>
˘˘" $
x
˘˘% &
.
˘˘& '
ScopeId
˘˘' .
,
˘˘. /
principalTable
˙˙ &
:
˙˙& '
$str
˙˙( 3
,
˙˙3 4
principalColumn
˚˚ '
:
˚˚' (
$str
˚˚) -
,
˚˚- .
onDelete
¸¸  
:
¸¸  !
ReferentialAction
¸¸" 3
.
¸¸3 4
Cascade
¸¸4 ;
)
¸¸; <
;
¸¸< =
}
˝˝ 
)
˝˝ 
;
˝˝ 
migrationBuilder
ˇˇ 
.
ˇˇ 
CreateTable
ˇˇ (
(
ˇˇ( )
name
ÄÄ 
:
ÄÄ 
$str
ÄÄ $
,
ÄÄ$ %
columns
ÅÅ 
:
ÅÅ 
table
ÅÅ 
=>
ÅÅ !
new
ÅÅ" %
{
ÇÇ 
Id
ÉÉ 
=
ÉÉ 
table
ÉÉ 
.
ÉÉ 
Column
ÉÉ %
<
ÉÉ% &
int
ÉÉ& )
>
ÉÉ) *
(
ÉÉ* +
nullable
ÉÉ+ 3
:
ÉÉ3 4
false
ÉÉ5 :
)
ÉÉ: ;
.
ÑÑ 

Annotation
ÑÑ #
(
ÑÑ# $
$str
ÑÑ$ C
,
ÑÑC D*
MySqlValueGenerationStrategy
ÑÑE a
.
ÑÑa b
IdentityColumn
ÑÑb p
)
ÑÑp q
,
ÑÑq r
Type
ÖÖ 
=
ÖÖ 
table
ÖÖ  
.
ÖÖ  !
Column
ÖÖ! '
<
ÖÖ' (
string
ÖÖ( .
>
ÖÖ. /
(
ÖÖ/ 0
	maxLength
ÖÖ0 9
:
ÖÖ9 :
$num
ÖÖ; >
,
ÖÖ> ?
nullable
ÖÖ@ H
:
ÖÖH I
false
ÖÖJ O
)
ÖÖO P
,
ÖÖP Q
Value
ÜÜ 
=
ÜÜ 
table
ÜÜ !
.
ÜÜ! "
Column
ÜÜ" (
<
ÜÜ( )
string
ÜÜ) /
>
ÜÜ/ 0
(
ÜÜ0 1
	maxLength
ÜÜ1 :
:
ÜÜ: ;
$num
ÜÜ< ?
,
ÜÜ? @
nullable
ÜÜA I
:
ÜÜI J
false
ÜÜK P
)
ÜÜP Q
,
ÜÜQ R
ClientId
áá 
=
áá 
table
áá $
.
áá$ %
Column
áá% +
<
áá+ ,
int
áá, /
>
áá/ 0
(
áá0 1
nullable
áá1 9
:
áá9 :
false
áá; @
)
áá@ A
}
àà 
,
àà 
constraints
ââ 
:
ââ 
table
ââ "
=>
ââ# %
{
ää 
table
ãã 
.
ãã 

PrimaryKey
ãã $
(
ãã$ %
$str
ãã% 6
,
ãã6 7
x
ãã8 9
=>
ãã: <
x
ãã= >
.
ãã> ?
Id
ãã? A
)
ããA B
;
ããB C
table
åå 
.
åå 

ForeignKey
åå $
(
åå$ %
name
çç 
:
çç 
$str
çç @
,
çç@ A
column
éé 
:
éé 
x
éé  !
=>
éé" $
x
éé% &
.
éé& '
ClientId
éé' /
,
éé/ 0
principalTable
èè &
:
èè& '
$str
èè( 1
,
èè1 2
principalColumn
êê '
:
êê' (
$str
êê) -
,
êê- .
onDelete
ëë  
:
ëë  !
ReferentialAction
ëë" 3
.
ëë3 4
Cascade
ëë4 ;
)
ëë; <
;
ëë< =
}
íí 
)
íí 
;
íí 
migrationBuilder
îî 
.
îî 
CreateTable
îî (
(
îî( )
name
ïï 
:
ïï 
$str
ïï )
,
ïï) *
columns
ññ 
:
ññ 
table
ññ 
=>
ññ !
new
ññ" %
{
óó 
Id
òò 
=
òò 
table
òò 
.
òò 
Column
òò %
<
òò% &
int
òò& )
>
òò) *
(
òò* +
nullable
òò+ 3
:
òò3 4
false
òò5 :
)
òò: ;
.
ôô 

Annotation
ôô #
(
ôô# $
$str
ôô$ C
,
ôôC D*
MySqlValueGenerationStrategy
ôôE a
.
ôôa b
IdentityColumn
ôôb p
)
ôôp q
,
ôôq r
Origin
öö 
=
öö 
table
öö "
.
öö" #
Column
öö# )
<
öö) *
string
öö* 0
>
öö0 1
(
öö1 2
	maxLength
öö2 ;
:
öö; <
$num
öö= @
,
öö@ A
nullable
ööB J
:
ööJ K
false
ööL Q
)
ööQ R
,
ööR S
ClientId
õõ 
=
õõ 
table
õõ $
.
õõ$ %
Column
õõ% +
<
õõ+ ,
int
õõ, /
>
õõ/ 0
(
õõ0 1
nullable
õõ1 9
:
õõ9 :
false
õõ; @
)
õõ@ A
}
úú 
,
úú 
constraints
ùù 
:
ùù 
table
ùù "
=>
ùù# %
{
ûû 
table
üü 
.
üü 

PrimaryKey
üü $
(
üü$ %
$str
üü% ;
,
üü; <
x
üü= >
=>
üü? A
x
üüB C
.
üüC D
Id
üüD F
)
üüF G
;
üüG H
table
†† 
.
†† 

ForeignKey
†† $
(
††$ %
name
°° 
:
°° 
$str
°° E
,
°°E F
column
¢¢ 
:
¢¢ 
x
¢¢  !
=>
¢¢" $
x
¢¢% &
.
¢¢& '
ClientId
¢¢' /
,
¢¢/ 0
principalTable
££ &
:
££& '
$str
££( 1
,
££1 2
principalColumn
§§ '
:
§§' (
$str
§§) -
,
§§- .
onDelete
••  
:
••  !
ReferentialAction
••" 3
.
••3 4
Cascade
••4 ;
)
••; <
;
••< =
}
¶¶ 
)
¶¶ 
;
¶¶ 
migrationBuilder
®® 
.
®® 
CreateTable
®® (
(
®®( )
name
©© 
:
©© 
$str
©© (
,
©©( )
columns
™™ 
:
™™ 
table
™™ 
=>
™™ !
new
™™" %
{
´´ 
Id
¨¨ 
=
¨¨ 
table
¨¨ 
.
¨¨ 
Column
¨¨ %
<
¨¨% &
int
¨¨& )
>
¨¨) *
(
¨¨* +
nullable
¨¨+ 3
:
¨¨3 4
false
¨¨5 :
)
¨¨: ;
.
≠≠ 

Annotation
≠≠ #
(
≠≠# $
$str
≠≠$ C
,
≠≠C D*
MySqlValueGenerationStrategy
≠≠E a
.
≠≠a b
IdentityColumn
≠≠b p
)
≠≠p q
,
≠≠q r
	GrantType
ÆÆ 
=
ÆÆ 
table
ÆÆ  %
.
ÆÆ% &
Column
ÆÆ& ,
<
ÆÆ, -
string
ÆÆ- 3
>
ÆÆ3 4
(
ÆÆ4 5
	maxLength
ÆÆ5 >
:
ÆÆ> ?
$num
ÆÆ@ C
,
ÆÆC D
nullable
ÆÆE M
:
ÆÆM N
false
ÆÆO T
)
ÆÆT U
,
ÆÆU V
ClientId
ØØ 
=
ØØ 
table
ØØ $
.
ØØ$ %
Column
ØØ% +
<
ØØ+ ,
int
ØØ, /
>
ØØ/ 0
(
ØØ0 1
nullable
ØØ1 9
:
ØØ9 :
false
ØØ; @
)
ØØ@ A
}
∞∞ 
,
∞∞ 
constraints
±± 
:
±± 
table
±± "
=>
±±# %
{
≤≤ 
table
≥≥ 
.
≥≥ 

PrimaryKey
≥≥ $
(
≥≥$ %
$str
≥≥% :
,
≥≥: ;
x
≥≥< =
=>
≥≥> @
x
≥≥A B
.
≥≥B C
Id
≥≥C E
)
≥≥E F
;
≥≥F G
table
¥¥ 
.
¥¥ 

ForeignKey
¥¥ $
(
¥¥$ %
name
µµ 
:
µµ 
$str
µµ D
,
µµD E
column
∂∂ 
:
∂∂ 
x
∂∂  !
=>
∂∂" $
x
∂∂% &
.
∂∂& '
ClientId
∂∂' /
,
∂∂/ 0
principalTable
∑∑ &
:
∑∑& '
$str
∑∑( 1
,
∑∑1 2
principalColumn
∏∏ '
:
∏∏' (
$str
∏∏) -
,
∏∏- .
onDelete
ππ  
:
ππ  !
ReferentialAction
ππ" 3
.
ππ3 4
Cascade
ππ4 ;
)
ππ; <
;
ππ< =
}
∫∫ 
)
∫∫ 
;
∫∫ 
migrationBuilder
ºº 
.
ºº 
CreateTable
ºº (
(
ºº( )
name
ΩΩ 
:
ΩΩ 
$str
ΩΩ -
,
ΩΩ- .
columns
ææ 
:
ææ 
table
ææ 
=>
ææ !
new
ææ" %
{
øø 
Id
¿¿ 
=
¿¿ 
table
¿¿ 
.
¿¿ 
Column
¿¿ %
<
¿¿% &
int
¿¿& )
>
¿¿) *
(
¿¿* +
nullable
¿¿+ 3
:
¿¿3 4
false
¿¿5 :
)
¿¿: ;
.
¡¡ 

Annotation
¡¡ #
(
¡¡# $
$str
¡¡$ C
,
¡¡C D*
MySqlValueGenerationStrategy
¡¡E a
.
¡¡a b
IdentityColumn
¡¡b p
)
¡¡p q
,
¡¡q r
Provider
¬¬ 
=
¬¬ 
table
¬¬ $
.
¬¬$ %
Column
¬¬% +
<
¬¬+ ,
string
¬¬, 2
>
¬¬2 3
(
¬¬3 4
	maxLength
¬¬4 =
:
¬¬= >
$num
¬¬? B
,
¬¬B C
nullable
¬¬D L
:
¬¬L M
false
¬¬N S
)
¬¬S T
,
¬¬T U
ClientId
√√ 
=
√√ 
table
√√ $
.
√√$ %
Column
√√% +
<
√√+ ,
int
√√, /
>
√√/ 0
(
√√0 1
nullable
√√1 9
:
√√9 :
false
√√; @
)
√√@ A
}
ƒƒ 
,
ƒƒ 
constraints
≈≈ 
:
≈≈ 
table
≈≈ "
=>
≈≈# %
{
∆∆ 
table
«« 
.
«« 

PrimaryKey
«« $
(
««$ %
$str
««% ?
,
««? @
x
««A B
=>
««C E
x
««F G
.
««G H
Id
««H J
)
««J K
;
««K L
table
»» 
.
»» 

ForeignKey
»» $
(
»»$ %
name
…… 
:
…… 
$str
…… I
,
……I J
column
   
:
   
x
    !
=>
  " $
x
  % &
.
  & '
ClientId
  ' /
,
  / 0
principalTable
ÀÀ &
:
ÀÀ& '
$str
ÀÀ( 1
,
ÀÀ1 2
principalColumn
ÃÃ '
:
ÃÃ' (
$str
ÃÃ) -
,
ÃÃ- .
onDelete
ÕÕ  
:
ÕÕ  !
ReferentialAction
ÕÕ" 3
.
ÕÕ3 4
Cascade
ÕÕ4 ;
)
ÕÕ; <
;
ÕÕ< =
}
ŒŒ 
)
ŒŒ 
;
ŒŒ 
migrationBuilder
–– 
.
–– 
CreateTable
–– (
(
––( )
name
—— 
:
—— 
$str
—— 4
,
——4 5
columns
““ 
:
““ 
table
““ 
=>
““ !
new
““" %
{
”” 
Id
‘‘ 
=
‘‘ 
table
‘‘ 
.
‘‘ 
Column
‘‘ %
<
‘‘% &
int
‘‘& )
>
‘‘) *
(
‘‘* +
nullable
‘‘+ 3
:
‘‘3 4
false
‘‘5 :
)
‘‘: ;
.
’’ 

Annotation
’’ #
(
’’# $
$str
’’$ C
,
’’C D*
MySqlValueGenerationStrategy
’’E a
.
’’a b
IdentityColumn
’’b p
)
’’p q
,
’’q r#
PostLogoutRedirectUri
÷÷ )
=
÷÷* +
table
÷÷, 1
.
÷÷1 2
Column
÷÷2 8
<
÷÷8 9
string
÷÷9 ?
>
÷÷? @
(
÷÷@ A
	maxLength
÷÷A J
:
÷÷J K
$num
÷÷L P
,
÷÷P Q
nullable
÷÷R Z
:
÷÷Z [
false
÷÷\ a
)
÷÷a b
,
÷÷b c
ClientId
◊◊ 
=
◊◊ 
table
◊◊ $
.
◊◊$ %
Column
◊◊% +
<
◊◊+ ,
int
◊◊, /
>
◊◊/ 0
(
◊◊0 1
nullable
◊◊1 9
:
◊◊9 :
false
◊◊; @
)
◊◊@ A
}
ÿÿ 
,
ÿÿ 
constraints
ŸŸ 
:
ŸŸ 
table
ŸŸ "
=>
ŸŸ# %
{
⁄⁄ 
table
€€ 
.
€€ 

PrimaryKey
€€ $
(
€€$ %
$str
€€% F
,
€€F G
x
€€H I
=>
€€J L
x
€€M N
.
€€N O
Id
€€O Q
)
€€Q R
;
€€R S
table
‹‹ 
.
‹‹ 

ForeignKey
‹‹ $
(
‹‹$ %
name
›› 
:
›› 
$str
›› P
,
››P Q
column
ﬁﬁ 
:
ﬁﬁ 
x
ﬁﬁ  !
=>
ﬁﬁ" $
x
ﬁﬁ% &
.
ﬁﬁ& '
ClientId
ﬁﬁ' /
,
ﬁﬁ/ 0
principalTable
ﬂﬂ &
:
ﬂﬂ& '
$str
ﬂﬂ( 1
,
ﬂﬂ1 2
principalColumn
‡‡ '
:
‡‡' (
$str
‡‡) -
,
‡‡- .
onDelete
··  
:
··  !
ReferentialAction
··" 3
.
··3 4
Cascade
··4 ;
)
··; <
;
··< =
}
‚‚ 
)
‚‚ 
;
‚‚ 
migrationBuilder
‰‰ 
.
‰‰ 
CreateTable
‰‰ (
(
‰‰( )
name
ÂÂ 
:
ÂÂ 
$str
ÂÂ (
,
ÂÂ( )
columns
ÊÊ 
:
ÊÊ 
table
ÊÊ 
=>
ÊÊ !
new
ÊÊ" %
{
ÁÁ 
Id
ËË 
=
ËË 
table
ËË 
.
ËË 
Column
ËË %
<
ËË% &
int
ËË& )
>
ËË) *
(
ËË* +
nullable
ËË+ 3
:
ËË3 4
false
ËË5 :
)
ËË: ;
.
ÈÈ 

Annotation
ÈÈ #
(
ÈÈ# $
$str
ÈÈ$ C
,
ÈÈC D*
MySqlValueGenerationStrategy
ÈÈE a
.
ÈÈa b
IdentityColumn
ÈÈb p
)
ÈÈp q
,
ÈÈq r
Key
ÍÍ 
=
ÍÍ 
table
ÍÍ 
.
ÍÍ  
Column
ÍÍ  &
<
ÍÍ& '
string
ÍÍ' -
>
ÍÍ- .
(
ÍÍ. /
	maxLength
ÍÍ/ 8
:
ÍÍ8 9
$num
ÍÍ: =
,
ÍÍ= >
nullable
ÍÍ? G
:
ÍÍG H
false
ÍÍI N
)
ÍÍN O
,
ÍÍO P
Value
ÎÎ 
=
ÎÎ 
table
ÎÎ !
.
ÎÎ! "
Column
ÎÎ" (
<
ÎÎ( )
string
ÎÎ) /
>
ÎÎ/ 0
(
ÎÎ0 1
	maxLength
ÎÎ1 :
:
ÎÎ: ;
$num
ÎÎ< @
,
ÎÎ@ A
nullable
ÎÎB J
:
ÎÎJ K
false
ÎÎL Q
)
ÎÎQ R
,
ÎÎR S
ClientId
ÏÏ 
=
ÏÏ 
table
ÏÏ $
.
ÏÏ$ %
Column
ÏÏ% +
<
ÏÏ+ ,
int
ÏÏ, /
>
ÏÏ/ 0
(
ÏÏ0 1
nullable
ÏÏ1 9
:
ÏÏ9 :
false
ÏÏ; @
)
ÏÏ@ A
}
ÌÌ 
,
ÌÌ 
constraints
ÓÓ 
:
ÓÓ 
table
ÓÓ "
=>
ÓÓ# %
{
ÔÔ 
table
 
.
 

PrimaryKey
 $
(
$ %
$str
% :
,
: ;
x
< =
=>
> @
x
A B
.
B C
Id
C E
)
E F
;
F G
table
ÒÒ 
.
ÒÒ 

ForeignKey
ÒÒ $
(
ÒÒ$ %
name
ÚÚ 
:
ÚÚ 
$str
ÚÚ D
,
ÚÚD E
column
ÛÛ 
:
ÛÛ 
x
ÛÛ  !
=>
ÛÛ" $
x
ÛÛ% &
.
ÛÛ& '
ClientId
ÛÛ' /
,
ÛÛ/ 0
principalTable
ÙÙ &
:
ÙÙ& '
$str
ÙÙ( 1
,
ÙÙ1 2
principalColumn
ıı '
:
ıı' (
$str
ıı) -
,
ıı- .
onDelete
ˆˆ  
:
ˆˆ  !
ReferentialAction
ˆˆ" 3
.
ˆˆ3 4
Cascade
ˆˆ4 ;
)
ˆˆ; <
;
ˆˆ< =
}
˜˜ 
)
˜˜ 
;
˜˜ 
migrationBuilder
˘˘ 
.
˘˘ 
CreateTable
˘˘ (
(
˘˘( )
name
˙˙ 
:
˙˙ 
$str
˙˙ *
,
˙˙* +
columns
˚˚ 
:
˚˚ 
table
˚˚ 
=>
˚˚ !
new
˚˚" %
{
¸¸ 
Id
˝˝ 
=
˝˝ 
table
˝˝ 
.
˝˝ 
Column
˝˝ %
<
˝˝% &
int
˝˝& )
>
˝˝) *
(
˝˝* +
nullable
˝˝+ 3
:
˝˝3 4
false
˝˝5 :
)
˝˝: ;
.
˛˛ 

Annotation
˛˛ #
(
˛˛# $
$str
˛˛$ C
,
˛˛C D*
MySqlValueGenerationStrategy
˛˛E a
.
˛˛a b
IdentityColumn
˛˛b p
)
˛˛p q
,
˛˛q r
RedirectUri
ˇˇ 
=
ˇˇ  !
table
ˇˇ" '
.
ˇˇ' (
Column
ˇˇ( .
<
ˇˇ. /
string
ˇˇ/ 5
>
ˇˇ5 6
(
ˇˇ6 7
	maxLength
ˇˇ7 @
:
ˇˇ@ A
$num
ˇˇB F
,
ˇˇF G
nullable
ˇˇH P
:
ˇˇP Q
false
ˇˇR W
)
ˇˇW X
,
ˇˇX Y
ClientId
ÄÄ 
=
ÄÄ 
table
ÄÄ $
.
ÄÄ$ %
Column
ÄÄ% +
<
ÄÄ+ ,
int
ÄÄ, /
>
ÄÄ/ 0
(
ÄÄ0 1
nullable
ÄÄ1 9
:
ÄÄ9 :
false
ÄÄ; @
)
ÄÄ@ A
}
ÅÅ 
,
ÅÅ 
constraints
ÇÇ 
:
ÇÇ 
table
ÇÇ "
=>
ÇÇ# %
{
ÉÉ 
table
ÑÑ 
.
ÑÑ 

PrimaryKey
ÑÑ $
(
ÑÑ$ %
$str
ÑÑ% <
,
ÑÑ< =
x
ÑÑ> ?
=>
ÑÑ@ B
x
ÑÑC D
.
ÑÑD E
Id
ÑÑE G
)
ÑÑG H
;
ÑÑH I
table
ÖÖ 
.
ÖÖ 

ForeignKey
ÖÖ $
(
ÖÖ$ %
name
ÜÜ 
:
ÜÜ 
$str
ÜÜ F
,
ÜÜF G
column
áá 
:
áá 
x
áá  !
=>
áá" $
x
áá% &
.
áá& '
ClientId
áá' /
,
áá/ 0
principalTable
àà &
:
àà& '
$str
àà( 1
,
àà1 2
principalColumn
ââ '
:
ââ' (
$str
ââ) -
,
ââ- .
onDelete
ää  
:
ää  !
ReferentialAction
ää" 3
.
ää3 4
Cascade
ää4 ;
)
ää; <
;
ää< =
}
ãã 
)
ãã 
;
ãã 
migrationBuilder
çç 
.
çç 
CreateTable
çç (
(
çç( )
name
éé 
:
éé 
$str
éé $
,
éé$ %
columns
èè 
:
èè 
table
èè 
=>
èè !
new
èè" %
{
êê 
Id
ëë 
=
ëë 
table
ëë 
.
ëë 
Column
ëë %
<
ëë% &
int
ëë& )
>
ëë) *
(
ëë* +
nullable
ëë+ 3
:
ëë3 4
false
ëë5 :
)
ëë: ;
.
íí 

Annotation
íí #
(
íí# $
$str
íí$ C
,
ííC D*
MySqlValueGenerationStrategy
ííE a
.
íía b
IdentityColumn
ííb p
)
ííp q
,
ííq r
Scope
ìì 
=
ìì 
table
ìì !
.
ìì! "
Column
ìì" (
<
ìì( )
string
ìì) /
>
ìì/ 0
(
ìì0 1
	maxLength
ìì1 :
:
ìì: ;
$num
ìì< ?
,
ìì? @
nullable
ììA I
:
ììI J
false
ììK P
)
ììP Q
,
ììQ R
ClientId
îî 
=
îî 
table
îî $
.
îî$ %
Column
îî% +
<
îî+ ,
int
îî, /
>
îî/ 0
(
îî0 1
nullable
îî1 9
:
îî9 :
false
îî; @
)
îî@ A
}
ïï 
,
ïï 
constraints
ññ 
:
ññ 
table
ññ "
=>
ññ# %
{
óó 
table
òò 
.
òò 

PrimaryKey
òò $
(
òò$ %
$str
òò% 6
,
òò6 7
x
òò8 9
=>
òò: <
x
òò= >
.
òò> ?
Id
òò? A
)
òòA B
;
òòB C
table
ôô 
.
ôô 

ForeignKey
ôô $
(
ôô$ %
name
öö 
:
öö 
$str
öö @
,
öö@ A
column
õõ 
:
õõ 
x
õõ  !
=>
õõ" $
x
õõ% &
.
õõ& '
ClientId
õõ' /
,
õõ/ 0
principalTable
úú &
:
úú& '
$str
úú( 1
,
úú1 2
principalColumn
ùù '
:
ùù' (
$str
ùù) -
,
ùù- .
onDelete
ûû  
:
ûû  !
ReferentialAction
ûû" 3
.
ûû3 4
Cascade
ûû4 ;
)
ûû; <
;
ûû< =
}
üü 
)
üü 
;
üü 
migrationBuilder
°° 
.
°° 
CreateTable
°° (
(
°°( )
name
¢¢ 
:
¢¢ 
$str
¢¢ %
,
¢¢% &
columns
££ 
:
££ 
table
££ 
=>
££ !
new
££" %
{
§§ 
Id
•• 
=
•• 
table
•• 
.
•• 
Column
•• %
<
••% &
int
••& )
>
••) *
(
••* +
nullable
••+ 3
:
••3 4
false
••5 :
)
••: ;
.
¶¶ 

Annotation
¶¶ #
(
¶¶# $
$str
¶¶$ C
,
¶¶C D*
MySqlValueGenerationStrategy
¶¶E a
.
¶¶a b
IdentityColumn
¶¶b p
)
¶¶p q
,
¶¶q r
Description
ßß 
=
ßß  !
table
ßß" '
.
ßß' (
Column
ßß( .
<
ßß. /
string
ßß/ 5
>
ßß5 6
(
ßß6 7
	maxLength
ßß7 @
:
ßß@ A
$num
ßßB F
,
ßßF G
nullable
ßßH P
:
ßßP Q
true
ßßR V
)
ßßV W
,
ßßW X
Value
®® 
=
®® 
table
®® !
.
®®! "
Column
®®" (
<
®®( )
string
®®) /
>
®®/ 0
(
®®0 1
	maxLength
®®1 :
:
®®: ;
$num
®®< @
,
®®@ A
nullable
®®B J
:
®®J K
false
®®L Q
)
®®Q R
,
®®R S

Expiration
©© 
=
©©  
table
©©! &
.
©©& '
Column
©©' -
<
©©- .
DateTime
©©. 6
>
©©6 7
(
©©7 8
nullable
©©8 @
:
©©@ A
true
©©B F
)
©©F G
,
©©G H
Type
™™ 
=
™™ 
table
™™  
.
™™  !
Column
™™! '
<
™™' (
string
™™( .
>
™™. /
(
™™/ 0
	maxLength
™™0 9
:
™™9 :
$num
™™; >
,
™™> ?
nullable
™™@ H
:
™™H I
false
™™J O
)
™™O P
,
™™P Q
Created
´´ 
=
´´ 
table
´´ #
.
´´# $
Column
´´$ *
<
´´* +
DateTime
´´+ 3
>
´´3 4
(
´´4 5
nullable
´´5 =
:
´´= >
false
´´? D
)
´´D E
,
´´E F
ClientId
¨¨ 
=
¨¨ 
table
¨¨ $
.
¨¨$ %
Column
¨¨% +
<
¨¨+ ,
int
¨¨, /
>
¨¨/ 0
(
¨¨0 1
nullable
¨¨1 9
:
¨¨9 :
false
¨¨; @
)
¨¨@ A
}
≠≠ 
,
≠≠ 
constraints
ÆÆ 
:
ÆÆ 
table
ÆÆ "
=>
ÆÆ# %
{
ØØ 
table
∞∞ 
.
∞∞ 

PrimaryKey
∞∞ $
(
∞∞$ %
$str
∞∞% 7
,
∞∞7 8
x
∞∞9 :
=>
∞∞; =
x
∞∞> ?
.
∞∞? @
Id
∞∞@ B
)
∞∞B C
;
∞∞C D
table
±± 
.
±± 

ForeignKey
±± $
(
±±$ %
name
≤≤ 
:
≤≤ 
$str
≤≤ A
,
≤≤A B
column
≥≥ 
:
≥≥ 
x
≥≥  !
=>
≥≥" $
x
≥≥% &
.
≥≥& '
ClientId
≥≥' /
,
≥≥/ 0
principalTable
¥¥ &
:
¥¥& '
$str
¥¥( 1
,
¥¥1 2
principalColumn
µµ '
:
µµ' (
$str
µµ) -
,
µµ- .
onDelete
∂∂  
:
∂∂  !
ReferentialAction
∂∂" 3
.
∂∂3 4
Cascade
∂∂4 ;
)
∂∂; <
;
∂∂< =
}
∑∑ 
)
∑∑ 
;
∑∑ 
migrationBuilder
ππ 
.
ππ 
CreateTable
ππ (
(
ππ( )
name
∫∫ 
:
∫∫ 
$str
∫∫ .
,
∫∫. /
columns
ªª 
:
ªª 
table
ªª 
=>
ªª !
new
ªª" %
{
ºº 
Id
ΩΩ 
=
ΩΩ 
table
ΩΩ 
.
ΩΩ 
Column
ΩΩ %
<
ΩΩ% &
int
ΩΩ& )
>
ΩΩ) *
(
ΩΩ* +
nullable
ΩΩ+ 3
:
ΩΩ3 4
false
ΩΩ5 :
)
ΩΩ: ;
.
ææ 

Annotation
ææ #
(
ææ# $
$str
ææ$ C
,
ææC D*
MySqlValueGenerationStrategy
ææE a
.
ææa b
IdentityColumn
ææb p
)
ææp q
,
ææq r
Type
øø 
=
øø 
table
øø  
.
øø  !
Column
øø! '
<
øø' (
string
øø( .
>
øø. /
(
øø/ 0
	maxLength
øø0 9
:
øø9 :
$num
øø; >
,
øø> ?
nullable
øø@ H
:
øøH I
false
øøJ O
)
øøO P
,
øøP Q 
IdentityResourceId
¿¿ &
=
¿¿' (
table
¿¿) .
.
¿¿. /
Column
¿¿/ 5
<
¿¿5 6
int
¿¿6 9
>
¿¿9 :
(
¿¿: ;
nullable
¿¿; C
:
¿¿C D
false
¿¿E J
)
¿¿J K
}
¡¡ 
,
¡¡ 
constraints
¬¬ 
:
¬¬ 
table
¬¬ "
=>
¬¬# %
{
√√ 
table
ƒƒ 
.
ƒƒ 

PrimaryKey
ƒƒ $
(
ƒƒ$ %
$str
ƒƒ% @
,
ƒƒ@ A
x
ƒƒB C
=>
ƒƒD F
x
ƒƒG H
.
ƒƒH I
Id
ƒƒI K
)
ƒƒK L
;
ƒƒL M
table
≈≈ 
.
≈≈ 

ForeignKey
≈≈ $
(
≈≈$ %
name
∆∆ 
:
∆∆ 
$str
∆∆ ^
,
∆∆^ _
column
«« 
:
«« 
x
««  !
=>
««" $
x
««% &
.
««& ' 
IdentityResourceId
««' 9
,
««9 :
principalTable
»» &
:
»»& '
$str
»»( ;
,
»»; <
principalColumn
…… '
:
……' (
$str
……) -
,
……- .
onDelete
    
:
    !
ReferentialAction
  " 3
.
  3 4
Cascade
  4 ;
)
  ; <
;
  < =
}
ÀÀ 
)
ÀÀ 
;
ÀÀ 
migrationBuilder
ÕÕ 
.
ÕÕ 
CreateTable
ÕÕ (
(
ÕÕ( )
name
ŒŒ 
:
ŒŒ 
$str
ŒŒ 2
,
ŒŒ2 3
columns
œœ 
:
œœ 
table
œœ 
=>
œœ !
new
œœ" %
{
–– 
Id
—— 
=
—— 
table
—— 
.
—— 
Column
—— %
<
——% &
int
——& )
>
——) *
(
——* +
nullable
——+ 3
:
——3 4
false
——5 :
)
——: ;
.
““ 

Annotation
““ #
(
““# $
$str
““$ C
,
““C D*
MySqlValueGenerationStrategy
““E a
.
““a b
IdentityColumn
““b p
)
““p q
,
““q r
Key
”” 
=
”” 
table
”” 
.
””  
Column
””  &
<
””& '
string
””' -
>
””- .
(
””. /
	maxLength
””/ 8
:
””8 9
$num
””: =
,
””= >
nullable
””? G
:
””G H
false
””I N
)
””N O
,
””O P
Value
‘‘ 
=
‘‘ 
table
‘‘ !
.
‘‘! "
Column
‘‘" (
<
‘‘( )
string
‘‘) /
>
‘‘/ 0
(
‘‘0 1
	maxLength
‘‘1 :
:
‘‘: ;
$num
‘‘< @
,
‘‘@ A
nullable
‘‘B J
:
‘‘J K
false
‘‘L Q
)
‘‘Q R
,
‘‘R S 
IdentityResourceId
’’ &
=
’’' (
table
’’) .
.
’’. /
Column
’’/ 5
<
’’5 6
int
’’6 9
>
’’9 :
(
’’: ;
nullable
’’; C
:
’’C D
false
’’E J
)
’’J K
}
÷÷ 
,
÷÷ 
constraints
◊◊ 
:
◊◊ 
table
◊◊ "
=>
◊◊# %
{
ÿÿ 
table
ŸŸ 
.
ŸŸ 

PrimaryKey
ŸŸ $
(
ŸŸ$ %
$str
ŸŸ% D
,
ŸŸD E
x
ŸŸF G
=>
ŸŸH J
x
ŸŸK L
.
ŸŸL M
Id
ŸŸM O
)
ŸŸO P
;
ŸŸP Q
table
⁄⁄ 
.
⁄⁄ 

ForeignKey
⁄⁄ $
(
⁄⁄$ %
name
€€ 
:
€€ 
$str
€€ `
,
€€` a
column
‹‹ 
:
‹‹ 
x
‹‹  !
=>
‹‹" $
x
‹‹% &
.
‹‹& ' 
IdentityResourceId
‹‹' 9
,
‹‹9 :
principalTable
›› &
:
››& '
$str
››( ;
,
››; <
principalColumn
ﬁﬁ '
:
ﬁﬁ' (
$str
ﬁﬁ) -
,
ﬁﬁ- .
onDelete
ﬂﬂ  
:
ﬂﬂ  !
ReferentialAction
ﬂﬂ" 3
.
ﬂﬂ3 4
Cascade
ﬂﬂ4 ;
)
ﬂﬂ; <
;
ﬂﬂ< =
}
‡‡ 
)
‡‡ 
;
‡‡ 
migrationBuilder
‚‚ 
.
‚‚ 
CreateIndex
‚‚ (
(
‚‚( )
name
„„ 
:
„„ 
$str
„„ :
,
„„: ;
table
‰‰ 
:
‰‰ 
$str
‰‰ *
,
‰‰* +
column
ÂÂ 
:
ÂÂ 
$str
ÂÂ '
)
ÂÂ' (
;
ÂÂ( )
migrationBuilder
ÁÁ 
.
ÁÁ 
CreateIndex
ÁÁ (
(
ÁÁ( )
name
ËË 
:
ËË 
$str
ËË >
,
ËË> ?
table
ÈÈ 
:
ÈÈ 
$str
ÈÈ .
,
ÈÈ. /
column
ÍÍ 
:
ÍÍ 
$str
ÍÍ '
)
ÍÍ' (
;
ÍÍ( )
migrationBuilder
ÏÏ 
.
ÏÏ 
CreateIndex
ÏÏ (
(
ÏÏ( )
name
ÌÌ 
:
ÌÌ 
$str
ÌÌ ,
,
ÌÌ, -
table
ÓÓ 
:
ÓÓ 
$str
ÓÓ %
,
ÓÓ% &
column
ÔÔ 
:
ÔÔ 
$str
ÔÔ 
,
ÔÔ 
unique
 
:
 
true
 
)
 
;
 
migrationBuilder
ÚÚ 
.
ÚÚ 
CreateIndex
ÚÚ (
(
ÚÚ( )
name
ÛÛ 
:
ÛÛ 
$str
ÛÛ :
,
ÛÛ: ;
table
ÙÙ 
:
ÙÙ 
$str
ÙÙ *
,
ÙÙ* +
column
ıı 
:
ıı 
$str
ıı '
)
ıı' (
;
ıı( )
migrationBuilder
˜˜ 
.
˜˜ 
CreateIndex
˜˜ (
(
˜˜( )
name
¯¯ 
:
¯¯ 
$str
¯¯ ;
,
¯¯; <
table
˘˘ 
:
˘˘ 
$str
˘˘ +
,
˘˘+ ,
column
˙˙ 
:
˙˙ 
$str
˙˙ '
)
˙˙' (
;
˙˙( )
migrationBuilder
¸¸ 
.
¸¸ 
CreateIndex
¸¸ (
(
¸¸( )
name
˝˝ 
:
˝˝ 
$str
˝˝ 1
,
˝˝1 2
table
˛˛ 
:
˛˛ 
$str
˛˛ '
,
˛˛' (
column
ˇˇ 
:
ˇˇ 
$str
ˇˇ !
)
ˇˇ! "
;
ˇˇ" #
migrationBuilder
ÅÅ 
.
ÅÅ 
CreateIndex
ÅÅ (
(
ÅÅ( )
name
ÇÇ 
:
ÇÇ 
$str
ÇÇ 5
,
ÇÇ5 6
table
ÉÉ 
:
ÉÉ 
$str
ÉÉ +
,
ÉÉ+ ,
column
ÑÑ 
:
ÑÑ 
$str
ÑÑ !
)
ÑÑ! "
;
ÑÑ" #
migrationBuilder
ÜÜ 
.
ÜÜ 
CreateIndex
ÜÜ (
(
ÜÜ( )
name
áá 
:
áá 
$str
áá )
,
áá) *
table
àà 
:
àà 
$str
àà "
,
àà" #
column
ââ 
:
ââ 
$str
ââ 
,
ââ 
unique
ää 
:
ää 
true
ää 
)
ää 
;
ää 
migrationBuilder
åå 
.
åå 
CreateIndex
åå (
(
åå( )
name
çç 
:
çç 
$str
çç 0
,
çç0 1
table
éé 
:
éé 
$str
éé %
,
éé% &
column
èè 
:
èè 
$str
èè "
)
èè" #
;
èè# $
migrationBuilder
ëë 
.
ëë 
CreateIndex
ëë (
(
ëë( )
name
íí 
:
íí 
$str
íí 5
,
íí5 6
table
ìì 
:
ìì 
$str
ìì *
,
ìì* +
column
îî 
:
îî 
$str
îî "
)
îî" #
;
îî# $
migrationBuilder
ññ 
.
ññ 
CreateIndex
ññ (
(
ññ( )
name
óó 
:
óó 
$str
óó 4
,
óó4 5
table
òò 
:
òò 
$str
òò )
,
òò) *
column
ôô 
:
ôô 
$str
ôô "
)
ôô" #
;
ôô# $
migrationBuilder
õõ 
.
õõ 
CreateIndex
õõ (
(
õõ( )
name
úú 
:
úú 
$str
úú 9
,
úú9 :
table
ùù 
:
ùù 
$str
ùù .
,
ùù. /
column
ûû 
:
ûû 
$str
ûû "
)
ûû" #
;
ûû# $
migrationBuilder
†† 
.
†† 
CreateIndex
†† (
(
††( )
name
°° 
:
°° 
$str
°° @
,
°°@ A
table
¢¢ 
:
¢¢ 
$str
¢¢ 5
,
¢¢5 6
column
££ 
:
££ 
$str
££ "
)
££" #
;
££# $
migrationBuilder
•• 
.
•• 
CreateIndex
•• (
(
••( )
name
¶¶ 
:
¶¶ 
$str
¶¶ 4
,
¶¶4 5
table
ßß 
:
ßß 
$str
ßß )
,
ßß) *
column
®® 
:
®® 
$str
®® "
)
®®" #
;
®®# $
migrationBuilder
™™ 
.
™™ 
CreateIndex
™™ (
(
™™( )
name
´´ 
:
´´ 
$str
´´ 6
,
´´6 7
table
¨¨ 
:
¨¨ 
$str
¨¨ +
,
¨¨+ ,
column
≠≠ 
:
≠≠ 
$str
≠≠ "
)
≠≠" #
;
≠≠# $
migrationBuilder
ØØ 
.
ØØ 
CreateIndex
ØØ (
(
ØØ( )
name
∞∞ 
:
∞∞ 
$str
∞∞ +
,
∞∞+ ,
table
±± 
:
±± 
$str
±±  
,
±±  !
column
≤≤ 
:
≤≤ 
$str
≤≤ "
,
≤≤" #
unique
≥≥ 
:
≥≥ 
true
≥≥ 
)
≥≥ 
;
≥≥ 
migrationBuilder
µµ 
.
µµ 
CreateIndex
µµ (
(
µµ( )
name
∂∂ 
:
∂∂ 
$str
∂∂ 0
,
∂∂0 1
table
∑∑ 
:
∑∑ 
$str
∑∑ %
,
∑∑% &
column
∏∏ 
:
∏∏ 
$str
∏∏ "
)
∏∏" #
;
∏∏# $
migrationBuilder
∫∫ 
.
∫∫ 
CreateIndex
∫∫ (
(
∫∫( )
name
ªª 
:
ªª 
$str
ªª 1
,
ªª1 2
table
ºº 
:
ºº 
$str
ºº &
,
ºº& '
column
ΩΩ 
:
ΩΩ 
$str
ΩΩ "
)
ΩΩ" #
;
ΩΩ# $
migrationBuilder
øø 
.
øø 
CreateIndex
øø (
(
øø( )
name
¿¿ 
:
¿¿ 
$str
¿¿ D
,
¿¿D E
table
¡¡ 
:
¡¡ 
$str
¡¡ /
,
¡¡/ 0
column
¬¬ 
:
¬¬ 
$str
¬¬ ,
)
¬¬, -
;
¬¬- .
migrationBuilder
ƒƒ 
.
ƒƒ 
CreateIndex
ƒƒ (
(
ƒƒ( )
name
≈≈ 
:
≈≈ 
$str
≈≈ H
,
≈≈H I
table
∆∆ 
:
∆∆ 
$str
∆∆ 3
,
∆∆3 4
column
«« 
:
«« 
$str
«« ,
)
««, -
;
««- .
migrationBuilder
…… 
.
…… 
CreateIndex
…… (
(
……( )
name
   
:
   
$str
   1
,
  1 2
table
ÀÀ 
:
ÀÀ 
$str
ÀÀ *
,
ÀÀ* +
column
ÃÃ 
:
ÃÃ 
$str
ÃÃ 
,
ÃÃ 
unique
ÕÕ 
:
ÕÕ 
true
ÕÕ 
)
ÕÕ 
;
ÕÕ 
}
ŒŒ 	
	protected
–– 
override
–– 
void
–– 
Down
––  $
(
––$ %
MigrationBuilder
––% 5
migrationBuilder
––6 F
)
––F G
{
—— 	
migrationBuilder
““ 
.
““ 
	DropTable
““ &
(
““& '
name
”” 
:
”” 
$str
”” )
)
””) *
;
””* +
migrationBuilder
’’ 
.
’’ 
	DropTable
’’ &
(
’’& '
name
÷÷ 
:
÷÷ 
$str
÷÷ -
)
÷÷- .
;
÷÷. /
migrationBuilder
ÿÿ 
.
ÿÿ 
	DropTable
ÿÿ &
(
ÿÿ& '
name
ŸŸ 
:
ŸŸ 
$str
ŸŸ )
)
ŸŸ) *
;
ŸŸ* +
migrationBuilder
€€ 
.
€€ 
	DropTable
€€ &
(
€€& '
name
‹‹ 
:
‹‹ 
$str
‹‹ *
)
‹‹* +
;
‹‹+ ,
migrationBuilder
ﬁﬁ 
.
ﬁﬁ 
	DropTable
ﬁﬁ &
(
ﬁﬁ& '
name
ﬂﬂ 
:
ﬂﬂ 
$str
ﬂﬂ &
)
ﬂﬂ& '
;
ﬂﬂ' (
migrationBuilder
·· 
.
·· 
	DropTable
·· &
(
··& '
name
‚‚ 
:
‚‚ 
$str
‚‚ *
)
‚‚* +
;
‚‚+ ,
migrationBuilder
‰‰ 
.
‰‰ 
	DropTable
‰‰ &
(
‰‰& '
name
ÂÂ 
:
ÂÂ 
$str
ÂÂ $
)
ÂÂ$ %
;
ÂÂ% &
migrationBuilder
ÁÁ 
.
ÁÁ 
	DropTable
ÁÁ &
(
ÁÁ& '
name
ËË 
:
ËË 
$str
ËË )
)
ËË) *
;
ËË* +
migrationBuilder
ÍÍ 
.
ÍÍ 
	DropTable
ÍÍ &
(
ÍÍ& '
name
ÎÎ 
:
ÎÎ 
$str
ÎÎ (
)
ÎÎ( )
;
ÎÎ) *
migrationBuilder
ÌÌ 
.
ÌÌ 
	DropTable
ÌÌ &
(
ÌÌ& '
name
ÓÓ 
:
ÓÓ 
$str
ÓÓ -
)
ÓÓ- .
;
ÓÓ. /
migrationBuilder
 
.
 
	DropTable
 &
(
& '
name
ÒÒ 
:
ÒÒ 
$str
ÒÒ 4
)
ÒÒ4 5
;
ÒÒ5 6
migrationBuilder
ÛÛ 
.
ÛÛ 
	DropTable
ÛÛ &
(
ÛÛ& '
name
ÙÙ 
:
ÙÙ 
$str
ÙÙ (
)
ÙÙ( )
;
ÙÙ) *
migrationBuilder
ˆˆ 
.
ˆˆ 
	DropTable
ˆˆ &
(
ˆˆ& '
name
˜˜ 
:
˜˜ 
$str
˜˜ *
)
˜˜* +
;
˜˜+ ,
migrationBuilder
˘˘ 
.
˘˘ 
	DropTable
˘˘ &
(
˘˘& '
name
˙˙ 
:
˙˙ 
$str
˙˙ $
)
˙˙$ %
;
˙˙% &
migrationBuilder
¸¸ 
.
¸¸ 
	DropTable
¸¸ &
(
¸¸& '
name
˝˝ 
:
˝˝ 
$str
˝˝ %
)
˝˝% &
;
˝˝& '
migrationBuilder
ˇˇ 
.
ˇˇ 
	DropTable
ˇˇ &
(
ˇˇ& '
name
ÄÄ 
:
ÄÄ 
$str
ÄÄ .
)
ÄÄ. /
;
ÄÄ/ 0
migrationBuilder
ÇÇ 
.
ÇÇ 
	DropTable
ÇÇ &
(
ÇÇ& '
name
ÉÉ 
:
ÉÉ 
$str
ÉÉ 2
)
ÉÉ2 3
;
ÉÉ3 4
migrationBuilder
ÖÖ 
.
ÖÖ 
	DropTable
ÖÖ &
(
ÖÖ& '
name
ÜÜ 
:
ÜÜ 
$str
ÜÜ $
)
ÜÜ$ %
;
ÜÜ% &
migrationBuilder
àà 
.
àà 
	DropTable
àà &
(
àà& '
name
ââ 
:
ââ 
$str
ââ !
)
ââ! "
;
ââ" #
migrationBuilder
ãã 
.
ãã 
	DropTable
ãã &
(
ãã& '
name
åå 
:
åå 
$str
åå 
)
åå  
;
åå  !
migrationBuilder
éé 
.
éé 
	DropTable
éé &
(
éé& '
name
èè 
:
èè 
$str
èè )
)
èè) *
;
èè* +
}
êê 	
}
ëë 
}íí ßN
êD:\Development\FJT\FJT-DEV\FJT.IdentityServer\Data\Migrations\IdentityServer\PersistedGrantDb\20210715060145_InitialPersistedGrantDbMigration.cs
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
}UU ÅE
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
ÄÄ *
=
ÄÄ+ ,
{
ÄÄ- .
$str
ÄÄ/ Q
}
ÄÄR S
,
ÄÄS T 
AllowedCorsOrigins
ÅÅ &
=
ÅÅ' (
{
ÅÅ- .
$str
ÅÅ/ F
}
ÅÅG H
,
ÅÅH I#
FrontChannelLogoutUri
ÇÇ )
=
ÇÇ* +
$str
ÇÇ, V
,
ÇÇV W
AllowedScopes
ÑÑ !
=
ÑÑ" #
{
ÖÖ %
IdentityServerConstants
ÜÜ /
.
ÜÜ/ 0
StandardScopes
ÜÜ0 >
.
ÜÜ> ?
OpenId
ÜÜ? E
,
ÜÜE F%
IdentityServerConstants
áá /
.
áá/ 0
StandardScopes
áá0 >
.
áá> ?
Profile
áá? F
,
ááF G
$str
àà !
}
ââ 
}
ää 
}
ãã 
;
ãã 
}
åå 	
}
çç 
}éé ”R
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
$str	::9 ®
,
::® ©
IdentityServer4
::™ π
.
::π ∫%
IdentityServerConstants
::∫ —
.
::— “
ClaimValueTypes
::“ ·
.
::· ‚
Json
::‚ Ê
)
::Ê Á
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
$str	]]9 ®
,
]]® ©
IdentityServer4
]]™ π
.
]]π ∫%
IdentityServerConstants
]]∫ —
.
]]— “
ClaimValueTypes
]]“ ·
.
]]· ‚
Json
]]‚ Ê
)
]]Ê Á
,
]]Á Ë
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
}nn »
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
} ±
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
} Ê
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
} õ
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
} ¸
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
} í
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
;	 Ä
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
}## å<
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
$str	::< ∞
;
::∞ ±
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
$str	TT8 Ç
;
TTÇ É
}UU 
}VV ˙%
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
Materialize	{ Ü
<
Ü á
T
á à
>
à â
)
â ä
;
ä ã
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
}// ¸6
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
}PP æ#
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
}<< ã 
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
}>> ≥
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
}   ûQ
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
value	88} Ç
)
88Ç É
;
88É Ñ
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
}hh “
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
}88 ∆&
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
}CC  $
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
}@@ Ú

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
} ‚
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
} õ	
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
} ˆ
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
} ∫

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
} ä
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
} ‹
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
} ´
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
} €
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
} †	
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
} ¨
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
} ¸
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
} º
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
} ö"
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
}<< œ 
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
}99 ¡
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
} “#
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
}44 €
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
}55 ‰
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
}++ ä
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
} Å
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
} ö
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
} ö
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
})) ç
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
}-- é
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
}"" —
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
} Ã
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
} ‘
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
} Æ
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
} „
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
} ä	
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
} †
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
} ¡
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
} π
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
PASSWORD_VALIDATION_INPUT_MSG	~ õ
)
õ ú
]
ú ù
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
} ã
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
} ˘
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
} ›
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
}(( Ï
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
}// µ
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
} ©.
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
$str	QQ= ü
,
QQü †
theme
QQ° ¶
:
QQ¶ ß
AnsiConsoleTheme
QQ® ∏
.
QQ∏ π
Literate
QQπ ¡
)
QQ¡ ¬
;
QQ¬ √
}RR 
)RR 
;RR 
}SS 	
}TT 
}UU É˜
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
context	}}} Ñ
.
}}Ñ Ö
RedirectUri
}}Ö ê
+
}}ë í
$str
}}ì ñ
)
}}ñ ó
;
}}ó ò
return~~ 
Redirect~~ 
(~~  
redirectUri~~  +
)~~+ ,
;~~, -
} 
var
ÅÅ 
vm
ÅÅ 
=
ÅÅ 
await
ÅÅ &
BuildLoginViewModelAsync
ÅÅ 3
(
ÅÅ3 4
	returnUrl
ÅÅ4 =
)
ÅÅ= >
;
ÅÅ> ?
if
ÉÉ 
(
ÉÉ 
vm
ÉÉ 
.
ÉÉ !
IsExternalLoginOnly
ÉÉ &
)
ÉÉ& '
{
ÑÑ 
return
ÜÜ 
RedirectToAction
ÜÜ '
(
ÜÜ' (
$str
ÜÜ( 3
,
ÜÜ3 4
$str
ÜÜ5 ?
,
ÜÜ? @
new
ÜÜA D
{
ÜÜE F
provider
ÜÜG O
=
ÜÜP Q
vm
ÜÜR T
.
ÜÜT U!
ExternalLoginScheme
ÜÜU h
,
ÜÜh i
	returnUrl
ÜÜj s
}
ÜÜt u
)
ÜÜu v
;
ÜÜv w
}
áá 
return
ââ 
View
ââ 
(
ââ 
vm
ââ 
)
ââ 
;
ââ 
}
ää 	
[
èè 	
HttpPost
èè	 
]
èè 
public
ëë 
async
ëë 
Task
ëë 
<
ëë 
IActionResult
ëë '
>
ëë' (
Login
ëë) .
(
ëë. /
LoginInputModel
ëë/ >
model
ëë? D
)
ëëD E
{
íí 	
var
ïï 
context
ïï 
=
ïï 
await
ïï 
_interaction
ïï  ,
.
ïï, -*
GetAuthorizationContextAsync
ïï- I
(
ïïI J
model
ïïJ O
.
ïïO P
	ReturnUrl
ïïP Y
)
ïïY Z
;
ïïZ [
if
≥≥ 
(
≥≥ 

ModelState
≥≥ 
.
≥≥ 
IsValid
≥≥ "
)
≥≥" #
{
¥¥ 
var
µµ 
user
µµ 
=
µµ 
await
µµ  
_userManager
µµ! -
.
µµ- .
FindByNameAsync
µµ. =
(
µµ= >
model
µµ> C
.
µµC D
Username
µµD L
)
µµL M
;
µµM N
var
∂∂ 
result
∂∂ 
=
∂∂ 
await
∂∂ "
_signInManager
∂∂# 1
.
∂∂1 2
UserManager
∂∂2 =
.
∂∂= > 
CheckPasswordAsync
∂∂> P
(
∂∂P Q
user
∂∂Q U
,
∂∂U V
model
∂∂W \
.
∂∂\ ]
Password
∂∂] e
)
∂∂e f
;
∂∂f g
if
∑∑ 
(
∑∑ 
result
∑∑ 
&&
∑∑ 
user
∑∑ "
.
∑∑" #
	isDeleted
∑∑# ,
==
∑∑- /
false
∑∑0 5
)
∑∑5 6
{
∏∏ 
if
ππ 
(
ππ 
context
ππ 
!=
ππ  "
null
ππ# '
)
ππ' (
{
∫∫ 
if
ªª 
(
ªª 
await
ªª !
_clientStore
ªª" .
.
ªª. /
IsPkceClientAsync
ªª/ @
(
ªª@ A
context
ªªA H
.
ªªH I
Client
ªªI O
.
ªªO P
ClientId
ªªP X
)
ªªX Y
)
ªªY Z
{
ºº 
var
¿¿ 
clientUSerMapping
¿¿  1
=
¿¿2 3
await
¿¿4 9
_fjtDBContext
¿¿: G
.
¿¿G H 
ClientUsersMapping
¿¿H Z
.
¿¿Z [!
FirstOrDefaultAsync
¿¿[ n
(
¿¿n o
x
¿¿o p
=>
¿¿q s
x
¿¿t u
.
¿¿u v
UserId
¿¿v |
==
¿¿} 
user¿¿Ä Ñ
.¿¿Ñ Ö
Id¿¿Ö á
&&¿¿à ä
x¿¿ã å
.¿¿å ç
ClientId¿¿ç ï
==¿¿ñ ò
context¿¿ô †
.¿¿† °
Client¿¿° ß
.¿¿ß ®
ClientId¿¿® ∞
&&¿¿± ≥
x¿¿¥ µ
.¿¿µ ∂
	isDeleted¿¿∂ ø
==¿¿¿ ¬
false¿¿√ »
)¿¿» …
;¿¿…  
if
¡¡ 
(
¡¡  
clientUSerMapping
¡¡  1
==
¡¡2 4
null
¡¡5 9
)
¡¡9 :
{
¬¬ 
var
√√  #
accessDeniedMSG
√√$ 3
=
√√4 5
await
√√6 ;$
_dynamicMessageService
√√< R
.
√√R S
Get
√√S V
(
√√V W!
POPUP_ACCESS_DENIED
√√W j
)
√√j k
;
√√k l
await
ƒƒ  %
_events
ƒƒ& -
.
ƒƒ- .

RaiseAsync
ƒƒ. 8
(
ƒƒ8 9
new
ƒƒ9 <#
UserLoginFailureEvent
ƒƒ= R
(
ƒƒR S
model
ƒƒS X
.
ƒƒX Y
Username
ƒƒY a
,
ƒƒa b
string
ƒƒc i
.
ƒƒi j
Format
ƒƒj p
(
ƒƒp q
accessDeniedMSGƒƒq Ä
.ƒƒÄ Å
messageƒƒÅ à
,ƒƒà â
	REQUESTEDƒƒä ì
)ƒƒì î
)ƒƒî ï
)ƒƒï ñ
;ƒƒñ ó
var
««  #
loginVM
««$ +
=
««, -
await
««. 3&
BuildLoginViewModelAsync
««4 L
(
««L M
model
««M R
)
««R S
;
««S T
var
»»  #
dynamicMessages
»»$ 3
=
»»4 5
new
»»6 9
DynamicMessage
»»: H
(
»»H I
)
»»I J
{
»»K L
messageType
»»M X
=
»»Y Z
	ERROR_MSG
»»[ d
,
»»d e
message
»»f m
=
»»n o
AccountOptions
»»p ~
.
»»~ ,
ClientUserMappingErrorMessage»» ú
}»»ù û
;»»û ü
ViewBag
……  '
.
……' (
dynamicMessage
……( 6
=
……7 8
dynamicMessages
……9 H
;
……H I
return
    &
View
  ' +
(
  + ,
loginVM
  , 3
)
  3 4
;
  4 5
}
ÀÀ 
int
ÕÕ '
lastUserSignedAgreementId
ÕÕ  9
=
ÕÕ: ;
await
ÕÕ< A
_fjtDBContext
ÕÕB O
.
ÕÕO P
UserAgreement
ÕÕP ]
.
ÕÕ] ^
Where
ÕÕ^ c
(
ÕÕc d
x
ÕÕd e
=>
ÕÕf h
x
ÕÕi j
.
ÕÕj k
userID
ÕÕk q
==
ÕÕr t 
clientUSerMappingÕÕu Ü
.ÕÕÜ á
UserIdÕÕá ç
&&ÕÕé ê
xÕÕë í
.ÕÕí ì
	isDeletedÕÕì ú
==ÕÕù ü
falseÕÕ† •
)ÕÕ• ¶
.ÕÕ¶ ß!
OrderByDescendingÕÕß ∏
(ÕÕ∏ π
xÕÕπ ∫
=>ÕÕª Ω
xÕÕæ ø
.ÕÕø ¿
userAgreementIDÕÕ¿ œ
)ÕÕœ –
.ÕÕ– —
SelectÕÕ— ◊
(ÕÕ◊ ÿ
xÕÕÿ Ÿ
=>ÕÕ⁄ ‹
xÕÕ› ﬁ
.ÕÕﬁ ﬂ
agreementIDÕÕﬂ Í
)ÕÕÍ Î
.ÕÕÎ Ï#
FirstOrDefaultAsyncÕÕÏ ˇ
(ÕÕˇ Ä
)ÕÕÄ Å
;ÕÕÅ Ç
var
ŒŒ 
agreemenTypeId
ŒŒ  .
=
ŒŒ/ 0
await
ŒŒ1 6
_fjtDBContext
ŒŒ7 D
.
ŒŒD E
AgreementType
ŒŒE R
.
ŒŒR S
Where
ŒŒS X
(
ŒŒX Y
x
ŒŒY Z
=>
ŒŒ[ ]
x
ŒŒ^ _
.
ŒŒ_ `
agreementType
ŒŒ` m
==
ŒŒn p.
USER_SIGNUP_AGREEMENT_TYPE_NAMEŒŒq ê
&&ŒŒë ì
xŒŒî ï
.ŒŒï ñ
	isDeletedŒŒñ ü
==ŒŒ† ¢
falseŒŒ£ ®
)ŒŒ® ©
.ŒŒ© ™
SelectŒŒ™ ∞
(ŒŒ∞ ±
xŒŒ± ≤
=>ŒŒ≥ µ
xŒŒ∂ ∑
.ŒŒ∑ ∏
agreementTypeIDŒŒ∏ «
)ŒŒ« »
.ŒŒ» …#
FirstOrDefaultAsyncŒŒ… ‹
(ŒŒ‹ ›
)ŒŒ› ﬁ
;ŒŒﬁ ﬂ
int
œœ (
letestPublishedAgreementId
œœ  :
=
œœ; <
await
œœ= B+
GetLetestPublishedAgreementId
œœC `
(
œœ` a
agreemenTypeId
œœa o
)
œœo p
;
œœp q
if
–– 
(
––  '
lastUserSignedAgreementId
––  9
!=
––: <
$num
––= >
&&
––? A
(
––B C'
lastUserSignedAgreementId
––C \
==
––] _(
letestPublishedAgreementId
––` z
)
––z {
)
––{ |
{
—— 
var
““  #

userSignIn
““$ .
=
““/ 0
await
““1 6
_signInManager
““7 E
.
““E F!
PasswordSignInAsync
““F Y
(
““Y Z
model
““Z _
.
““_ `
Username
““` h
,
““h i
model
““j o
.
““o p
Password
““p x
,
““x y
model
““z 
.““ Ä
RememberLogin““Ä ç
,““ç é 
lockoutOnFailure““è ü
:““ü †
true““° •
)““• ¶
;““¶ ß
await
””  %
_events
””& -
.
””- .

RaiseAsync
””. 8
(
””8 9
new
””9 <#
UserLoginSuccessEvent
””= R
(
””R S
user
””S W
.
””W X
UserName
””X `
,
””` a
user
””b f
.
””f g
Id
””g i
,
””i j
user
””k o
.
””o p
UserName
””p x
)
””x y
)
””y z
;
””z {
return
‘‘  &
View
‘‘' +
(
‘‘+ ,
$str
‘‘, 6
,
‘‘6 7
new
‘‘8 ;
RedirectViewModel
‘‘< M
{
‘‘N O
RedirectUrl
‘‘P [
=
‘‘\ ]
model
‘‘^ c
.
‘‘c d
	ReturnUrl
‘‘d m
}
‘‘n o
)
‘‘o p
;
‘‘p q
}
’’ 
else
÷÷  
{
◊◊ 
if
ÿÿ  "
(
ÿÿ# $
model
ÿÿ$ )
.
ÿÿ) *
AcceptAgreement
ÿÿ* 9
==
ÿÿ: <
true
ÿÿ= A
)
ÿÿA B
{
ŸŸ  !
try
⁄⁄$ '
{
€€$ %
UserAgreement
‹‹( 5
userAgreement
‹‹6 C
=
‹‹D E
new
‹‹F I
UserAgreement
‹‹J W
(
‹‹W X
)
‹‹X Y
{
››( )
userID
ﬁﬁ, 2
=
ﬁﬁ3 4
user
ﬁﬁ5 9
.
ﬁﬁ9 :
Id
ﬁﬁ: <
,
ﬁﬁ< =
agreementID
ﬂﬂ, 7
=
ﬂﬂ8 9(
letestPublishedAgreementId
ﬂﬂ: T
,
ﬂﬂT U

agreedDate
‡‡, 6
=
‡‡7 8
DateTime
‡‡9 A
.
‡‡A B
UtcNow
‡‡B H
,
‡‡H I
	isDeleted
··, 5
=
··6 7
false
··8 =
,
··= >
	createdBy
‚‚, 5
=
‚‚6 7
user
‚‚8 <
.
‚‚< =
UserName
‚‚= E
,
‚‚E F
	updatedBy
„„, 5
=
„„6 7
user
„„8 <
.
„„< =
UserName
„„= E
,
„„E F
	createdAt
‰‰, 5
=
‰‰6 7
DateTime
‰‰8 @
.
‰‰@ A
UtcNow
‰‰A G
,
‰‰G H
	updatedAt
ÂÂ, 5
=
ÂÂ6 7
DateTime
ÂÂ8 @
.
ÂÂ@ A
UtcNow
ÂÂA G
,
ÂÂG H
signaturevalue
ÊÊ, :
=
ÊÊ; <
model
ÊÊ= B
.
ÊÊB C
FinalSignature
ÊÊC Q
}
ÁÁ( )
;
ÁÁ) *
_fjtDBContext
ËË( 5
.
ËË5 6
UserAgreement
ËË6 C
.
ËËC D
Add
ËËD G
(
ËËG H
userAgreement
ËËH U
)
ËËU V
;
ËËV W
await
ÈÈ( -
_fjtDBContext
ÈÈ. ;
.
ÈÈ; <
CustomSaveChanges
ÈÈ< M
(
ÈÈM N
)
ÈÈN O
;
ÈÈO P
var
ÎÎ( +

userSignIn
ÎÎ, 6
=
ÎÎ7 8
await
ÎÎ9 >
_signInManager
ÎÎ? M
.
ÎÎM N!
PasswordSignInAsync
ÎÎN a
(
ÎÎa b
model
ÎÎb g
.
ÎÎg h
Username
ÎÎh p
,
ÎÎp q
model
ÎÎr w
.
ÎÎw x
PasswordÎÎx Ä
,ÎÎÄ Å
modelÎÎÇ á
.ÎÎá à
RememberLoginÎÎà ï
,ÎÎï ñ 
lockoutOnFailureÎÎó ß
:ÎÎß ®
trueÎÎ© ≠
)ÎÎ≠ Æ
;ÎÎÆ Ø
await
ÏÏ( -
_events
ÏÏ. 5
.
ÏÏ5 6

RaiseAsync
ÏÏ6 @
(
ÏÏ@ A
new
ÏÏA D#
UserLoginSuccessEvent
ÏÏE Z
(
ÏÏZ [
user
ÏÏ[ _
.
ÏÏ_ `
UserName
ÏÏ` h
,
ÏÏh i
user
ÏÏj n
.
ÏÏn o
Id
ÏÏo q
,
ÏÏq r
user
ÏÏs w
.
ÏÏw x
UserNameÏÏx Ä
)ÏÏÄ Å
)ÏÏÅ Ç
;ÏÏÇ É
return
ÌÌ( .
View
ÌÌ/ 3
(
ÌÌ3 4
$str
ÌÌ4 >
,
ÌÌ> ?
new
ÌÌ@ C
RedirectViewModel
ÌÌD U
{
ÌÌV W
RedirectUrl
ÌÌX c
=
ÌÌd e
model
ÌÌf k
.
ÌÌk l
	ReturnUrl
ÌÌl u
}
ÌÌv w
)
ÌÌw x
;
ÌÌx y
}
ÓÓ$ %
catch
ÔÔ$ )
(
ÔÔ* +
	Exception
ÔÔ+ 4
e
ÔÔ5 6
)
ÔÔ6 7
{
$ %
_logger
ÒÒ( /
.
ÒÒ/ 0
LogError
ÒÒ0 8
(
ÒÒ8 9
e
ÒÒ9 :
.
ÒÒ: ;
ToString
ÒÒ; C
(
ÒÒC D
)
ÒÒD E
)
ÒÒE F
;
ÒÒF G
return
ÛÛ( .
View
ÛÛ/ 3
(
ÛÛ3 4
$str
ÛÛ4 ;
,
ÛÛ; <
new
ÛÛ= @
ErrorViewModel
ÛÛA O
(
ÛÛO P
)
ÛÛP Q
{
ÛÛR S
Error
ÛÛT Y
=
ÛÛZ [
new
ÛÛ\ _
ErrorMessage
ÛÛ` l
(
ÛÛl m
)
ÛÛm n
{
ÛÛo p
Error
ÛÛq v
=
ÛÛw x
e
ÛÛy z
.
ÛÛz {
MessageÛÛ{ Ç
}ÛÛÉ Ñ
}ÛÛÖ Ü
)ÛÛÜ á
;ÛÛá à
}
ÙÙ$ %
}
ıı  !
var
¯¯  #
dynamicMessages
¯¯$ 3
=
¯¯4 5
await
¯¯6 ;$
_dynamicMessageService
¯¯< R
.
¯¯R S
Get
¯¯S V
(
¯¯V W"
LOGIN_AGRREMENT_SIGN
¯¯W k
)
¯¯k l
;
¯¯l m
ViewBag
˘˘  '
.
˘˘' (
dynamicMessage
˘˘( 6
=
˘˘7 8
dynamicMessages
˘˘9 H
;
˘˘H I
ViewBag
˙˙  '
.
˙˙' (
deleteConfirmMSG
˙˙( 8
=
˙˙9 :
await
˙˙; @$
_dynamicMessageService
˙˙A W
.
˙˙W X
Get
˙˙X [
(
˙˙[ \$
DELETE_CONFIRM_MESSAGE
˙˙\ r
)
˙˙r s
;
˙˙s t
ViewBag
˚˚  '
.
˚˚' (!
provideSignatureMSG
˚˚( ;
=
˚˚< =
await
˚˚> C$
_dynamicMessageService
˚˚D Z
.
˚˚Z [
Get
˚˚[ ^
(
˚˚^ _
PROVIDE_SIGNATURE
˚˚_ p
)
˚˚p q
;
˚˚q r
ViewBag
¸¸  '
.
¸¸' (&
leavePageConfirmationMSG
¸¸( @
=
¸¸A B
await
¸¸C H$
_dynamicMessageService
¸¸I _
.
¸¸_ `
Get
¸¸` c
(
¸¸c d0
!WITHOUT_SAVING_ALERT_BODY_MESSAGE¸¸d Ö
)¸¸Ö Ü
;¸¸Ü á
await
˝˝  %
_events
˝˝& -
.
˝˝- .

RaiseAsync
˝˝. 8
(
˝˝8 9
new
˝˝9 <#
UserLoginFailureEvent
˝˝= R
(
˝˝R S
model
˝˝S X
.
˝˝X Y
Username
˝˝Y a
,
˝˝a b
dynamicMessages
˝˝c r
.
˝˝r s
message
˝˝s z
)
˝˝z {
)
˝˝{ |
;
˝˝| }
model
˛˛  %
.
˛˛% &&
ShowAcceptAgreementPopUp
˛˛& >
=
˛˛? @
true
˛˛A E
;
˛˛E F
if
ÄÄ  "
(
ÄÄ# $
_version
ÄÄ$ ,
==
ÄÄ- /
null
ÄÄ0 4
)
ÄÄ4 5
{
ÅÅ  !
	Agreement
ÇÇ$ -
	agreement
ÇÇ. 7
=
ÇÇ8 9
await
ÇÇ: ?+
RetrivePublishedAgreementById
ÇÇ@ ]
(
ÇÇ] ^(
letestPublishedAgreementId
ÇÇ^ x
)
ÇÇx y
;
ÇÇy z
if
ÉÉ$ &
(
ÉÉ' (
	agreement
ÉÉ( 1
!=
ÉÉ2 4
null
ÉÉ5 9
)
ÉÉ9 :
{
ÑÑ$ %
_version
ÖÖ( 0
=
ÖÖ1 2
	agreement
ÖÖ3 <
.
ÖÖ< =
version
ÖÖ= D
;
ÖÖD E
_agreementContent
ÜÜ( 9
=
ÜÜ: ;
	agreement
ÜÜ< E
.
ÜÜE F
agreementContent
ÜÜF V
;
ÜÜV W

_effective
áá( 2
=
áá3 4
	agreement
áá5 >
.
áá> ?
publishedDate
áá? L
;
ááL M
}
àà$ %
}
ââ  !
var
ãã  #
loginVM
ãã$ +
=
ãã, -
await
ãã. 3&
BuildLoginViewModelAsync
ãã4 L
(
ããL M
model
ããM R
)
ããR S
;
ããS T
return
åå  &
View
åå' +
(
åå+ ,
loginVM
åå, 3
)
åå3 4
;
åå4 5
}
çç 
}
éé 
return
êê 
Redirect
êê '
(
êê' (
model
êê( -
.
êê- .
	ReturnUrl
êê. 7
)
êê7 8
;
êê8 9
}
ëë 
if
îî 
(
îî 
Url
îî 
.
îî 

IsLocalUrl
îî &
(
îî& '
model
îî' ,
.
îî, -
	ReturnUrl
îî- 6
)
îî6 7
)
îî7 8
{
ïï 
return
ññ 
Redirect
ññ '
(
ññ' (
model
ññ( -
.
ññ- .
	ReturnUrl
ññ. 7
)
ññ7 8
;
ññ8 9
}
óó 
else
òò 
if
òò 
(
òò 
string
òò #
.
òò# $
IsNullOrEmpty
òò$ 1
(
òò1 2
model
òò2 7
.
òò7 8
	ReturnUrl
òò8 A
)
òòA B
)
òòB C
{
ôô 
return
öö 
Redirect
öö '
(
öö' (
$str
öö( ,
)
öö, -
;
öö- .
}
õõ 
else
úú 
{
ùù 
throw
üü 
new
üü !
	Exception
üü" +
(
üü+ , 
INVALID_RETURN_URL
üü, >
)
üü> ?
;
üü? @
}
†† 
}
°° 
else
¢¢ 
{
££ 
var
•• 
userTemp
••  
=
••! "
await
••# (
_userManager
••) 5
.
••5 6
FindByNameAsync
••6 E
(
••E F
model
••F K
.
••K L
Username
••L T
)
••T U
;
••U V
if
¶¶ 
(
¶¶ 
userTemp
¶¶  
!=
¶¶! #
null
¶¶$ (
&&
¶¶) +
!
¶¶, -
userTemp
¶¶- 5
.
¶¶5 6!
passwordHashUpdated
¶¶6 I
)
¶¶I J
{
ßß 
bool
©© "
verifyPasswordDigest
©© 1
=
©©2 3
BCrypt
©©4 :
.
©©: ;
Net
©©; >
.
©©> ?
BCrypt
©©? E
.
©©E F
Verify
©©F L
(
©©L M
model
©©M R
.
©©R S
Password
©©S [
,
©©[ \
userTemp
©©] e
.
©©e f 
userPasswordDigest
©©f x
)
©©x y
;
©©y z
if
™™ 
(
™™ "
verifyPasswordDigest
™™ 0
)
™™0 1
{
´´ 
var
≠≠ 
token
≠≠  %
=
≠≠& '
await
≠≠( -
_userManager
≠≠. :
.
≠≠: ;-
GeneratePasswordResetTokenAsync
≠≠; Z
(
≠≠Z [
userTemp
≠≠[ c
)
≠≠c d
;
≠≠d e
var
ÆÆ 

resultTest
ÆÆ  *
=
ÆÆ+ ,
await
ÆÆ- 2
_userManager
ÆÆ3 ?
.
ÆÆ? @ 
ResetPasswordAsync
ÆÆ@ R
(
ÆÆR S
userTemp
ÆÆS [
,
ÆÆ[ \
token
ÆÆ] b
,
ÆÆb c
model
ÆÆd i
.
ÆÆi j
Password
ÆÆj r
)
ÆÆr s
;
ÆÆs t
if
ØØ 
(
ØØ  

resultTest
ØØ  *
.
ØØ* +
	Succeeded
ØØ+ 4
)
ØØ4 5
{
∞∞ 
userTemp
±±  (
.
±±( )!
passwordHashUpdated
±±) <
=
±±= >
true
±±? C
;
±±C D
await
≤≤  %
_userManager
≤≤& 2
.
≤≤2 3
UpdateAsync
≤≤3 >
(
≤≤> ?
userTemp
≤≤? G
)
≤≤G H
;
≤≤H I
await
¥¥  %
Login
¥¥& +
(
¥¥+ ,
model
¥¥, 1
)
¥¥1 2
;
¥¥2 3
return
∂∂  &
View
∂∂' +
(
∂∂+ ,
$str
∂∂, 6
,
∂∂6 7
new
∂∂8 ;
RedirectViewModel
∂∂< M
{
∂∂N O
RedirectUrl
∂∂P [
=
∂∂\ ]
model
∂∂^ c
.
∂∂c d
	ReturnUrl
∂∂d m
}
∂∂n o
)
∂∂o p
;
∂∂p q
}
∑∑ 
}
∏∏ 
}
ππ 
}
∫∫ 
ViewBag
ªª 
.
ªª 
dynamicMessage
ªª &
=
ªª' (
await
ªª) .$
_dynamicMessageService
ªª/ E
.
ªªE F
Get
ªªF I
(
ªªI J.
 USER_USERNAME_PASSWORD_INCORRECT
ªªJ j
)
ªªj k
;
ªªk l
await
ºº 
_events
ºº 
.
ºº 

RaiseAsync
ºº (
(
ºº( )
new
ºº) ,#
UserLoginFailureEvent
ºº- B
(
ººB C
model
ººC H
.
ººH I
Username
ººI Q
,
ººQ R
AccountOptions
ººS a
.
ººa b-
InvalidCredentialsErrorMessageººb Ä
)ººÄ Å
)ººÅ Ç
;ººÇ É
}
¿¿ 
var
¡¡ 
vm
¡¡ 
=
¡¡ 
await
¡¡ &
BuildLoginViewModelAsync
¡¡ 3
(
¡¡3 4
model
¡¡4 9
)
¡¡9 :
;
¡¡: ;
return
¬¬ 
View
¬¬ 
(
¬¬ 
vm
¬¬ 
)
¬¬ 
;
¬¬ 
}
√√ 	
[
»» 	
HttpGet
»»	 
]
»» 
public
…… 
async
…… 
Task
…… 
<
…… 
IActionResult
…… '
>
……' (
Logout
……) /
(
……/ 0
string
……0 6
logoutId
……7 ?
)
……? @
{
   	
var
ÃÃ 
vm
ÃÃ 
=
ÃÃ 
await
ÃÃ '
BuildLogoutViewModelAsync
ÃÃ 4
(
ÃÃ4 5
logoutId
ÃÃ5 =
)
ÃÃ= >
;
ÃÃ> ?
return
ÕÕ 
await
ÕÕ 
Logout
ÕÕ 
(
ÕÕ  
vm
ÕÕ  "
)
ÕÕ" #
;
ÕÕ# $
}
ŒŒ 	
[
”” 	
HttpPost
””	 
]
”” 
[
‘‘ 	&
ValidateAntiForgeryToken
‘‘	 !
]
‘‘! "
public
’’ 
async
’’ 
Task
’’ 
<
’’ 
IActionResult
’’ '
>
’’' (
Logout
’’) /
(
’’/ 0
LogoutInputModel
’’0 @
model
’’A F
)
’’F G
{
÷÷ 	
var
ÿÿ 
vm
ÿÿ 
=
ÿÿ 
await
ÿÿ *
BuildLoggedOutViewModelAsync
ÿÿ 7
(
ÿÿ7 8
model
ÿÿ8 =
.
ÿÿ= >
LogoutId
ÿÿ> F
)
ÿÿF G
;
ÿÿG H
if
⁄⁄ 
(
⁄⁄ 
User
⁄⁄ 
?
⁄⁄ 
.
⁄⁄ 
Identity
⁄⁄ 
.
⁄⁄ 
IsAuthenticated
⁄⁄ .
==
⁄⁄/ 1
true
⁄⁄2 6
)
⁄⁄6 7
{
€€ 
await
›› 
HttpContext
›› !
.
››! "
SignOutAsync
››" .
(
››. /%
IdentityServerConstants
››/ F
.
››F G/
!DefaultCookieAuthenticationScheme
››G h
)
››h i
;
››i j
await
‡‡ 
_signInManager
‡‡ $
.
‡‡$ %
SignOutAsync
‡‡% 1
(
‡‡1 2
)
‡‡2 3
;
‡‡3 4
await
„„ 
_events
„„ 
.
„„ 

RaiseAsync
„„ (
(
„„( )
new
„„) ,$
UserLogoutSuccessEvent
„„- C
(
„„C D
User
„„D H
.
„„H I
GetSubjectId
„„I U
(
„„U V
)
„„V W
,
„„W X
User
„„Y ]
.
„„] ^
GetDisplayName
„„^ l
(
„„l m
)
„„m n
)
„„n o
)
„„o p
;
„„p q
}
‰‰ 
if
ÁÁ 
(
ÁÁ 
vm
ÁÁ 
.
ÁÁ $
TriggerExternalSignout
ÁÁ )
)
ÁÁ) *
{
ËË 
string
ÏÏ 
url
ÏÏ 
=
ÏÏ 
Url
ÏÏ  
.
ÏÏ  !
Action
ÏÏ! '
(
ÏÏ' (
$str
ÏÏ( 0
,
ÏÏ0 1
new
ÏÏ2 5
{
ÏÏ6 7
logoutId
ÏÏ8 @
=
ÏÏA B
vm
ÏÏC E
.
ÏÏE F
LogoutId
ÏÏF N
}
ÏÏO P
)
ÏÏP Q
;
ÏÏQ R
return
ÔÔ 
SignOut
ÔÔ 
(
ÔÔ 
new
ÔÔ "&
AuthenticationProperties
ÔÔ# ;
{
ÔÔ< =
RedirectUri
ÔÔ> I
=
ÔÔJ K
url
ÔÔL O
}
ÔÔP Q
,
ÔÔQ R
vm
ÔÔS U
.
ÔÔU V*
ExternalAuthenticationScheme
ÔÔV r
)
ÔÔr s
;
ÔÔs t
}
 
if
ÚÚ 
(
ÚÚ 
!
ÚÚ 
string
ÚÚ 
.
ÚÚ 
IsNullOrEmpty
ÚÚ %
(
ÚÚ% &
vm
ÚÚ& (
.
ÚÚ( )#
PostLogoutRedirectUri
ÚÚ) >
)
ÚÚ> ?
)
ÚÚ? @
{
ÛÛ 
ViewBag
ÙÙ 
.
ÙÙ 
	returnURL
ÙÙ !
=
ÙÙ" #
vm
ÙÙ$ &
.
ÙÙ& '#
PostLogoutRedirectUri
ÙÙ' <
;
ÙÙ< =
}
ıı 
else
ˆˆ 
{
˜˜ 
var
¯¯ 
referer
¯¯ 
=
¯¯ 
Request
¯¯ %
.
¯¯% &
Headers
¯¯& -
[
¯¯- .
$str
¯¯. 7
]
¯¯7 8
;
¯¯8 9
if
˘˘ 
(
˘˘ 
!
˘˘ 
string
˘˘ 
.
˘˘ 
IsNullOrEmpty
˘˘ )
(
˘˘) *
referer
˘˘* 1
)
˘˘1 2
)
˘˘2 3
{
˙˙ 
var
˚˚ 
refererString
˚˚ %
=
˚˚& '
referer
˚˚( /
.
˚˚/ 0
ToString
˚˚0 8
(
˚˚8 9
)
˚˚9 :
;
˚˚: ;
PropertyInfo
¸¸  
[
¸¸  !
]
¸¸! "
propertyInfos
¸¸# 0
=
¸¸1 2
	_pageURLs
¸¸3 <
.
¸¸< =
GetType
¸¸= D
(
¸¸D E
)
¸¸E F
.
¸¸F G
GetProperties
¸¸G T
(
¸¸T U
)
¸¸U V
;
¸¸V W
ViewBag
˝˝ 
.
˝˝ 
	returnURL
˝˝ %
=
˝˝& '
propertyInfos
˝˝( 5
.
˝˝5 6
Where
˝˝6 ;
(
˝˝; <
x
˝˝< =
=>
˝˝> @
refererString
˝˝A N
.
˝˝N O
Contains
˝˝O W
(
˝˝W X
x
˝˝X Y
.
˝˝Y Z
GetValue
˝˝Z b
(
˝˝b c
	_pageURLs
˝˝c l
)
˝˝l m
.
˝˝m n
ToString
˝˝n v
(
˝˝v w
)
˝˝w x
)
˝˝x y
)
˝˝y z
.
˝˝z {
Select˝˝{ Å
(˝˝Å Ç
x˝˝Ç É
=>˝˝Ñ Ü
x˝˝á à
.˝˝à â
GetValue˝˝â ë
(˝˝ë í
	_pageURLs˝˝í õ
)˝˝õ ú
.˝˝ú ù
ToString˝˝ù •
(˝˝• ¶
)˝˝¶ ß
)˝˝ß ®
.˝˝® ©
FirstOrDefault˝˝© ∑
(˝˝∑ ∏
)˝˝∏ π
;˝˝π ∫
}
˛˛ 
else
ˇˇ 
{
ÄÄ 
ViewBag
ÇÇ 
.
ÇÇ 
	returnURL
ÇÇ %
=
ÇÇ& '
	_pageURLs
ÇÇ( 1
.
ÇÇ1 2
UIURL
ÇÇ2 7
;
ÇÇ7 8
}
ÉÉ 
}
ÑÑ 
return
ÖÖ 
View
ÖÖ 
(
ÖÖ 
$str
ÖÖ #
,
ÖÖ# $
vm
ÖÖ% '
)
ÖÖ' (
;
ÖÖ( )
}
ÜÜ 	
[
àà 	
HttpGet
àà	 
]
àà 
public
ââ 
IActionResult
ââ 
ForgotPassword
ââ +
(
ââ+ ,
)
ââ, -
{
ää 	
ForgotPassword
ãã 
forgotPassword
ãã )
=
ãã* +
new
ãã, /
ForgotPassword
ãã0 >
(
ãã> ?
)
ãã? @
;
ãã@ A
return
åå 
View
åå 
(
åå 
forgotPassword
åå &
)
åå& '
;
åå' (
}
çç 	
[
èè 	
HttpPost
èè	 
]
èè 
public
êê 
async
êê 
Task
êê 
<
êê 
IActionResult
êê '
>
êê' (!
ForgotPasswordAsync
êê) <
(
êê< =
ForgotPassword
êê= K
forgotPassword
êêL Z
)
êêZ [
{
ëë 	
try
íí 
{
ìì 
MailTemplateVM
îî 
mailTemplateVM
îî -
=
îî. /
new
îî0 3
MailTemplateVM
îî4 B
(
îîB C
)
îîC D
{
ïï 
AgreementTypeID
ññ #
=
ññ$ %
(
ññ& '
int
ññ' *
)
ññ* +
AgreementTypeId
ññ+ :
.
ññ: ;
ForgotPassword
ññ; I
}
óó 
;
óó 
List
òò 
<
òò 
string
òò 
>
òò 
	emailList
òò &
=
òò' (
new
òò) ,
List
òò- 1
<
òò1 2
string
òò2 8
>
òò8 9
(
òò9 :
)
òò: ;
;
òò; <
string
ôô 
token
ôô 
=
ôô 
string
ôô %
.
ôô% &
Empty
ôô& +
;
ôô+ ,
string
öö 
userName
öö 
=
öö  !
string
öö" (
.
öö( )
Empty
öö) .
;
öö. /
bool
õõ 
isUserHaveEmail
õõ $
=
õõ% &
false
õõ' ,
;
õõ, -
var
ùù 
userByEmail
ùù 
=
ùù  !
await
ùù" '
_userManager
ùù( 4
.
ùù4 5
Users
ùù5 :
.
ùù: ;
Where
ùù; @
(
ùù@ A
x
ùùA B
=>
ùùC E
x
ùùF G
.
ùùG H
Email
ùùH M
==
ùùN P
forgotPassword
ùùQ _
.
ùù_ `
EmailOrUserId
ùù` m
&&
ùùn p
x
ùùq r
.
ùùr s
	isDeleted
ùùs |
==
ùù} 
falseùùÄ Ö
)ùùÖ Ü
.ùùÜ á#
FirstOrDefaultAsyncùùá ö
(ùùö õ
)ùùõ ú
;ùùú ù
if
ûû 
(
ûû 
userByEmail
ûû 
==
ûû  "
null
ûû# '
)
ûû' (
{
üü 
var
†† 
userByUserName
†† &
=
††' (
await
††) .
_userManager
††/ ;
.
††; <
Users
††< A
.
††A B
Where
††B G
(
††G H
x
††H I
=>
††J L
x
††M N
.
††N O
UserName
††O W
==
††X Z
forgotPassword
††[ i
.
††i j
EmailOrUserId
††j w
&&
††x z
x
††{ |
.
††| }
	isDeleted††} Ü
==††á â
false††ä è
)††è ê
.††ê ë#
FirstOrDefaultAsync††ë §
(††§ •
)††• ¶
;††¶ ß
if
°° 
(
°° 
userByUserName
°° &
==
°°' )
null
°°* .
)
°°. /
{
¢¢ 
ViewBag
§§ 
.
§§  
dynamicMessage
§§  .
=
§§/ 0
await
§§1 6$
_dynamicMessageService
§§7 M
.
§§M N
Get
§§N Q
(
§§Q R
$str
§§R o
)
§§o p
;
§§p q
return
•• 
View
•• #
(
••# $
forgotPassword
••$ 2
)
••2 3
;
••3 4
}
¶¶ 
token
®® 
=
®® 
await
®® !
_userManager
®®" .
.
®®. /-
GeneratePasswordResetTokenAsync
®®/ N
(
®®N O
userByUserName
®®O ]
)
®®] ^
;
®®^ _
if
™™ 
(
™™ 
userByUserName
™™ &
.
™™& '
Email
™™' ,
.
™™, -
IsNullOrEmpty
™™- :
(
™™: ;
)
™™; <
)
™™< =
{
´´ 
userName
¨¨  
=
¨¨! "
userByUserName
¨¨# 1
.
¨¨1 2
UserName
¨¨2 :
;
¨¨: ;
	emailList
≠≠ !
=
≠≠" #
await
≠≠$ )
_userManager
≠≠* 6
.
≠≠6 7
Users
≠≠7 <
.
≠≠< =
Where
≠≠= B
(
≠≠B C
x
≠≠C D
=>
≠≠E G
x
≠≠H I
.
≠≠I J
isSuperAdmin
≠≠J V
==
≠≠W Y
true
≠≠Z ^
&&
≠≠_ a
x
≠≠b c
.
≠≠c d
	isDeleted
≠≠d m
==
≠≠n p
false
≠≠q v
)
≠≠v w
.
≠≠w x
Select
≠≠x ~
(
≠≠~ 
x≠≠ Ä
=>≠≠Å É
x≠≠Ñ Ö
.≠≠Ö Ü
Email≠≠Ü ã
)≠≠ã å
.≠≠å ç
ToListAsync≠≠ç ò
(≠≠ò ô
)≠≠ô ö
;≠≠ö õ
}
ÆÆ 
else
ØØ 
{
∞∞ 
isUserHaveEmail
±± '
=
±±( )
true
±±* .
;
±±. /
userName
≤≤  
=
≤≤! "
string
≤≤# )
.
≤≤) *
Format
≤≤* 0
(
≤≤0 12
$FORGOT_PASSWORD_MAIL_USERNAME_FORMAT
≤≤1 U
,
≤≤U V
userByUserName
≤≤W e
.
≤≤e f
UserName
≤≤f n
,
≤≤n o
userByUserName
≤≤p ~
.
≤≤~ 
Email≤≤ Ñ
)≤≤Ñ Ö
;≤≤Ö Ü
	emailList
≥≥ !
.
≥≥! "
Add
≥≥" %
(
≥≥% &
userByUserName
≥≥& 4
.
≥≥4 5
Email
≥≥5 :
)
≥≥: ;
;
≥≥; <
}
¥¥ 
}
µµ 
else
∂∂ 
{
∑∑ 
isUserHaveEmail
∏∏ #
=
∏∏$ %
true
∏∏& *
;
∏∏* +
token
ππ 
=
ππ 
await
ππ !
_userManager
ππ" .
.
ππ. /-
GeneratePasswordResetTokenAsync
ππ/ N
(
ππN O
userByEmail
ππO Z
)
ππZ [
;
ππ[ \
userName
∫∫ 
=
∫∫ 
string
∫∫ %
.
∫∫% &
Format
∫∫& ,
(
∫∫, -2
$FORGOT_PASSWORD_MAIL_USERNAME_FORMAT
∫∫- Q
,
∫∫Q R
userByEmail
∫∫S ^
.
∫∫^ _
UserName
∫∫_ g
,
∫∫g h
userByEmail
∫∫i t
.
∫∫t u
Email
∫∫u z
)
∫∫z {
;
∫∫{ |
	emailList
ªª 
.
ªª 
Add
ªª !
(
ªª! "
userByEmail
ªª" -
.
ªª- .
Email
ªª. 3
)
ªª3 4
;
ªª4 5
}
ºº 
var
ææ 
tokenEncrypted
ææ "
=
ææ# $
CryptoJs
ææ% -
.
ææ- .
Encrypt
ææ. 5
(
ææ5 6
token
ææ6 ;
)
ææ; <
;
ææ< =
var
øø 
encryptedUserName
øø %
=
øø& '
CryptoJs
øø( 0
.
øø0 1
Encrypt
øø1 8
(
øø8 9
userName
øø9 A
)
øøA B
;
øøB C
mailTemplateVM
¿¿ 
.
¿¿ 
UserName
¿¿ '
=
¿¿( )
userName
¿¿* 2
;
¿¿2 3
mailTemplateVM
¡¡ 
.
¡¡ !
ToSendEmailsAddress
¡¡ 2
=
¡¡3 4
	emailList
¡¡5 >
.
¡¡> ?
ToArray
¡¡? F
(
¡¡F G
)
¡¡G H
;
¡¡H I
mailTemplateVM
¬¬ 
.
¬¬ 
LinkURL
¬¬ &
=
¬¬' (
string
¬¬) /
.
¬¬/ 0
Format
¬¬0 6
(
¬¬6 7+
FORGOT_PASSWORD_CALLBACK_LINK
¬¬7 T
,
¬¬T U
	_pageURLs
¬¬V _
.
¬¬_ `
IdentityServerURL
¬¬` q
,
¬¬q r 
encryptedUserName¬¬s Ñ
,¬¬Ñ Ö
tokenEncrypted¬¬Ü î
)¬¬î ï
;¬¬ï ñ

ResponseVM
ƒƒ 

responseVM
ƒƒ %
=
ƒƒ& '
await
ƒƒ( -
SendMailTemplate
ƒƒ. >
(
ƒƒ> ?
mailTemplateVM
ƒƒ? M
)
ƒƒM N
;
ƒƒN O
if
∆∆ 
(
∆∆ 

responseVM
∆∆ 
.
∆∆ 
status
∆∆ %
==
∆∆& (
State
∆∆) .
.
∆∆. /
SUCCESS
∆∆/ 6
.
∆∆6 7
ToString
∆∆7 ?
(
∆∆? @
)
∆∆@ A
)
∆∆A B
{
«« 
forgotPassword
»» "
.
»»" #
SuccessSendEmail
»»# 3
=
»»4 5
true
»»6 :
;
»»: ;
forgotPassword
…… "
.
……" #
IsUserHaveEmail
……# 2
=
……3 4
isUserHaveEmail
……5 D
;
……D E
return
   
View
   
(
    
forgotPassword
    .
)
  . /
;
  / 0
}
ÀÀ 
else
ÃÃ 
{
ÕÕ 
var
œœ 
dynamicMessage
œœ &
=
œœ' (
new
œœ) ,
DynamicMessage
œœ- ;
(
œœ; <
)
œœ< =
{
œœ> ?
messageType
œœ@ K
=
œœL M
	ERROR_MSG
œœN W
,
œœW X
message
œœY `
=
œœa b

responseVM
œœc m
.
œœm n
message
œœn u
}
œœv w
;
œœw x
ViewBag
–– 
.
–– 
dynamicMessage
–– *
=
––+ ,
dynamicMessage
––- ;
;
––; <
return
—— 
View
—— 
(
——  
forgotPassword
——  .
)
——. /
;
——/ 0
}
““ 
}
”” 
catch
‘‘ 
(
‘‘ 
	Exception
‘‘ 
e
‘‘ 
)
‘‘ 
{
’’ 
_logger
÷÷ 
.
÷÷ 
LogError
÷÷  
(
÷÷  !
e
÷÷! "
.
÷÷" #
ToString
÷÷# +
(
÷÷+ ,
)
÷÷, -
)
÷÷- .
;
÷÷. /
var
ŸŸ 
dynamicMessage
ŸŸ "
=
ŸŸ# $
new
ŸŸ% (
DynamicMessage
ŸŸ) 7
(
ŸŸ7 8
)
ŸŸ8 9
{
ŸŸ: ;
messageType
ŸŸ< G
=
ŸŸH I
	ERROR_MSG
ŸŸJ S
,
ŸŸS T
message
ŸŸU \
=
ŸŸ] ^
e
ŸŸ_ `
.
ŸŸ` a
Message
ŸŸa h
}
ŸŸi j
;
ŸŸj k
ViewBag
⁄⁄ 
.
⁄⁄ 
dynamicMessage
⁄⁄ &
=
⁄⁄' (
dynamicMessage
⁄⁄) 7
;
⁄⁄7 8
return
€€ 
View
€€ 
(
€€ 
forgotPassword
€€ *
)
€€* +
;
€€+ ,
}
‹‹ 
}
›› 	
[
ﬂﬂ 	
HttpGet
ﬂﬂ	 
]
ﬂﬂ 
public
‡‡ 
async
‡‡ 
Task
‡‡ 
<
‡‡ 
IActionResult
‡‡ '
>
‡‡' (
ResetUserPassword
‡‡) :
(
‡‡: ;
string
‡‡; A
userName
‡‡B J
,
‡‡J K
string
‡‡L R
token
‡‡S X
)
‡‡X Y
{
·· 	
if
‚‚ 
(
‚‚ 
userName
‚‚ 
==
‚‚ 
null
‚‚  
||
‚‚! #
token
‚‚$ )
==
‚‚* ,
null
‚‚- 1
)
‚‚1 2
{
„„ 
var
‰‰ 
somethingWrongMSG
‰‰ %
=
‰‰& '
await
‰‰( -$
_dynamicMessageService
‰‰. D
.
‰‰D E
Get
‰‰E H
(
‰‰H I
SOMTHING_WRONG
‰‰I W
)
‰‰W X
;
‰‰X Y
return
ÂÂ 
View
ÂÂ 
(
ÂÂ 
$str
ÂÂ #
,
ÂÂ# $
new
ÂÂ% (
ErrorViewModel
ÂÂ) 7
(
ÂÂ7 8
)
ÂÂ8 9
{
ÂÂ: ;
Error
ÂÂ< A
=
ÂÂB C
new
ÂÂD G
ErrorMessage
ÂÂH T
(
ÂÂT U
)
ÂÂU V
{
ÂÂW X
Error
ÂÂY ^
=
ÂÂ_ `
somethingWrongMSG
ÂÂa r
.
ÂÂr s
message
ÂÂs z
}
ÂÂ{ |
}
ÂÂ} ~
)
ÂÂ~ 
;ÂÂ Ä
}
ÊÊ 
try
ÁÁ 
{
ËË 
var
ÈÈ "
usernameWithoutSpace
ÈÈ (
=
ÈÈ) *
userName
ÈÈ+ 3
.
ÈÈ3 4
Replace
ÈÈ4 ;
(
ÈÈ; <
$str
ÈÈ< ?
,
ÈÈ? @
$str
ÈÈA D
)
ÈÈD E
;
ÈÈE F
var
ÍÍ 
decryptedUserName
ÍÍ %
=
ÍÍ& '
CryptoJs
ÍÍ( 0
.
ÍÍ0 1
DecryptStringAES
ÍÍ1 A
(
ÍÍA B"
usernameWithoutSpace
ÍÍB V
)
ÍÍV W
;
ÍÍW X
var
ÎÎ 
userNameArray
ÎÎ !
=
ÎÎ" #
decryptedUserName
ÎÎ$ 5
.
ÎÎ5 6
Split
ÎÎ6 ;
(
ÎÎ; <
$str
ÎÎ< ?
)
ÎÎ? @
;
ÎÎ@ A
if
ÏÏ 
(
ÏÏ 
userNameArray
ÏÏ !
.
ÏÏ! "
Length
ÏÏ" (
>
ÏÏ) *
$num
ÏÏ+ ,
)
ÏÏ, -
{
ÌÌ 
userName
ÓÓ 
=
ÓÓ 
userNameArray
ÓÓ ,
[
ÓÓ, -
$num
ÓÓ- .
]
ÓÓ. /
;
ÓÓ/ 0
}
ÔÔ 
var
 
user
 
=
 
await
  
_userManager
! -
.
- .
FindByNameAsync
. =
(
= >
userName
> F
)
F G
;
G H
var
ÚÚ  
resetPasswordToken
ÚÚ &
=
ÚÚ' (
token
ÚÚ) .
.
ÚÚ. /
Replace
ÚÚ/ 6
(
ÚÚ6 7
$str
ÚÚ7 :
,
ÚÚ: ;
$str
ÚÚ< ?
)
ÚÚ? @
;
ÚÚ@ A
var
ÛÛ 
deCreptedToken
ÛÛ "
=
ÛÛ# $
CryptoJs
ÛÛ% -
.
ÛÛ- .
DecryptStringAES
ÛÛ. >
(
ÛÛ> ? 
resetPasswordToken
ÛÛ? Q
)
ÛÛQ R
;
ÛÛR S
var
ÙÙ 
isValidToken
ÙÙ  
=
ÙÙ! "
await
ÙÙ# (
_userManager
ÙÙ) 5
.
ÙÙ5 6"
VerifyUserTokenAsync
ÙÙ6 J
(
ÙÙJ K
user
ÙÙK O
,
ÙÙO P
TokenOptions
ÙÙQ ]
.
ÙÙ] ^
DefaultProvider
ÙÙ^ m
,
ÙÙm n
UserManager
ÙÙo z
<
ÙÙz {
ApplicationUserÙÙ{ ä
>ÙÙä ã
.ÙÙã å)
ResetPasswordTokenPurposeÙÙå •
,ÙÙ• ¶
deCreptedTokenÙÙß µ
)ÙÙµ ∂
;ÙÙ∂ ∑
if
ıı 
(
ıı 
!
ıı 
isValidToken
ıı !
)
ıı! "
{
ˆˆ 
var
˜˜ 
linkExpiredMSG
˜˜ &
=
˜˜' (
await
˜˜) .$
_dynamicMessageService
˜˜/ E
.
˜˜E F
Get
˜˜F I
(
˜˜I J)
PASSWORD_RESET_LINK_EXPIRED
˜˜J e
)
˜˜e f
;
˜˜f g
return
¯¯ 
View
¯¯ 
(
¯¯  
$str
¯¯  '
,
¯¯' (
new
¯¯) ,
ErrorViewModel
¯¯- ;
(
¯¯; <
)
¯¯< =
{
¯¯> ?
Error
¯¯@ E
=
¯¯F G
new
¯¯H K
ErrorMessage
¯¯L X
(
¯¯X Y
)
¯¯Y Z
{
¯¯[ \
Error
¯¯] b
=
¯¯c d
linkExpiredMSG
¯¯e s
.
¯¯s t
message
¯¯t {
}
¯¯| }
}
¯¯~ 
)¯¯ Ä
;¯¯Ä Å
}
˘˘ !
ResetUserPasswordVM
˚˚ #!
resetUserPasswordVM
˚˚$ 7
=
˚˚8 9
new
˚˚: =!
ResetUserPasswordVM
˚˚> Q
(
˚˚Q R
)
˚˚R S
{
¸¸ 
User
˝˝ 
=
˝˝ 
userName
˝˝ #
,
˝˝# $
	UserToken
˛˛ 
=
˛˛ 
deCreptedToken
˛˛  .
}
ˇˇ 
;
ˇˇ 
return
ÄÄ 
View
ÄÄ 
(
ÄÄ !
resetUserPasswordVM
ÄÄ /
)
ÄÄ/ 0
;
ÄÄ0 1
}
ÅÅ 
catch
ÇÇ 
(
ÇÇ 
	Exception
ÇÇ 
e
ÇÇ 
)
ÇÇ 
{
ÉÉ 
_logger
ÑÑ 
.
ÑÑ 
LogError
ÑÑ  
(
ÑÑ  !
e
ÑÑ! "
.
ÑÑ" #
ToString
ÑÑ# +
(
ÑÑ+ ,
)
ÑÑ, -
)
ÑÑ- .
;
ÑÑ. /
return
ÜÜ 
View
ÜÜ 
(
ÜÜ 
$str
ÜÜ #
,
ÜÜ# $
new
ÜÜ% (
ErrorViewModel
ÜÜ) 7
(
ÜÜ7 8
)
ÜÜ8 9
{
ÜÜ: ;
Error
ÜÜ< A
=
ÜÜB C
new
ÜÜD G
ErrorMessage
ÜÜH T
(
ÜÜT U
)
ÜÜU V
{
ÜÜW X
Error
ÜÜY ^
=
ÜÜ_ `
e
ÜÜa b
.
ÜÜb c
Message
ÜÜc j
}
ÜÜk l
}
ÜÜm n
)
ÜÜn o
;
ÜÜo p
}
áá 
}
àà 	
[
ää 	
HttpPost
ää	 
]
ää 
public
ãã 
async
ãã 
Task
ãã 
<
ãã 
IActionResult
ãã '
>
ãã' (
ResetUserPassword
ãã) :
(
ãã: ;!
ResetUserPasswordVM
ãã; N!
resetUserPasswordVM
ããO b
)
ããb c
{
åå 	
if
çç 
(
çç !
resetUserPasswordVM
çç #
==
çç$ &
null
çç' +
)
çç+ ,
{
éé 
ViewBag
èè 
.
èè 
dynamicMessage
èè &
=
èè' (
await
èè) .$
_dynamicMessageService
èè/ E
.
èèE F
Get
èèF I
(
èèI J
SOMTHING_WRONG
èèJ X
)
èèX Y
;
èèY Z
return
êê 
View
êê 
(
êê !
resetUserPasswordVM
êê /
)
êê/ 0
;
êê0 1
}
ëë 
try
íí 
{
ìì 
var
îî 
newPassword
îî 
=
îî  !!
resetUserPasswordVM
îî" 5
.
îî5 6
NewPassword
îî6 A
;
îîA B
var
ïï 
confirmPassword
ïï #
=
ïï$ %!
resetUserPasswordVM
ïï& 9
.
ïï9 :
ConfirmPassword
ïï: I
;
ïïI J
if
ññ 
(
ññ 
newPassword
ññ 
!=
ññ  "
confirmPassword
ññ# 2
)
ññ2 3
{
óó 
var
ôô 
dynamicMessage
ôô &
=
ôô' (
new
ôô) ,
DynamicMessage
ôô- ;
(
ôô; <
)
ôô< =
{
ôô> ?
messageType
ôô@ K
=
ôôL M
	ERROR_MSG
ôôN W
,
ôôW X
message
ôôY `
=
ôôa b$
PASSWORD_DOSENOT_MATCH
ôôc y
}
ôôz {
;
ôô{ |
ViewBag
öö 
.
öö 
dynamicMessage
öö *
=
öö+ ,
dynamicMessage
öö- ;
;
öö; <
return
õõ 
View
õõ 
(
õõ  !
resetUserPasswordVM
õõ  3
)
õõ3 4
;
õõ4 5
}
úú 
var
ûû 
user
ûû 
=
ûû 
await
ûû  
_userManager
ûû! -
.
ûû- .
FindByNameAsync
ûû. =
(
ûû= >!
resetUserPasswordVM
ûû> Q
.
ûûQ R
User
ûûR V
)
ûûV W
;
ûûW X
user
üü 
.
üü 
changePasswordAt
üü %
=
üü& '
Helper
üü( .
.
üü. /
GetDateTime
üü/ :
(
üü: ;
)
üü; <
;
üü< =
var
†† 

resultTest
†† 
=
††  
await
††! &
_userManager
††' 3
.
††3 4 
ResetPasswordAsync
††4 F
(
††F G
user
††G K
,
††K L!
resetUserPasswordVM
††M `
.
††` a
	UserToken
††a j
,
††j k!
resetUserPasswordVM
††l 
.†† Ä
NewPassword††Ä ã
)††ã å
;††å ç
if
¢¢ 
(
¢¢ 
!
¢¢ 

resultTest
¢¢ 
.
¢¢  
	Succeeded
¢¢  )
)
¢¢) *
{
££ 
return
•• 
View
•• 
(
••  
$str
••  '
,
••' (
new
••) ,
ErrorViewModel
••- ;
(
••; <
)
••< =
{
••> ?
Error
••@ E
=
••F G
new
••H K
ErrorMessage
••L X
(
••X Y
)
••Y Z
{
••[ \
Error
••] b
=
••c d

resultTest
••e o
.
••o p
Errors
••p v
.
••v w
FirstOrDefault••w Ö
(••Ö Ü
)••Ü á
.••á à
Code••à å
}••ç é
}••è ê
)••ê ë
;••ë í
}
¶¶ 
return
ßß 
Redirect
ßß 
(
ßß  
	_pageURLs
ßß  )
.
ßß) *
UIURL
ßß* /
)
ßß/ 0
;
ßß0 1
}
®® 
catch
©© 
(
©© 
	Exception
©© 
e
©© 
)
©© 
{
™™ 
_logger
´´ 
.
´´ 
LogError
´´  
(
´´  !
e
´´! "
.
´´" #
ToString
´´# +
(
´´+ ,
)
´´, -
)
´´- .
;
´´. /
return
≠≠ 
View
≠≠ 
(
≠≠ 
$str
≠≠ #
,
≠≠# $
new
≠≠% (
ErrorViewModel
≠≠) 7
(
≠≠7 8
)
≠≠8 9
{
≠≠: ;
Error
≠≠< A
=
≠≠B C
new
≠≠D G
ErrorMessage
≠≠H T
(
≠≠T U
)
≠≠U V
{
≠≠W X
Error
≠≠Y ^
=
≠≠_ `
$str
≠≠a k
+
≠≠l m
e
≠≠n o
.
≠≠o p
Message
≠≠p w
}
≠≠x y
}
≠≠z {
)
≠≠{ |
;
≠≠| }
}
ÆÆ 
}
ØØ 	
[
¥¥ 	
Route
¥¥	 
(
¥¥ 
$str
¥¥ *
)
¥¥* +
]
¥¥+ ,
[
µµ 	
HttpPost
µµ	 
]
µµ 
[
∂∂ 	
	Authorize
∂∂	 
(
∂∂ #
AuthenticationSchemes
∂∂ (
=
∂∂) *
JwtBearerDefaults
∂∂+ <
.
∂∂< ="
AuthenticationScheme
∂∂= Q
)
∂∂Q R
]
∂∂R S
public
∑∑ 
async
∑∑ 
Task
∑∑ 
<
∑∑ 
IActionResult
∑∑ '
>
∑∑' ( 
UpdateUserPassword
∑∑) ;
(
∑∑; <
[
∑∑< =
FromBody
∑∑= E
]
∑∑E F"
UserPasswordUpdateVM
∑∑G [
model
∑∑\ a
)
∑∑a b
{
∏∏ 	
var
ππ 
decrptNewPassword
ππ !
=
ππ" #
CryptoJs
ππ$ ,
.
ππ, -
DecryptStringAES
ππ- =
(
ππ= >
model
ππ> C
.
ππC D
NewPassword
ππD O
)
ππO P
;
ππP Q
var
∫∫ &
decrptConfirmNewPassword
∫∫ (
=
∫∫) *
CryptoJs
∫∫+ 3
.
∫∫3 4
DecryptStringAES
∫∫4 D
(
∫∫D E
model
∫∫E J
.
∫∫J K 
ConfirmNewPassword
∫∫K ]
)
∫∫] ^
;
∫∫^ _
var
ªª 
decrptuserId
ªª 
=
ªª 
CryptoJs
ªª '
.
ªª' (
DecryptStringAES
ªª( 8
(
ªª8 9
model
ªª9 >
.
ªª> ?
userId
ªª? E
)
ªªE F
;
ªªF G
var
ºº 
decrptOldPassword
ºº !
=
ºº" #
$str
ºº$ &
;
ºº& '
if
ΩΩ 
(
ΩΩ 
!
ΩΩ 
model
ΩΩ 
.
ΩΩ 
OldPassword
ΩΩ "
.
ΩΩ" #
IsNullOrEmpty
ΩΩ# 0
(
ΩΩ0 1
)
ΩΩ1 2
)
ΩΩ2 3
{
ææ 
decrptOldPassword
øø !
=
øø" #
CryptoJs
øø$ ,
.
øø, -
DecryptStringAES
øø- =
(
øø= >
model
øø> C
.
øøC D
OldPassword
øøD O
)
øøO P
;
øøP Q
}
¿¿ 
try
¬¬ 
{
√√ 
if
ƒƒ 
(
ƒƒ 
decrptNewPassword
ƒƒ %
!=
ƒƒ& (&
decrptConfirmNewPassword
ƒƒ) A
)
ƒƒA B
{
≈≈ 
return
∆∆ '
_iHttpsResponseRepository
∆∆ 4
.
∆∆4 5
ReturnResult
∆∆5 A
(
∆∆A B
APIStatusCode
∆∆B O
.
∆∆O P
ERROR
∆∆P U
,
∆∆U V
APIState
∆∆W _
.
∆∆_ `
FAILED
∆∆` f
,
∆∆f g
null
∆∆h l
,
∆∆l m
new
∆∆n q
UserMessage
∆∆r }
(
∆∆} ~
)
∆∆~ 
{∆∆Ä Å
message∆∆Ç â
=∆∆ä ã&
PASSWORD_DOSENOT_MATCH∆∆å ¢
}∆∆£ §
)∆∆§ •
;∆∆• ¶
}
«« 
else
»» 
{
…… 
var
   
user
   
=
   
await
   $
_userManager
  % 1
.
  1 2
FindByIdAsync
  2 ?
(
  ? @
decrptuserId
  @ L
)
  L M
;
  M N
if
ÀÀ 
(
ÀÀ 
!
ÀÀ 
decrptOldPassword
ÀÀ *
.
ÀÀ* +
IsNullOrEmpty
ÀÀ+ 8
(
ÀÀ8 9
)
ÀÀ9 :
)
ÀÀ: ;
{
ÃÃ 
var
ÕÕ 
authenticateUser
ÕÕ ,
=
ÕÕ- .
await
ÕÕ/ 4
_signInManager
ÕÕ5 C
.
ÕÕC D
UserManager
ÕÕD O
.
ÕÕO P 
CheckPasswordAsync
ÕÕP b
(
ÕÕb c
user
ÕÕc g
,
ÕÕg h
decrptOldPassword
ÕÕi z
)
ÕÕz {
;
ÕÕ{ |
if
ŒŒ 
(
ŒŒ 
!
ŒŒ 
authenticateUser
ŒŒ -
)
ŒŒ- .
{
œœ 
var
–– 
somethingWrongMSG
––  1
=
––2 3
await
––4 9$
_dynamicMessageService
––: P
.
––P Q
Get
––Q T
(
––T U
SOMTHING_WRONG
––U c
)
––c d
;
––d e
return
—— "'
_iHttpsResponseRepository
——# <
.
——< =
ReturnResult
——= I
(
——I J
APIStatusCode
——J W
.
——W X
ERROR
——X ]
,
——] ^
APIState
——_ g
.
——g h
FAILED
——h n
,
——n o
null
——p t
,
——t u
new
——v y
UserMessage——z Ö
(——Ö Ü
)——Ü á
{——à â
messageContent——ä ò
=——ô ö
new——õ û
MessageContent——ü ≠
{——Æ Ø
messageType——∞ ª
=——º Ω!
somethingWrongMSG——æ œ
.——œ –
messageType——– €
,——€ ‹
messageCode——› Ë
=——È Í!
somethingWrongMSG——Î ¸
.——¸ ˝
messageCode——˝ à
,——à â
message——ä ë
=——í ì!
somethingWrongMSG——î •
.——• ¶
message——¶ ≠
}——Æ Ø
}——∞ ±
)——± ≤
;——≤ ≥
}
““ 
}
”” 
user
‘‘ 
.
‘‘ 
changePasswordAt
‘‘ )
=
‘‘* +
Helper
‘‘, 2
.
‘‘2 3
GetDateTime
‘‘3 >
(
‘‘> ?
)
‘‘? @
;
‘‘@ A
var
’’ 
token
’’ 
=
’’ 
await
’’  %
_userManager
’’& 2
.
’’2 3-
GeneratePasswordResetTokenAsync
’’3 R
(
’’R S
user
’’S W
)
’’W X
;
’’X Y
var
÷÷ 

resultTest
÷÷ "
=
÷÷# $
await
÷÷% *
_userManager
÷÷+ 7
.
÷÷7 8 
ResetPasswordAsync
÷÷8 J
(
÷÷J K
user
÷÷K O
,
÷÷O P
token
÷÷Q V
,
÷÷V W
decrptNewPassword
÷÷X i
)
÷÷i j
;
÷÷j k
if
ÿÿ 
(
ÿÿ 
!
ÿÿ 

resultTest
ÿÿ #
.
ÿÿ# $
	Succeeded
ÿÿ$ -
)
ÿÿ- .
{
ŸŸ 
var
€€ 
somethingWrongMSG
€€ -
=
€€. /
await
€€0 5$
_dynamicMessageService
€€6 L
.
€€L M
Get
€€M P
(
€€P Q
SOMTHING_WRONG
€€Q _
)
€€_ `
;
€€` a
return
‹‹ '
_iHttpsResponseRepository
‹‹ 8
.
‹‹8 9
ReturnResult
‹‹9 E
(
‹‹E F
APIStatusCode
‹‹F S
.
‹‹S T
ERROR
‹‹T Y
,
‹‹Y Z
APIState
‹‹[ c
.
‹‹c d
FAILED
‹‹d j
,
‹‹j k
null
‹‹l p
,
‹‹p q
new
‹‹r u
UserMessage‹‹v Å
(‹‹Å Ç
)‹‹Ç É
{‹‹Ñ Ö
messageContent‹‹Ü î
=‹‹ï ñ
new‹‹ó ö
MessageContent‹‹õ ©
{‹‹™ ´
messageType‹‹¨ ∑
=‹‹∏ π!
somethingWrongMSG‹‹∫ À
.‹‹À Ã
messageType‹‹Ã ◊
,‹‹◊ ÿ
messageCode‹‹Ÿ ‰
=‹‹Â Ê!
somethingWrongMSG‹‹Á ¯
.‹‹¯ ˘
messageCode‹‹˘ Ñ
,‹‹Ñ Ö
message‹‹Ü ç
=‹‹é è!
somethingWrongMSG‹‹ê °
.‹‹° ¢
message‹‹¢ ©
}‹‹™ ´
}‹‹¨ ≠
)‹‹≠ Æ
;‹‹Æ Ø
}
›› 
var
ﬂﬂ !
passwwordUpdatedMSG
ﬂﬂ +
=
ﬂﬂ, -
await
ﬂﬂ. 3$
_dynamicMessageService
ﬂﬂ4 J
.
ﬂﬂJ K
Get
ﬂﬂK N
(
ﬂﬂN O)
EMPLOYEE_CREDENTIAL_UPDATED
ﬂﬂO j
)
ﬂﬂj k
;
ﬂﬂk l
return
‡‡ '
_iHttpsResponseRepository
‡‡ 4
.
‡‡4 5
ReturnResult
‡‡5 A
(
‡‡A B
APIStatusCode
‡‡B O
.
‡‡O P
SUCCESS
‡‡P W
,
‡‡W X
APIState
‡‡Y a
.
‡‡a b
SUCCESS
‡‡b i
,
‡‡i j
null
‡‡k o
,
‡‡o p
new
‡‡q t
UserMessage‡‡u Ä
(‡‡Ä Å
)‡‡Å Ç
{‡‡É Ñ
message‡‡Ö å
=‡‡ç é#
passwwordUpdatedMSG‡‡è ¢
.‡‡¢ £
message‡‡£ ™
}‡‡´ ¨
)‡‡¨ ≠
;‡‡≠ Æ
}
·· 
}
„„ 
catch
‰‰ 
(
‰‰ 
	Exception
‰‰ 
e
‰‰ 
)
‰‰ 
{
ÂÂ 
_logger
ÊÊ 
.
ÊÊ 
LogError
ÊÊ  
(
ÊÊ  !
e
ÊÊ! "
.
ÊÊ" #
ToString
ÊÊ# +
(
ÊÊ+ ,
)
ÊÊ, -
)
ÊÊ- .
;
ÊÊ. /
return
ÁÁ 
await
ÁÁ '
_iHttpsResponseRepository
ÁÁ 6
.
ÁÁ6 7%
ReturnExceptionResponse
ÁÁ7 N
(
ÁÁN O
e
ÁÁO P
)
ÁÁP Q
;
ÁÁQ R
}
ËË 
}
ÈÈ 	
[
ÓÓ 	
Route
ÓÓ	 
(
ÓÓ 
$str
ÓÓ *
)
ÓÓ* +
]
ÓÓ+ ,
[
ÔÔ 	
HttpPost
ÔÔ	 
]
ÔÔ 
[
 	
	Authorize
	 
(
 #
AuthenticationSchemes
 (
=
) *
JwtBearerDefaults
+ <
.
< ="
AuthenticationScheme
= Q
)
Q R
]
R S
public
ÒÒ 
async
ÒÒ 
Task
ÒÒ 
<
ÒÒ 
IActionResult
ÒÒ '
>
ÒÒ' (%
UpdateOtherUserPassword
ÒÒ) @
(
ÒÒ@ A
[
ÒÒA B
FromBody
ÒÒB J
]
ÒÒJ K'
OtherUserPasswordUpdateVM
ÒÒL e
model
ÒÒf k
)
ÒÒk l
{
ÚÚ 	
var
ÛÛ 
decrptNewPassword
ÛÛ !
=
ÛÛ" #
CryptoJs
ÛÛ$ ,
.
ÛÛ, -
DecryptStringAES
ÛÛ- =
(
ÛÛ= >
model
ÛÛ> C
.
ÛÛC D
NewPassword
ÛÛD O
)
ÛÛO P
;
ÛÛP Q
var
ÙÙ &
decrptConfirmNewPassword
ÙÙ (
=
ÙÙ) *
CryptoJs
ÙÙ+ 3
.
ÙÙ3 4
DecryptStringAES
ÙÙ4 D
(
ÙÙD E
model
ÙÙE J
.
ÙÙJ K 
ConfirmNewPassword
ÙÙK ]
)
ÙÙ] ^
;
ÙÙ^ _
var
ıı 
decrptuserId
ıı 
=
ıı 
CryptoJs
ıı '
.
ıı' (
DecryptStringAES
ıı( 8
(
ıı8 9
model
ıı9 >
.
ıı> ?
userId
ıı? E
)
ııE F
;
ııF G
try
ˆˆ 
{
˜˜ 
if
¯¯ 
(
¯¯ 
decrptNewPassword
¯¯ %
!=
¯¯& (&
decrptConfirmNewPassword
¯¯) A
)
¯¯A B
{
˘˘ 
return
˙˙ '
_iHttpsResponseRepository
˙˙ 4
.
˙˙4 5
ReturnResult
˙˙5 A
(
˙˙A B
APIStatusCode
˙˙B O
.
˙˙O P
ERROR
˙˙P U
,
˙˙U V
APIState
˙˙W _
.
˙˙_ `
FAILED
˙˙` f
,
˙˙f g
null
˙˙h l
,
˙˙l m
new
˙˙n q
UserMessage
˙˙r }
(
˙˙} ~
)
˙˙~ 
{˙˙Ä Å
message˙˙Ç â
=˙˙ä ã&
PASSWORD_DOSENOT_MATCH˙˙å ¢
}˙˙£ §
)˙˙§ •
;˙˙• ¶
}
˚˚ 
else
¸¸ 
{
˝˝ 
var
˛˛ 
user
˛˛ 
=
˛˛ 
await
˛˛ $
_userManager
˛˛% 1
.
˛˛1 2
FindByIdAsync
˛˛2 ?
(
˛˛? @
decrptuserId
˛˛@ L
)
˛˛L M
;
˛˛M N
user
ˇˇ 
.
ˇˇ 
changePasswordAt
ˇˇ )
=
ˇˇ* +
Helper
ˇˇ, 2
.
ˇˇ2 3
GetDateTime
ˇˇ3 >
(
ˇˇ> ?
)
ˇˇ? @
;
ˇˇ@ A
var
ÄÄ 
token
ÄÄ 
=
ÄÄ 
await
ÄÄ  %
_userManager
ÄÄ& 2
.
ÄÄ2 3-
GeneratePasswordResetTokenAsync
ÄÄ3 R
(
ÄÄR S
user
ÄÄS W
)
ÄÄW X
;
ÄÄX Y
var
ÅÅ 

resultTest
ÅÅ "
=
ÅÅ# $
await
ÅÅ% *
_userManager
ÅÅ+ 7
.
ÅÅ7 8 
ResetPasswordAsync
ÅÅ8 J
(
ÅÅJ K
user
ÅÅK O
,
ÅÅO P
token
ÅÅQ V
,
ÅÅV W
decrptNewPassword
ÅÅX i
)
ÅÅi j
;
ÅÅj k
if
ÉÉ 
(
ÉÉ 
!
ÉÉ 

resultTest
ÉÉ #
.
ÉÉ# $
	Succeeded
ÉÉ$ -
)
ÉÉ- .
{
ÑÑ 
var
ÖÖ 
somethingWrongMSG
ÖÖ -
=
ÖÖ. /
await
ÖÖ0 5$
_dynamicMessageService
ÖÖ6 L
.
ÖÖL M
Get
ÖÖM P
(
ÖÖP Q
SOMTHING_WRONG
ÖÖQ _
)
ÖÖ_ `
;
ÖÖ` a
return
ÜÜ '
_iHttpsResponseRepository
ÜÜ 8
.
ÜÜ8 9
ReturnResult
ÜÜ9 E
(
ÜÜE F
APIStatusCode
ÜÜF S
.
ÜÜS T
ERROR
ÜÜT Y
,
ÜÜY Z
APIState
ÜÜ[ c
.
ÜÜc d
FAILED
ÜÜd j
,
ÜÜj k
null
ÜÜl p
,
ÜÜp q
new
ÜÜr u
UserMessageÜÜv Å
(ÜÜÅ Ç
)ÜÜÇ É
{ÜÜÑ Ö
messageContentÜÜÜ î
=ÜÜï ñ
newÜÜó ö
MessageContentÜÜõ ©
{ÜÜ™ ´
messageTypeÜÜ¨ ∑
=ÜÜ∏ π!
somethingWrongMSGÜÜ∫ À
.ÜÜÀ Ã
messageTypeÜÜÃ ◊
,ÜÜ◊ ÿ
messageCodeÜÜŸ ‰
=ÜÜÂ Ê!
somethingWrongMSGÜÜÁ ¯
.ÜÜ¯ ˘
messageCodeÜÜ˘ Ñ
,ÜÜÑ Ö
messageÜÜÜ ç
=ÜÜé è!
somethingWrongMSGÜÜê °
.ÜÜ° ¢
messageÜÜ¢ ©
}ÜÜ™ ´
}ÜÜ¨ ≠
)ÜÜ≠ Æ
;ÜÜÆ Ø
}
áá 
var
àà !
passwwordUpdatedMSG
àà +
=
àà, -
await
àà. 3$
_dynamicMessageService
àà4 J
.
ààJ K
Get
ààK N
(
ààN O)
EMPLOYEE_CREDENTIAL_UPDATED
ààO j
)
ààj k
;
ààk l
return
ââ '
_iHttpsResponseRepository
ââ 4
.
ââ4 5
ReturnResult
ââ5 A
(
ââA B
APIStatusCode
ââB O
.
ââO P
SUCCESS
ââP W
,
ââW X
APIState
ââY a
.
ââa b
SUCCESS
ââb i
,
ââi j
null
ââk o
,
ââo p
new
ââq t
UserMessageââu Ä
(ââÄ Å
)ââÅ Ç
{ââÉ Ñ
messageââÖ å
=ââç é#
passwwordUpdatedMSGââè ¢
.ââ¢ £
messageââ£ ™
}ââ´ ¨
)ââ¨ ≠
;ââ≠ Æ
}
ää 
}
åå 
catch
çç 
(
çç 
	Exception
çç 
e
çç 
)
çç 
{
éé 
_logger
èè 
.
èè 
LogError
èè  
(
èè  !
e
èè! "
.
èè" #
ToString
èè# +
(
èè+ ,
)
èè, -
)
èè- .
;
èè. /
return
êê 
await
êê '
_iHttpsResponseRepository
êê 6
.
êê6 7%
ReturnExceptionResponse
êê7 N
(
êêN O
e
êêO P
)
êêP Q
;
êêQ R
}
ëë 
}
íí 	
[
óó 	
Route
óó	 
(
óó 
$str
óó *
)
óó* +
]
óó+ ,
[
òò 	
HttpPost
òò	 
]
òò 
[
ôô 	
	Authorize
ôô	 
(
ôô #
AuthenticationSchemes
ôô (
=
ôô) *
JwtBearerDefaults
ôô+ <
.
ôô< ="
AuthenticationScheme
ôô= Q
)
ôôQ R
]
ôôR S
public
öö 
async
öö 
Task
öö 
<
öö 
IActionResult
öö '
>
öö' (
Register
öö) 1
(
öö1 2
[
öö2 3
FromBody
öö3 ;
]
öö; <

RegisterVM
öö= G
model
ööH M
)
ööM N
{
õõ 	
try
úú 
{
ùù 
if
ûû 
(
ûû 

ModelState
ûû 
.
ûû 
IsValid
ûû &
)
ûû& '
{
üü 
ApplicationUser
†† #
	existUser
††$ -
=
††. /
null
††0 4
;
††4 5
if
°° 
(
°° 
!
°° 
String
°° 
.
°°  
IsNullOrEmpty
°°  -
(
°°- .
model
°°. 3
.
°°3 4
Username
°°4 <
)
°°< =
)
°°= >
{
¢¢ 
	existUser
££ !
=
££" #
await
££$ )
_userManager
££* 6
.
££6 7
FindByNameAsync
££7 F
(
££F G
model
££G L
.
££L M
Username
££M U
)
££U V
;
££V W
}
§§ 
if
•• 
(
•• 
!
•• 
String
•• 
.
••  
IsNullOrEmpty
••  -
(
••- .
model
••. 3
.
••3 4
Email
••4 9
)
••9 :
&&
••; =
	existUser
••> G
==
••H J
null
••K O
)
••O P
{
¶¶ 
	existUser
ßß !
=
ßß" #
await
ßß$ )
_userManager
ßß* 6
.
ßß6 7
FindByEmailAsync
ßß7 G
(
ßßG H
model
ßßH M
.
ßßM N
Email
ßßN S
)
ßßS T
;
ßßT U
}
®® 
if
™™ 
(
™™ 
	existUser
™™ !
==
™™" $
null
™™% )
)
™™) *
{
´´ 
bool
¨¨ 

existEmail
¨¨ '
=
¨¨( )
false
¨¨* /
;
¨¨/ 0
if
≠≠ 
(
≠≠ 
model
≠≠ !
.
≠≠! "
Email
≠≠" '
!=
≠≠( *
null
≠≠+ /
)
≠≠/ 0
{
ÆÆ 

existEmail
ØØ &
=
ØØ' (
await
ØØ) .
_fjtDBContext
ØØ/ <
.
ØØ< =
ApplicationUsers
ØØ= M
.
ØØM N
AnyAsync
ØØN V
(
ØØV W
x
ØØW X
=>
ØØY [
x
ØØ\ ]
.
ØØ] ^
Email
ØØ^ c
==
ØØd f
model
ØØg l
.
ØØl m
Email
ØØm r
)
ØØr s
;
ØØs t
}
∞∞ 
if
≤≤ 
(
≤≤ 
!
≤≤ 

existEmail
≤≤ '
)
≤≤' (
{
≥≥ 
var
¥¥ 
user
¥¥  $
=
¥¥% &
new
¥¥' *
ApplicationUser
¥¥+ :
{
µµ 
UserName
∂∂  (
=
∂∂) *
model
∂∂+ 0
.
∂∂0 1
Username
∂∂1 9
,
∂∂9 :
Email
∑∑  %
=
∑∑& '
model
∑∑( -
.
∑∑- .
Email
∑∑. 3
,
∑∑3 4!
passwordHashUpdated
∏∏  3
=
∏∏4 5
true
∏∏6 :
,
∏∏: ;
}
ππ 
;
ππ 
var
ªª 
result
ªª  &
=
ªª' (
await
ªª) .
_userManager
ªª/ ;
.
ªª; <
CreateAsync
ªª< G
(
ªªG H
user
ªªH L
,
ªªL M
model
ªªN S
.
ªªS T
Password
ªªT \
)
ªª\ ]
;
ªª] ^
if
ºº 
(
ºº  
result
ºº  &
.
ºº& '
	Succeeded
ºº' 0
)
ºº0 1
{
ΩΩ 
var
ææ  # 
objApplicationUser
ææ$ 6
=
ææ7 8
await
ææ9 >
_fjtDBContext
ææ? L
.
ææL M
ApplicationUsers
ææM ]
.
ææ] ^!
FirstOrDefaultAsync
ææ^ q
(
ææq r
x
æær s
=>
ææt v
x
ææw x
.
ææx y
UserNameææy Å
==ææÇ Ñ
modelææÖ ä
.ææä ã
Usernameææã ì
)ææì î
;ææî ï
var
øø  #"
userIdentityServerID
øø$ 8
=
øø9 : 
objApplicationUser
øø; M
.
øøM N
Id
øøN P
;
øøP Q
var
¬¬  #
ClientId
¬¬$ ,
=
¬¬- .
await
¬¬/ 4%
_configurationDbContext
¬¬5 L
.
¬¬L M
Clients
¬¬M T
.
¬¬T U
Where
¬¬U Z
(
¬¬Z [
x
¬¬[ \
=>
¬¬] _
x
¬¬` a
.
¬¬a b
ClientId
¬¬b j
==
¬¬k m
ClientConstant
¬¬n |
.
¬¬| }

Q2CClients¬¬} á
.¬¬á à
Q2CUI¬¬à ç
.¬¬ç é
GetDisplayValue¬¬é ù
(¬¬ù û
)¬¬û ü
&&¬¬† ¢
x¬¬£ §
.¬¬§ •
Enabled¬¬• ¨
==¬¬≠ Ø
true¬¬∞ ¥
)¬¬¥ µ
.¬¬µ ∂
Select¬¬∂ º
(¬¬º Ω
x¬¬Ω æ
=>¬¬ø ¡
x¬¬¬ √
.¬¬√ ƒ
ClientId¬¬ƒ Ã
)¬¬Ã Õ
.¬¬Õ Œ#
FirstOrDefaultAsync¬¬Œ ·
(¬¬· ‚
)¬¬‚ „
;¬¬„ ‰!
ClientUserMappingVM
ƒƒ  3#
newClientUsersMapping
ƒƒ4 I
=
ƒƒJ K
new
ƒƒL O!
ClientUserMappingVM
ƒƒP c
(
ƒƒc d
)
ƒƒd e
{
≈≈  !
ClientId
∆∆$ ,
=
∆∆- .
ClientId
∆∆/ 7
,
∆∆7 8
UserId
««$ *
=
««+ ,"
userIdentityServerID
««- A
}
»»  !
;
»»! "
var
    #
mappingSuccess
  $ 2
=
  3 4
await
  5 :
_iUserRepository
  ; K
.
  K L
AddClientUserMap
  L \
(
  \ ]#
newClientUsersMapping
  ] r
)
  r s
;
  s t
var
ÃÃ  #
	encryptId
ÃÃ$ -
=
ÃÃ. /
CryptoJs
ÃÃ0 8
.
ÃÃ8 9
Encrypt
ÃÃ9 @
(
ÃÃ@ A"
userIdentityServerID
ÃÃA U
)
ÃÃU V
;
ÃÃV W
var
ŒŒ  #
resObj
ŒŒ$ *
=
ŒŒ+ ,
new
ŒŒ- 0
{
ŒŒ1 2
userID
ŒŒ3 9
=
ŒŒ: ;
	encryptId
ŒŒ< E
}
ŒŒF G
;
ŒŒG H
var
––  #

createdMSG
––$ .
=
––/ 0
await
––1 6$
_dynamicMessageService
––7 M
.
––M N
Get
––N Q
(
––Q R
CREATED
––R Y
)
––Y Z
;
––Z [
return
——  &'
_iHttpsResponseRepository
——' @
.
——@ A
ReturnResult
——A M
(
——M N
APIStatusCode
——N [
.
——[ \
SUCCESS
——\ c
,
——c d
APIState
——e m
.
——m n
SUCCESS
——n u
,
——u v
resObj
——w }
,
——} ~
new—— Ç
UserMessage——É é
(——é è
)——è ê
{——ë í
message——ì ö
=——õ ú
string——ù £
.——£ §
Format——§ ™
(——™ ´

createdMSG——´ µ
.——µ ∂
message——∂ Ω
,——Ω æ
USER_ENTITY——ø  
)——  À
}——Ã Õ
)——Õ Œ
;——Œ œ
}
““ 
else
””  
{
‘‘ 
var
’’  #
resMSG
’’$ *
=
’’+ ,
await
’’- 2$
_dynamicMessageService
’’3 I
.
’’I J
Get
’’J M
(
’’M N
INVALID_PARAMETER
’’N _
)
’’_ `
;
’’` a
return
÷÷  &'
_iHttpsResponseRepository
÷÷' @
.
÷÷@ A
ReturnResult
÷÷A M
(
÷÷M N
APIStatusCode
÷÷N [
.
÷÷[ \
ERROR
÷÷\ a
,
÷÷a b
APIState
÷÷c k
.
÷÷k l
FAILED
÷÷l r
,
÷÷r s
null
÷÷t x
,
÷÷x y
new
÷÷z }
UserMessage÷÷~ â
(÷÷â ä
)÷÷ä ã
{÷÷å ç
messageContent÷÷é ú
=÷÷ù û
new÷÷ü ¢
MessageContent÷÷£ ±
{÷÷≤ ≥
messageType÷÷¥ ø
=÷÷¿ ¡
resMSG÷÷¬ »
.÷÷» …
messageType÷÷… ‘
,÷÷‘ ’
messageCode÷÷÷ ·
=÷÷‚ „
resMSG÷÷‰ Í
.÷÷Í Î
messageCode÷÷Î ˆ
,÷÷ˆ ˜
message÷÷¯ ˇ
=÷÷Ä Å
resMSG÷÷Ç à
.÷÷à â
message÷÷â ê
}÷÷ë í
}÷÷ì î
)÷÷î ï
;÷÷ï ñ
}
◊◊ 
}
ÿÿ 
var
ŸŸ 
	existsMSG
ŸŸ %
=
ŸŸ& '
await
ŸŸ( -$
_dynamicMessageService
ŸŸ. D
.
ŸŸD E
Get
ŸŸE H
(
ŸŸH I
ALREADY_EXISTS
ŸŸI W
)
ŸŸW X
;
ŸŸX Y
return
⁄⁄ '
_iHttpsResponseRepository
⁄⁄ 8
.
⁄⁄8 9
ReturnResult
⁄⁄9 E
(
⁄⁄E F
APIStatusCode
⁄⁄F S
.
⁄⁄S T
ERROR
⁄⁄T Y
,
⁄⁄Y Z
APIState
⁄⁄[ c
.
⁄⁄c d
FAILED
⁄⁄d j
,
⁄⁄j k
null
⁄⁄l p
,
⁄⁄p q
new
⁄⁄r u
UserMessage⁄⁄v Å
(⁄⁄Å Ç
)⁄⁄Ç É
{⁄⁄Ñ Ö
messageContent⁄⁄Ü î
=⁄⁄ï ñ
new⁄⁄ó ö
MessageContent⁄⁄õ ©
{⁄⁄™ ´
messageType⁄⁄¨ ∑
=⁄⁄∏ π
	existsMSG⁄⁄∫ √
.⁄⁄√ ƒ
messageType⁄⁄ƒ œ
,⁄⁄œ –
messageCode⁄⁄— ‹
=⁄⁄› ﬁ
	existsMSG⁄⁄ﬂ Ë
.⁄⁄Ë È
messageCode⁄⁄È Ù
,⁄⁄Ù ı
message⁄⁄ˆ ˝
=⁄⁄˛ ˇ
string⁄⁄Ä Ü
.⁄⁄Ü á
Format⁄⁄á ç
(⁄⁄ç é
	existsMSG⁄⁄é ó
.⁄⁄ó ò
message⁄⁄ò ü
,⁄⁄ü †
EMAIL⁄⁄° ¶
)⁄⁄¶ ß
}⁄⁄® ©
}⁄⁄™ ´
)⁄⁄´ ¨
;⁄⁄¨ ≠
}
€€ 
else
‹‹ 
{
›› 
if
ﬁﬁ 
(
ﬁﬁ 
	existUser
ﬁﬁ %
.
ﬁﬁ% &
	isDeleted
ﬁﬁ& /
)
ﬁﬁ/ 0
{
ﬂﬂ 
	existUser
‡‡ %
.
‡‡% &
UserName
‡‡& .
=
‡‡/ 0
model
‡‡1 6
.
‡‡6 7
Username
‡‡7 ?
;
‡‡? @
	existUser
·· %
.
··% &
Email
··& +
=
··, -
model
··. 3
.
··3 4
Email
··4 9
;
··9 :
	existUser
‚‚ %
.
‚‚% &!
passwordHashUpdated
‚‚& 9
=
‚‚: ;
true
‚‚< @
;
‚‚@ A
	existUser
„„ %
.
„„% &
	isDeleted
„„& /
=
„„0 1
false
„„2 7
;
„„7 8
var
ÂÂ 
result
ÂÂ  &
=
ÂÂ' (
await
ÂÂ) .
_userManager
ÂÂ/ ;
.
ÂÂ; <
UpdateAsync
ÂÂ< G
(
ÂÂG H
	existUser
ÂÂH Q
)
ÂÂQ R
;
ÂÂR S
var
ÊÊ 
token
ÊÊ  %
=
ÊÊ& '
await
ÊÊ( -
_userManager
ÊÊ. :
.
ÊÊ: ;-
GeneratePasswordResetTokenAsync
ÊÊ; Z
(
ÊÊZ [
	existUser
ÊÊ[ d
)
ÊÊd e
;
ÊÊe f
var
ÁÁ 

resultTest
ÁÁ  *
=
ÁÁ+ ,
await
ÁÁ- 2
_userManager
ÁÁ3 ?
.
ÁÁ? @ 
ResetPasswordAsync
ÁÁ@ R
(
ÁÁR S
	existUser
ÁÁS \
,
ÁÁ\ ]
token
ÁÁ^ c
,
ÁÁc d
model
ÁÁe j
.
ÁÁj k
Password
ÁÁk s
)
ÁÁs t
;
ÁÁt u
var
ËË "
userIdentityServerID
ËË  4
=
ËË5 6
	existUser
ËË7 @
.
ËË@ A
Id
ËËA C
;
ËËC D!
ClientUserMappingVM
ÎÎ /#
newClientUsersMapping
ÎÎ0 E
=
ÎÎF G
new
ÎÎH K!
ClientUserMappingVM
ÎÎL _
(
ÎÎ_ `
)
ÎÎ` a
{
ÏÏ 
ClientId
ÌÌ  (
=
ÌÌ) *
	CLIENT_ID
ÌÌ+ 4
,
ÌÌ4 5
UserId
ÓÓ  &
=
ÓÓ' ("
userIdentityServerID
ÓÓ) =
}
ÔÔ 
;
ÔÔ 
var
ÒÒ 
mappingSuccess
ÒÒ  .
=
ÒÒ/ 0
await
ÒÒ1 6
_iUserRepository
ÒÒ7 G
.
ÒÒG H
AddClientUserMap
ÒÒH X
(
ÒÒX Y#
newClientUsersMapping
ÒÒY n
)
ÒÒn o
;
ÒÒo p
var
ÚÚ 
	encryptId
ÚÚ  )
=
ÚÚ* +
CryptoJs
ÚÚ, 4
.
ÚÚ4 5
Encrypt
ÚÚ5 <
(
ÚÚ< ="
userIdentityServerID
ÚÚ= Q
)
ÚÚQ R
;
ÚÚR S
var
ÛÛ 
resObj
ÛÛ  &
=
ÛÛ' (
new
ÛÛ) ,
{
ÛÛ- .
userID
ÛÛ/ 5
=
ÛÛ6 7
	encryptId
ÛÛ8 A
}
ÛÛB C
;
ÛÛC D
var
ıı 
userResoteMSG
ıı  -
=
ıı. /
await
ıı0 5$
_dynamicMessageService
ıı6 L
.
ııL M
Get
ııM P
(
ııP Q!
FILE_FOLDER_RESTORE
ııQ d
)
ııd e
;
ııe f
return
ˆˆ "'
_iHttpsResponseRepository
ˆˆ# <
.
ˆˆ< =
ReturnResult
ˆˆ= I
(
ˆˆI J
APIStatusCode
ˆˆJ W
.
ˆˆW X
SUCCESS
ˆˆX _
,
ˆˆ_ `
APIState
ˆˆa i
.
ˆˆi j
SUCCESS
ˆˆj q
,
ˆˆq r
resObj
ˆˆs y
,
ˆˆy z
new
ˆˆ{ ~
UserMessageˆˆ ä
(ˆˆä ã
)ˆˆã å
{ˆˆç é
messageˆˆè ñ
=ˆˆó ò
stringˆˆô ü
.ˆˆü †
Formatˆˆ† ¶
(ˆˆ¶ ß
userResoteMSGˆˆß ¥
.ˆˆ¥ µ
messageˆˆµ º
,ˆˆº Ω
USER_ENTITYˆˆæ …
)ˆˆ…  
}ˆˆÀ Ã
)ˆˆÃ Õ
;ˆˆÕ Œ
}
˜˜ 
else
¯¯ 
{
˘˘ 
var
˙˙ 
	existsMSG
˙˙  )
=
˙˙* +
await
˙˙, 1$
_dynamicMessageService
˙˙2 H
.
˙˙H I
Get
˙˙I L
(
˙˙L M
ALREADY_EXISTS
˙˙M [
)
˙˙[ \
;
˙˙\ ]
return
˚˚ "'
_iHttpsResponseRepository
˚˚# <
.
˚˚< =
ReturnResult
˚˚= I
(
˚˚I J
APIStatusCode
˚˚J W
.
˚˚W X
ERROR
˚˚X ]
,
˚˚] ^
APIState
˚˚_ g
.
˚˚g h
FAILED
˚˚h n
,
˚˚n o
null
˚˚p t
,
˚˚t u
new
˚˚v y
UserMessage˚˚z Ö
(˚˚Ö Ü
)˚˚Ü á
{˚˚à â
messageContent˚˚ä ò
=˚˚ô ö
new˚˚õ û
MessageContent˚˚ü ≠
{˚˚Æ Ø
messageType˚˚∞ ª
=˚˚º Ω
	existsMSG˚˚æ «
.˚˚« »
messageType˚˚» ”
,˚˚” ‘
messageCode˚˚’ ‡
=˚˚· ‚
	existsMSG˚˚„ Ï
.˚˚Ï Ì
messageCode˚˚Ì ¯
,˚˚¯ ˘
message˚˚˙ Å
=˚˚Ç É
string˚˚Ñ ä
.˚˚ä ã
Format˚˚ã ë
(˚˚ë í
	existsMSG˚˚í õ
.˚˚õ ú
message˚˚ú £
,˚˚£ §
	existUser˚˚• Æ
.˚˚Æ Ø
UserName˚˚Ø ∑
==˚˚∏ ∫
model˚˚ª ¿
.˚˚¿ ¡
Username˚˚¡ …
?˚˚  À
	USER_NAME˚˚Ã ’
:˚˚÷ ◊
EMAIL˚˚ÿ ›
)˚˚› ﬁ
}˚˚ﬂ ‡
}˚˚· ‚
)˚˚‚ „
;˚˚„ ‰
}
¸¸ 
}
˝˝ 
}
˛˛ 
var
ˇˇ !
invalidParameterMSG
ˇˇ '
=
ˇˇ( )
await
ˇˇ* /$
_dynamicMessageService
ˇˇ0 F
.
ˇˇF G
Get
ˇˇG J
(
ˇˇJ K
INVALID_PARAMETER
ˇˇK \
)
ˇˇ\ ]
;
ˇˇ] ^
return
ÄÄ '
_iHttpsResponseRepository
ÄÄ 0
.
ÄÄ0 1
ReturnResult
ÄÄ1 =
(
ÄÄ= >
APIStatusCode
ÄÄ> K
.
ÄÄK L
ERROR
ÄÄL Q
,
ÄÄQ R
APIState
ÄÄS [
.
ÄÄ[ \
FAILED
ÄÄ\ b
,
ÄÄb c
null
ÄÄd h
,
ÄÄh i
new
ÄÄj m
UserMessage
ÄÄn y
(
ÄÄy z
)
ÄÄz {
{
ÄÄ| }
messageContentÄÄ~ å
=ÄÄç é
newÄÄè í
MessageContentÄÄì °
{ÄÄ¢ £
messageTypeÄÄ§ Ø
=ÄÄ∞ ±#
invalidParameterMSGÄÄ≤ ≈
.ÄÄ≈ ∆
messageTypeÄÄ∆ —
,ÄÄ— “
messageCodeÄÄ” ﬁ
=ÄÄﬂ ‡#
invalidParameterMSGÄÄ· Ù
.ÄÄÙ ı
messageCodeÄÄı Ä
,ÄÄÄ Å
messageÄÄÇ â
=ÄÄä ã#
invalidParameterMSGÄÄå ü
.ÄÄü †
messageÄÄ† ß
}ÄÄ® ©
}ÄÄ™ ´
)ÄÄ´ ¨
;ÄÄ¨ ≠
}
ÅÅ 
catch
ÇÇ 
(
ÇÇ 
	Exception
ÇÇ 
e
ÇÇ 
)
ÇÇ 
{
ÉÉ 
_logger
ÑÑ 
.
ÑÑ 
LogError
ÑÑ  
(
ÑÑ  !
e
ÑÑ! "
.
ÑÑ" #
ToString
ÑÑ# +
(
ÑÑ+ ,
)
ÑÑ, -
)
ÑÑ- .
;
ÑÑ. /
return
ÖÖ 
await
ÖÖ '
_iHttpsResponseRepository
ÖÖ 6
.
ÖÖ6 7%
ReturnExceptionResponse
ÖÖ7 N
(
ÖÖN O
e
ÖÖO P
)
ÖÖP Q
;
ÖÖQ R
}
ÜÜ 
}
áá 	
[
ââ 	
Route
ââ	 
(
ââ 
$str
ââ *
)
ââ* +
]
ââ+ ,
[
ää 	
HttpPost
ää	 
]
ää 
[
ãã 	
	Authorize
ãã	 
(
ãã #
AuthenticationSchemes
ãã (
=
ãã) *
JwtBearerDefaults
ãã+ <
.
ãã< ="
AuthenticationScheme
ãã= Q
)
ããQ R
]
ããR S
public
åå 
async
åå 
Task
åå 
<
åå 
IActionResult
åå '
>
åå' (

UpdateUser
åå) 3
(
åå3 4
[
åå4 5
FromBody
åå5 =
]
åå= >

RegisterVM
åå? I
model
ååJ O
)
ååO P
{
çç 	
if
éé 
(
éé 
model
éé 
==
éé 
null
éé 
)
éé 
{
èè 
return
êê '
_iHttpsResponseRepository
êê 0
.
êê0 1
ReturnResult
êê1 =
(
êê= >
APIStatusCode
êê> K
.
êêK L
ERROR
êêL Q
,
êêQ R
APIState
êêS [
.
êê[ \
FAILED
êê\ b
,
êêb c
null
êêd h
,
êêh i
null
êêj n
)
êên o
;
êêo p
}
ëë 
try
íí 
{
ìì 
var
îî 
user
îî 
=
îî 
await
îî  
_userManager
îî! -
.
îî- .
Users
îî. 3
.
îî3 4
Where
îî4 9
(
îî9 :
x
îî: ;
=>
îî< >
x
îî? @
.
îî@ A
UserName
îîA I
==
îîJ L
model
îîM R
.
îîR S
Username
îîS [
&&
îî\ ^
x
îî_ `
.
îî` a
	isDeleted
îîa j
==
îîk m
false
îîn s
)
îîs t
.
îît u"
FirstOrDefaultAsyncîîu à
(îîà â
)îîâ ä
;îîä ã
var
ïï 
token
ïï 
=
ïï 
await
ïï !
_userManager
ïï" .
.
ïï. /+
GenerateChangeEmailTokenAsync
ïï/ L
(
ïïL M
user
ïïM Q
,
ïïQ R
model
ïïS X
.
ïïX Y
Email
ïïY ^
)
ïï^ _
;
ïï_ `
var
ññ 
result
ññ 
=
ññ 
await
ññ "
_userManager
ññ# /
.
ññ/ 0
ChangeEmailAsync
ññ0 @
(
ññ@ A
user
ññA E
,
ññE F
model
ññG L
.
ññL M
Email
ññM R
,
ññR S
token
ññT Y
)
ññY Z
;
ññZ [
if
òò 
(
òò 
result
òò 
.
òò 
	Succeeded
òò $
)
òò$ %
{
ôô 
var
öö 

updatedMSG
öö "
=
öö# $
await
öö% *$
_dynamicMessageService
öö+ A
.
ööA B
Get
ööB E
(
ööE F
UPDATED
ööF M
)
ööM N
;
ööN O
return
õõ '
_iHttpsResponseRepository
õõ 4
.
õõ4 5
ReturnResult
õõ5 A
(
õõA B
APIStatusCode
õõB O
.
õõO P
SUCCESS
õõP W
,
õõW X
APIState
õõY a
.
õõa b
SUCCESS
õõb i
,
õõi j
null
õõk o
,
õõo p
new
õõq t
UserMessageõõu Ä
(õõÄ Å
)õõÅ Ç
{õõÉ Ñ
messageõõÖ å
=õõç é
stringõõè ï
.õõï ñ
Formatõõñ ú
(õõú ù

updatedMSGõõù ß
.õõß ®
messageõõ® Ø
,õõØ ∞
USER_ENTITYõõ± º
)õõº Ω
}õõæ ø
)õõø ¿
;õõ¿ ¡
}
úú 
var
ûû 
somethingWrongMSG
ûû %
=
ûû& '
await
ûû( -$
_dynamicMessageService
ûû. D
.
ûûD E
Get
ûûE H
(
ûûH I
SOMTHING_WRONG
ûûI W
)
ûûW X
;
ûûX Y
return
üü '
_iHttpsResponseRepository
üü 0
.
üü0 1
ReturnResult
üü1 =
(
üü= >
APIStatusCode
üü> K
.
üüK L
ERROR
üüL Q
,
üüQ R
APIState
üüS [
.
üü[ \
FAILED
üü\ b
,
üüb c
null
üüd h
,
üüh i
new
üüj m
UserMessage
üün y
(
üüy z
)
üüz {
{
üü| }
messageContentüü~ å
=üüç é
newüüè í
MessageContentüüì °
{üü¢ £
messageTypeüü§ Ø
=üü∞ ±!
somethingWrongMSGüü≤ √
.üü√ ƒ
messageTypeüüƒ œ
,üüœ –
messageCodeüü— ‹
=üü› ﬁ!
somethingWrongMSGüüﬂ 
.üü Ò
messageCodeüüÒ ¸
,üü¸ ˝
messageüü˛ Ö
=üüÜ á!
somethingWrongMSGüüà ô
.üüô ö
messageüüö °
}üü¢ £
}üü§ •
)üü• ¶
;üü¶ ß
}
°° 
catch
¢¢ 
(
¢¢ 
	Exception
¢¢ 
e
¢¢ 
)
¢¢ 
{
££ 
_logger
§§ 
.
§§ 
LogError
§§  
(
§§  !
e
§§! "
.
§§" #
ToString
§§# +
(
§§+ ,
)
§§, -
)
§§- .
;
§§. /
return
•• 
await
•• '
_iHttpsResponseRepository
•• 6
.
••6 7%
ReturnExceptionResponse
••7 N
(
••N O
e
••O P
)
••P Q
;
••Q R
}
¶¶ 
}
ßß 	
[
¨¨ 	
Route
¨¨	 
(
¨¨ 
$str
¨¨ *
)
¨¨* +
]
¨¨+ ,
[
≠≠ 	
HttpPost
≠≠	 
]
≠≠ 
[
ÆÆ 	
	Authorize
ÆÆ	 
(
ÆÆ #
AuthenticationSchemes
ÆÆ (
=
ÆÆ) *
JwtBearerDefaults
ÆÆ+ <
.
ÆÆ< ="
AuthenticationScheme
ÆÆ= Q
)
ÆÆQ R
]
ÆÆR S
public
ØØ 
async
ØØ 
Task
ØØ 
<
ØØ 
IActionResult
ØØ '
>
ØØ' (

RemoveUser
ØØ) 3
(
ØØ3 4
[
ØØ4 5
FromBody
ØØ5 =
]
ØØ= >
RemoveUserVM
ØØ? K
model
ØØL Q
)
ØØQ R
{
∞∞ 	
try
±± 
{
≤≤ 
if
≥≥ 
(
≥≥ 
!
≥≥ 

ModelState
≥≥ 
.
≥≥  
IsValid
≥≥  '
)
≥≥' (
{
¥¥ 
var
µµ !
invalidParameterMSG
µµ +
=
µµ, -
await
µµ. 3$
_dynamicMessageService
µµ4 J
.
µµJ K
Get
µµK N
(
µµN O
INVALID_PARAMETER
µµO `
)
µµ` a
;
µµa b
return
∂∂ '
_iHttpsResponseRepository
∂∂ 4
.
∂∂4 5
ReturnResult
∂∂5 A
(
∂∂A B
APIStatusCode
∂∂B O
.
∂∂O P
ERROR
∂∂P U
,
∂∂U V
APIState
∂∂W _
.
∂∂_ `
FAILED
∂∂` f
,
∂∂f g
null
∂∂h l
,
∂∂l m
new
∂∂n q
UserMessage
∂∂r }
(
∂∂} ~
)
∂∂~ 
{∂∂Ä Å
messageContent∂∂Ç ê
=∂∂ë í
new∂∂ì ñ
MessageContent∂∂ó •
{∂∂¶ ß
messageType∂∂® ≥
=∂∂¥ µ#
invalidParameterMSG∂∂∂ …
.∂∂…  
messageType∂∂  ’
,∂∂’ ÷
messageCode∂∂◊ ‚
=∂∂„ ‰#
invalidParameterMSG∂∂Â ¯
.∂∂¯ ˘
messageCode∂∂˘ Ñ
,∂∂Ñ Ö
message∂∂Ü ç
=∂∂é è#
invalidParameterMSG∂∂ê £
.∂∂£ §
message∂∂§ ´
}∂∂¨ ≠
}∂∂Æ Ø
)∂∂Ø ∞
;∂∂∞ ±
}
∑∑ 
var
∏∏ 
result
∏∏ 
=
∏∏ 
await
∏∏ "
_iUserRepository
∏∏# 3
.
∏∏3 4

RemoveUser
∏∏4 >
(
∏∏> ?
model
∏∏? D
.
∏∏D E
UserIds
∏∏E L
)
∏∏L M
;
∏∏M N
if
∫∫ 
(
∫∫ 
!
∫∫ 
result
∫∫ 
)
∫∫ 
{
ªª 
var
ºº 
somethingWrongMSG
ºº )
=
ºº* +
await
ºº, 1$
_dynamicMessageService
ºº2 H
.
ººH I
Get
ººI L
(
ººL M
SOMTHING_WRONG
ººM [
)
ºº[ \
;
ºº\ ]
return
ΩΩ '
_iHttpsResponseRepository
ΩΩ 4
.
ΩΩ4 5
ReturnResult
ΩΩ5 A
(
ΩΩA B
APIStatusCode
ΩΩB O
.
ΩΩO P
ERROR
ΩΩP U
,
ΩΩU V
APIState
ΩΩW _
.
ΩΩ_ `
FAILED
ΩΩ` f
,
ΩΩf g
null
ΩΩh l
,
ΩΩl m
new
ΩΩn q
UserMessage
ΩΩr }
(
ΩΩ} ~
)
ΩΩ~ 
{ΩΩÄ Å
messageContentΩΩÇ ê
=ΩΩë í
newΩΩì ñ
MessageContentΩΩó •
{ΩΩ¶ ß
messageTypeΩΩ® ≥
=ΩΩ¥ µ!
somethingWrongMSGΩΩ∂ «
.ΩΩ« »
messageTypeΩΩ» ”
,ΩΩ” ‘
messageCodeΩΩ’ ‡
=ΩΩ· ‚!
somethingWrongMSGΩΩ„ Ù
.ΩΩÙ ı
messageCodeΩΩı Ä
,ΩΩÄ Å
messageΩΩÇ â
=ΩΩä ã!
somethingWrongMSGΩΩå ù
.ΩΩù û
messageΩΩû •
}ΩΩ¶ ß
}ΩΩ® ©
)ΩΩ© ™
;ΩΩ™ ´
}
ææ 
var
øø 

deletedMSG
øø 
=
øø  
await
øø! &$
_dynamicMessageService
øø' =
.
øø= >
Get
øø> A
(
øøA B
DELETED
øøB I
)
øøI J
;
øøJ K
return
¿¿ '
_iHttpsResponseRepository
¿¿ 0
.
¿¿0 1
ReturnResult
¿¿1 =
(
¿¿= >
APIStatusCode
¿¿> K
.
¿¿K L
SUCCESS
¿¿L S
,
¿¿S T
APIState
¿¿U ]
.
¿¿] ^
SUCCESS
¿¿^ e
,
¿¿e f
null
¿¿g k
,
¿¿k l
new
¿¿m p
UserMessage
¿¿q |
(
¿¿| }
)
¿¿} ~
{¿¿ Ä
message¿¿Å à
=¿¿â ä
string¿¿ã ë
.¿¿ë í
Format¿¿í ò
(¿¿ò ô

deletedMSG¿¿ô £
.¿¿£ §
message¿¿§ ´
,¿¿´ ¨
USER_ENTITY¿¿≠ ∏
)¿¿∏ π
}¿¿∫ ª
)¿¿ª º
;¿¿º Ω
}
¡¡ 
catch
¬¬ 
(
¬¬ 
	Exception
¬¬ 
e
¬¬ 
)
¬¬ 
{
√√ 
_logger
ƒƒ 
.
ƒƒ 
LogError
ƒƒ  
(
ƒƒ  !
e
ƒƒ! "
.
ƒƒ" #
ToString
ƒƒ# +
(
ƒƒ+ ,
)
ƒƒ, -
)
ƒƒ- .
;
ƒƒ. /
return
≈≈ 
await
≈≈ '
_iHttpsResponseRepository
≈≈ 6
.
≈≈6 7%
ReturnExceptionResponse
≈≈7 N
(
≈≈N O
e
≈≈O P
)
≈≈P Q
;
≈≈Q R
}
∆∆ 
}
«« 	
public
”” 
async
”” 
Task
”” 
<
”” 

ResponseVM
”” $
>
””$ %
SendMailTemplate
””& 6
(
””6 7
MailTemplateVM
””7 E
mailTemplateVM
””F T
)
””T U
{
‘‘ 	
try
’’ 
{
÷÷ 
	Agreement
◊◊ 
	agreement
◊◊ #
=
◊◊$ %
await
◊◊& +
_fjtDBContext
◊◊, 9
.
◊◊9 :
	Agreement
◊◊: C
.
◊◊C D
Where
◊◊D I
(
◊◊I J
x
◊◊J K
=>
◊◊L N
x
◊◊O P
.
◊◊P Q
agreementTypeID
◊◊Q `
==
◊◊a c
mailTemplateVM
◊◊d r
.
◊◊r s
AgreementTypeID◊◊s Ç
&&◊◊É Ö
x◊◊Ü á
.◊◊á à
isPublished◊◊à ì
==◊◊î ñ
true◊◊ó õ
&&◊◊ú û
x◊◊ü †
.◊◊† °
	isDeleted◊◊° ™
==◊◊´ ≠
false◊◊Æ ≥
)◊◊≥ ¥
.◊◊¥ µ!
OrderByDescending◊◊µ ∆
(◊◊∆ «
x◊◊« »
=>◊◊… À
x◊◊Ã Õ
.◊◊Õ Œ
version◊◊Œ ’
)◊◊’ ÷
.◊◊÷ ◊#
FirstOrDefaultAsync◊◊◊ Í
(◊◊Í Î
)◊◊Î Ï
;◊◊Ï Ì
if
ÿÿ 
(
ÿÿ 
	agreement
ÿÿ 
==
ÿÿ  
null
ÿÿ! %
)
ÿÿ% &
{
ŸŸ 
var
⁄⁄ 
notFoundMSG
⁄⁄ #
=
⁄⁄$ %
await
⁄⁄& +$
_dynamicMessageService
⁄⁄, B
.
⁄⁄B C
Get
⁄⁄C F
(
⁄⁄F G
	NOT_FOUND
⁄⁄G P
)
⁄⁄P Q
;
⁄⁄Q R
return
€€ 
new
€€ 

ResponseVM
€€ )
(
€€) *
)
€€* +
{
€€, -
status
€€. 4
=
€€5 6
State
€€7 <
.
€€< =
FAILED
€€= C
.
€€C D
ToString
€€D L
(
€€L M
)
€€M N
,
€€N O
message
€€P W
=
€€X Y
string
€€Z `
.
€€` a
Format
€€a g
(
€€g h
notFoundMSG
€€h s
.
€€s t
message
€€t {
,
€€{ |
AGREEMENT_ENTITY€€} ç
)€€ç é
}€€è ê
;€€ê ë
}
‹‹ 
var
›› 
companyLogo
›› 
=
››  !
await
››" '
_fjtDBContext
››( 5
.
››5 6!
Systemconfigrations
››6 I
.
››I J
Where
››J O
(
››O P
x
››P Q
=>
››R T
x
››U V
.
››V W
key
››W Z
==
››[ ]
COMPANY_LOGO_KEY
››^ n
)
››n o
.
››o p
Select
››p v
(
››v w
x
››w x
=>
››y {
x
››| }
.
››} ~
values››~ Ñ
)››Ñ Ö
.››Ö Ü#
FirstOrDefaultAsync››Ü ô
(››ô ö
)››ö õ
;››õ ú
var
ﬂﬂ 
mailBody
ﬂﬂ 
=
ﬂﬂ 
	agreement
ﬂﬂ (
.
ﬂﬂ( )
agreementContent
ﬂﬂ) 9
.
ﬂﬂ9 :
Replace
ﬂﬂ: A
(
ﬂﬂA B.
 SYSTEM_VARIABLE_USERNAME_HTMLTAG
ﬂﬂB b
,
ﬂﬂb c
mailTemplateVM
ﬂﬂd r
.
ﬂﬂr s
UserName
ﬂﬂs {
)
ﬂﬂ{ |
.
‡‡ 
Replace
‡‡ 
(
‡‡ 1
#SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG
‡‡ @
,
‡‡@ A
COMPANY_NAME
‡‡B N
)
‡‡N O
.
·· 
Replace
·· 
(
·· -
SYSTEM_VARIABLE_LINKURL_HTMLTAG
·· <
,
··< =
mailTemplateVM
··> L
.
··L M
LinkURL
··M T
)
··T U
.
‚‚ 
Replace
‚‚ 
(
‚‚ 1
#SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG
‚‚ @
,
‚‚@ A
companyLogo
‚‚B M
)
‚‚M N
.
„„ 
Replace
„„ 
(
„„ 2
$SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG
„„ A
,
„„A B
mailTemplateVM
„„C Q
.
„„Q R
AssemblyName
„„R ^
)
„„^ _
.
‰‰ 
Replace
‰‰ 
(
‰‰ 9
+SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG
‰‰ H
,
‰‰H I
mailTemplateVM
‰‰J X
.
‰‰X Y!
CustomerCompanyName
‰‰Y l
)
‰‰l m
;
‰‰m n
var
ÊÊ 
mailSubject
ÊÊ 
=
ÊÊ  !
	agreement
ÊÊ" +
.
ÊÊ+ ,
agreementSubject
ÊÊ, <
.
ÊÊ< =
Replace
ÊÊ= D
(
ÊÊD E.
 SYSTEM_VARIABLE_USERNAME_HTMLTAG
ÊÊE e
,
ÊÊe f
mailTemplateVM
ÊÊg u
.
ÊÊu v
UserName
ÊÊv ~
)
ÊÊ~ 
.
ÁÁ 
Replace
ÁÁ 
(
ÁÁ 1
#SYSTEM_VARIABLE_COMPANYNAME_HTMLTAG
ÁÁ @
,
ÁÁ@ A
COMPANY_NAME
ÁÁB N
)
ÁÁN O
.
ËË 
Replace
ËË 
(
ËË -
SYSTEM_VARIABLE_LINKURL_HTMLTAG
ËË <
,
ËË< =
mailTemplateVM
ËË> L
.
ËËL M
LinkURL
ËËM T
)
ËËT U
.
ÈÈ 
Replace
ÈÈ 
(
ÈÈ 1
#SYSTEM_VARIABLE_COMPANYLOGO_HTMLTAG
ÈÈ @
,
ÈÈ@ A
companyLogo
ÈÈB M
)
ÈÈM N
.
ÍÍ 
Replace
ÍÍ 
(
ÍÍ 2
$SYSTEM_VARIABLE_ASSEMBLYNAME_HTMLTAG
ÍÍ A
,
ÍÍA B
mailTemplateVM
ÍÍC Q
.
ÍÍQ R
AssemblyName
ÍÍR ^
)
ÍÍ^ _
.
ÎÎ 
Replace
ÎÎ 
(
ÎÎ 9
+SYSTEM_VARIABLE_CUSTOMERCOMPANYNAME_HTMLTAG
ÎÎ H
,
ÎÎH I
mailTemplateVM
ÎÎJ X
.
ÎÎX Y!
CustomerCompanyName
ÎÎY l
)
ÎÎl m
;
ÎÎm n
foreach
ÌÌ 
(
ÌÌ 
var
ÌÌ 
email
ÌÌ "
in
ÌÌ# %
mailTemplateVM
ÌÌ& 4
.
ÌÌ4 5!
ToSendEmailsAddress
ÌÌ5 H
)
ÌÌH I
{
ÓÓ 
SendEmailModel
ÔÔ "

emailModel
ÔÔ# -
=
ÔÔ. /
new
ÔÔ0 3
SendEmailModel
ÔÔ4 B
(
ÔÔB C
)
ÔÔC D
{
 
To
ÒÒ 
=
ÒÒ 
email
ÒÒ "
,
ÒÒ" #
Subject
ÚÚ 
=
ÚÚ  !
mailSubject
ÚÚ" -
,
ÚÚ- .
Body
ÛÛ 
=
ÛÛ 
mailBody
ÛÛ '
,
ÛÛ' (
CC
ÙÙ 
=
ÙÙ 
mailTemplateVM
ÙÙ +
.
ÙÙ+ ,
CC
ÙÙ, .
,
ÙÙ. /
BCC
ıı 
=
ıı 
mailTemplateVM
ıı ,
.
ıı, -
BCC
ıı- 0
}
ˆˆ 
;
ˆˆ 
_emailService
˜˜ !
.
˜˜! "
	SendEmail
˜˜" +
(
˜˜+ ,

emailModel
˜˜, 6
)
˜˜6 7
;
˜˜7 8
}
¯¯ 
return
˙˙ 
new
˙˙ 

ResponseVM
˙˙ %
(
˙˙% &
)
˙˙& '
{
˙˙( )
status
˙˙* 0
=
˙˙1 2
State
˙˙3 8
.
˙˙8 9
SUCCESS
˙˙9 @
.
˙˙@ A
ToString
˙˙A I
(
˙˙I J
)
˙˙J K
}
˙˙L M
;
˙˙M N
}
˚˚ 
catch
¸¸ 
(
¸¸ 
	Exception
¸¸ 
e
¸¸ 
)
¸¸ 
{
˝˝ 
_logger
˛˛ 
.
˛˛ 
LogError
˛˛  
(
˛˛  !
e
˛˛! "
.
˛˛" #
ToString
˛˛# +
(
˛˛+ ,
)
˛˛, -
)
˛˛- .
;
˛˛. /
return
ÄÄ 
new
ÄÄ 

ResponseVM
ÄÄ %
(
ÄÄ% &
)
ÄÄ& '
{
ÄÄ( )
status
ÄÄ* 0
=
ÄÄ1 2
State
ÄÄ3 8
.
ÄÄ8 9
FAILED
ÄÄ9 ?
.
ÄÄ? @
ToString
ÄÄ@ H
(
ÄÄH I
)
ÄÄI J
,
ÄÄJ K
message
ÄÄL S
=
ÄÄT U
e
ÄÄV W
.
ÄÄW X
Message
ÄÄX _
}
ÄÄ` a
;
ÄÄa b
}
ÅÅ 
}
ÇÇ 	
private
ÑÑ 
async
ÑÑ 
Task
ÑÑ 
<
ÑÑ 
LoginViewModel
ÑÑ )
>
ÑÑ) *&
BuildLoginViewModelAsync
ÑÑ+ C
(
ÑÑC D
string
ÑÑD J
	returnUrl
ÑÑK T
)
ÑÑT U
{
ÖÖ 	
var
ÜÜ 
context
ÜÜ 
=
ÜÜ 
await
ÜÜ 
_interaction
ÜÜ  ,
.
ÜÜ, -*
GetAuthorizationContextAsync
ÜÜ- I
(
ÜÜI J
	returnUrl
ÜÜJ S
)
ÜÜS T
;
ÜÜT U
if
áá 
(
áá 
context
áá 
?
áá 
.
áá 
IdP
áá 
!=
áá 
null
áá  $
)
áá$ %
{
àà 
return
ää 
new
ää 
LoginViewModel
ää )
{
ãã 
EnableLocalLogin
åå $
=
åå% &
false
åå' ,
,
åå, -
	ReturnUrl
çç 
=
çç 
	returnUrl
çç  )
,
çç) *
Username
éé 
=
éé 
context
éé &
?
éé& '
.
éé' (
	LoginHint
éé( 1
,
éé1 2
ExternalProviders
èè %
=
èè& '
new
èè( +
ExternalProvider
èè, <
[
èè< =
]
èè= >
{
èè? @
new
èèA D
ExternalProvider
èèE U
{
èèV W"
AuthenticationScheme
èèX l
=
èèm n
context
èèo v
.
èèv w
IdP
èèw z
}
èè{ |
}
èè} ~
}
êê 
;
êê 
}
ëë 
var
ìì 
schemes
ìì 
=
ìì 
await
ìì 
_schemeProvider
ìì  /
.
ìì/ 0 
GetAllSchemesAsync
ìì0 B
(
ììB C
)
ììC D
;
ììD E
var
ïï 
	providers
ïï 
=
ïï 
schemes
ïï #
.
ññ 
Where
ññ 
(
ññ 
x
ññ 
=>
ññ 
x
ññ 
.
ññ 
DisplayName
ññ )
!=
ññ* ,
null
ññ- 1
||
ññ2 4
(
óó 
x
óó 
.
óó 
Name
óó #
.
óó# $
Equals
óó$ *
(
óó* +
AccountOptions
óó+ 9
.
óó9 :-
WindowsAuthenticationSchemeName
óó: Y
,
óóY Z
StringComparison
óó[ k
.
óók l
OrdinalIgnoreCase
óól }
)
óó} ~
)
óó~ 
)
òò 
.
ôô 
Select
ôô 
(
ôô 
x
ôô 
=>
ôô 
new
ôô  
ExternalProvider
ôô! 1
{
öö 
DisplayName
õõ 
=
õõ  !
x
õõ" #
.
õõ# $
DisplayName
õõ$ /
,
õõ/ 0"
AuthenticationScheme
úú (
=
úú) *
x
úú+ ,
.
úú, -
Name
úú- 1
}
ùù 
)
ùù 
.
ùù 
ToList
ùù 
(
ùù 
)
ùù 
;
ùù 
var
üü 

allowLocal
üü 
=
üü 
true
üü !
;
üü! "
if
†† 
(
†† 
context
†† 
?
†† 
.
†† 
Client
†† 
.
††  
ClientId
††  (
!=
††) +
null
††, 0
)
††0 1
{
°° 
var
¢¢ 
client
¢¢ 
=
¢¢ 
await
¢¢ "
_clientStore
¢¢# /
.
¢¢/ 0(
FindEnabledClientByIdAsync
¢¢0 J
(
¢¢J K
context
¢¢K R
.
¢¢R S
Client
¢¢S Y
.
¢¢Y Z
ClientId
¢¢Z b
)
¢¢b c
;
¢¢c d
if
££ 
(
££ 
client
££ 
!=
££ 
null
££ "
)
££" #
{
§§ 

allowLocal
•• 
=
••  
client
••! '
.
••' (
EnableLocalLogin
••( 8
;
••8 9
if
ßß 
(
ßß 
client
ßß 
.
ßß *
IdentityProviderRestrictions
ßß ;
!=
ßß< >
null
ßß? C
&&
ßßD F
client
ßßG M
.
ßßM N*
IdentityProviderRestrictions
ßßN j
.
ßßj k
Any
ßßk n
(
ßßn o
)
ßßo p
)
ßßp q
{
®® 
	providers
©© !
=
©©" #
	providers
©©$ -
.
©©- .
Where
©©. 3
(
©©3 4
provider
©©4 <
=>
©©= ?
client
©©@ F
.
©©F G*
IdentityProviderRestrictions
©©G c
.
©©c d
Contains
©©d l
(
©©l m
provider
©©m u
.
©©u v#
AuthenticationScheme©©v ä
)©©ä ã
)©©ã å
.©©å ç
ToList©©ç ì
(©©ì î
)©©î ï
;©©ï ñ
}
™™ 
}
´´ 
}
¨¨ 
return
ÆÆ 
new
ÆÆ 
LoginViewModel
ÆÆ %
{
ØØ  
AllowRememberLogin
∞∞ "
=
∞∞# $
AccountOptions
∞∞% 3
.
∞∞3 4 
AllowRememberLogin
∞∞4 F
,
∞∞F G
EnableLocalLogin
±±  
=
±±! "

allowLocal
±±# -
&&
±±. 0
AccountOptions
±±1 ?
.
±±? @
AllowLocalLogin
±±@ O
,
±±O P
	ReturnUrl
≤≤ 
=
≤≤ 
	returnUrl
≤≤ %
,
≤≤% &
Username
≥≥ 
=
≥≥ 
context
≥≥ "
?
≥≥" #
.
≥≥# $
	LoginHint
≥≥$ -
,
≥≥- .
ExternalProviders
¥¥ !
=
¥¥" #
	providers
¥¥$ -
.
¥¥- .
ToArray
¥¥. 5
(
¥¥5 6
)
¥¥6 7
}
µµ 
;
µµ 
}
∂∂ 	
private
∏∏ 
async
∏∏ 
Task
∏∏ 
<
∏∏ 
LoginViewModel
∏∏ )
>
∏∏) *&
BuildLoginViewModelAsync
∏∏+ C
(
∏∏C D
LoginInputModel
∏∏D S
model
∏∏T Y
)
∏∏Y Z
{
ππ 	
var
∫∫ 
vm
∫∫ 
=
∫∫ 
await
∫∫ &
BuildLoginViewModelAsync
∫∫ 3
(
∫∫3 4
model
∫∫4 9
.
∫∫9 :
	ReturnUrl
∫∫: C
)
∫∫C D
;
∫∫D E
vm
ªª 
.
ªª 
Username
ªª 
=
ªª 
model
ªª 
.
ªª  
Username
ªª  (
;
ªª( )
vm
ºº 
.
ºº 
RememberLogin
ºº 
=
ºº 
model
ºº $
.
ºº$ %
RememberLogin
ºº% 2
;
ºº2 3
if
ΩΩ 
(
ΩΩ 
model
ΩΩ 
.
ΩΩ &
ShowAcceptAgreementPopUp
ΩΩ .
)
ΩΩ. /
{
ææ 
vm
øø 
.
øø &
ShowAcceptAgreementPopUp
øø +
=
øø, -
model
øø. 3
.
øø3 4&
ShowAcceptAgreementPopUp
øø4 L
;
øøL M
vm
¿¿ 
.
¿¿ 
Password
¿¿ 
=
¿¿ 
model
¿¿ #
.
¿¿# $
Password
¿¿$ ,
;
¿¿, -
vm
¡¡ 
.
¡¡ 
Version
¡¡ 
=
¡¡ 
_version
¡¡ %
;
¡¡% &
vm
¬¬ 
.
¬¬ 
AgreementContent
¬¬ #
=
¬¬$ %
_agreementContent
¬¬& 7
;
¬¬7 8
vm
√√ 
.
√√ 
	Effective
√√ 
=
√√ 

_effective
√√ )
;
√√) *
}
ƒƒ 
return
≈≈ 
vm
≈≈ 
;
≈≈ 
}
∆∆ 	
private
»» 
async
»» 
Task
»» 
<
»» 
LogoutViewModel
»» *
>
»»* +'
BuildLogoutViewModelAsync
»», E
(
»»E F
string
»»F L
logoutId
»»M U
)
»»U V
{
…… 	
var
   
vm
   
=
   
new
   
LogoutViewModel
   (
{
  ) *
LogoutId
  + 3
=
  4 5
logoutId
  6 >
,
  > ?
ShowLogoutPrompt
  @ P
=
  Q R
AccountOptions
  S a
.
  a b
ShowLogoutPrompt
  b r
}
  s t
;
  t u
if
ÃÃ 
(
ÃÃ 
User
ÃÃ 
?
ÃÃ 
.
ÃÃ 
Identity
ÃÃ 
.
ÃÃ 
IsAuthenticated
ÃÃ .
!=
ÃÃ/ 1
true
ÃÃ2 6
)
ÃÃ6 7
{
ÕÕ 
vm
œœ 
.
œœ 
ShowLogoutPrompt
œœ #
=
œœ$ %
false
œœ& +
;
œœ+ ,
return
–– 
vm
–– 
;
–– 
}
—— 
var
”” 
context
”” 
=
”” 
await
”” 
_interaction
””  ,
.
””, -#
GetLogoutContextAsync
””- B
(
””B C
logoutId
””C K
)
””K L
;
””L M
if
‘‘ 
(
‘‘ 
context
‘‘ 
?
‘‘ 
.
‘‘ 
ShowSignoutPrompt
‘‘ *
==
‘‘+ -
false
‘‘. 3
)
‘‘3 4
{
’’ 
vm
◊◊ 
.
◊◊ 
ShowLogoutPrompt
◊◊ #
=
◊◊$ %
false
◊◊& +
;
◊◊+ ,
return
ÿÿ 
vm
ÿÿ 
;
ÿÿ 
}
ŸŸ 
return
›› 
vm
›› 
;
›› 
}
ﬁﬁ 	
private
‡‡ 
async
‡‡ 
Task
‡‡ 
<
‡‡  
LoggedOutViewModel
‡‡ -
>
‡‡- .*
BuildLoggedOutViewModelAsync
‡‡/ K
(
‡‡K L
string
‡‡L R
logoutId
‡‡S [
)
‡‡[ \
{
·· 	
var
„„ 
logout
„„ 
=
„„ 
await
„„ 
_interaction
„„ +
.
„„+ ,#
GetLogoutContextAsync
„„, A
(
„„A B
logoutId
„„B J
)
„„J K
;
„„K L
var
ÂÂ 
vm
ÂÂ 
=
ÂÂ 
new
ÂÂ  
LoggedOutViewModel
ÂÂ +
{
ÊÊ +
AutomaticRedirectAfterSignOut
ÁÁ -
=
ÁÁ. /
AccountOptions
ÁÁ0 >
.
ÁÁ> ?+
AutomaticRedirectAfterSignOut
ÁÁ? \
,
ÁÁ\ ]#
PostLogoutRedirectUri
ËË %
=
ËË& '
logout
ËË( .
?
ËË. /
.
ËË/ 0#
PostLogoutRedirectUri
ËË0 E
,
ËËE F

ClientName
ÈÈ 
=
ÈÈ 
string
ÈÈ #
.
ÈÈ# $
IsNullOrEmpty
ÈÈ$ 1
(
ÈÈ1 2
logout
ÈÈ2 8
?
ÈÈ8 9
.
ÈÈ9 :

ClientName
ÈÈ: D
)
ÈÈD E
?
ÈÈF G
logout
ÈÈH N
?
ÈÈN O
.
ÈÈO P
ClientId
ÈÈP X
:
ÈÈY Z
logout
ÈÈ[ a
?
ÈÈa b
.
ÈÈb c

ClientName
ÈÈc m
,
ÈÈm n
SignOutIframeUrl
ÍÍ  
=
ÍÍ! "
logout
ÍÍ# )
?
ÍÍ) *
.
ÍÍ* +
SignOutIFrameUrl
ÍÍ+ ;
,
ÍÍ; <
LogoutId
ÎÎ 
=
ÎÎ 
logoutId
ÎÎ #
}
ÏÏ 
;
ÏÏ 
if
ÓÓ 
(
ÓÓ 
User
ÓÓ 
?
ÓÓ 
.
ÓÓ 
Identity
ÓÓ 
.
ÓÓ 
IsAuthenticated
ÓÓ .
==
ÓÓ/ 1
true
ÓÓ2 6
)
ÓÓ6 7
{
ÔÔ 
var
 
idp
 
=
 
User
 
.
 
	FindFirst
 (
(
( )
JwtClaimTypes
) 6
.
6 7
IdentityProvider
7 G
)
G H
?
H I
.
I J
Value
J O
;
O P
if
ÒÒ 
(
ÒÒ 
idp
ÒÒ 
!=
ÒÒ 
null
ÒÒ 
&&
ÒÒ  "
idp
ÒÒ# &
!=
ÒÒ' )
IdentityServer4
ÒÒ* 9
.
ÒÒ9 :%
IdentityServerConstants
ÒÒ: Q
.
ÒÒQ R#
LocalIdentityProvider
ÒÒR g
)
ÒÒg h
{
ÚÚ 
var
ÛÛ %
providerSupportsSignout
ÛÛ /
=
ÛÛ0 1
await
ÛÛ2 7
HttpContext
ÛÛ8 C
.
ÛÛC D+
GetSchemeSupportsSignOutAsync
ÛÛD a
(
ÛÛa b
idp
ÛÛb e
)
ÛÛe f
;
ÛÛf g
if
ÙÙ 
(
ÙÙ %
providerSupportsSignout
ÙÙ /
)
ÙÙ/ 0
{
ıı 
if
ˆˆ 
(
ˆˆ 
vm
ˆˆ 
.
ˆˆ 
LogoutId
ˆˆ '
==
ˆˆ( *
null
ˆˆ+ /
)
ˆˆ/ 0
{
˜˜ 
vm
˚˚ 
.
˚˚ 
LogoutId
˚˚ '
=
˚˚( )
await
˚˚* /
_interaction
˚˚0 <
.
˚˚< =&
CreateLogoutContextAsync
˚˚= U
(
˚˚U V
)
˚˚V W
;
˚˚W X
}
¸¸ 
vm
˛˛ 
.
˛˛ *
ExternalAuthenticationScheme
˛˛ 7
=
˛˛8 9
idp
˛˛: =
;
˛˛= >
}
ˇˇ 
}
ÄÄ 
}
ÅÅ 
return
ÉÉ 
vm
ÉÉ 
;
ÉÉ 
}
ÑÑ 	
public
ãã 
async
ãã 
Task
ãã 
<
ãã 
int
ãã 
>
ãã +
GetLetestPublishedAgreementId
ãã <
(
ãã< =
int
ãã= @
agreementTypeID
ããA P
)
ããP Q
{
åå 	
int
çç (
letestPublishedAgreementId
çç *
=
çç+ ,
await
çç- 2
_fjtDBContext
çç3 @
.
çç@ A
	Agreement
ççA J
.
ççJ K
Where
ççK P
(
ççP Q
x
ççQ R
=>
ççS U
x
ççV W
.
ççW X
agreementTypeID
ççX g
==
ççh j
agreementTypeID
ççk z
&&
çç{ }
x
çç~ 
.çç Ä
isPublishedççÄ ã
==ççå é
trueççè ì
&&ççî ñ
xççó ò
.ççò ô
	isDeletedççô ¢
==çç£ •
falseçç¶ ´
)çç´ ¨
.çç¨ ≠!
OrderByDescendingçç≠ æ
(ççæ ø
xççø ¿
=>çç¡ √
xççƒ ≈
.çç≈ ∆
versionçç∆ Õ
)ççÕ Œ
.ççŒ œ
Selectççœ ’
(çç’ ÷
xçç÷ ◊
=>ççÿ ⁄
xçç€ ‹
.çç‹ ›
agreementIDçç› Ë
)ççË È
.ççÈ Í#
FirstOrDefaultAsyncççÍ ˝
(çç˝ ˛
)çç˛ ˇ
;ççˇ Ä
return
éé (
letestPublishedAgreementId
éé -
;
éé- .
}
èè 	
public
ññ 
async
ññ 
Task
ññ 
<
ññ 
	Agreement
ññ #
>
ññ# $+
RetrivePublishedAgreementById
ññ% B
(
ññB C
int
ññC F
agreementID
ññG R
)
ññR S
{
óó 	
try
òò 
{
ôô 
	Agreement
öö 
	agreement
öö #
=
öö$ %
await
öö& +
_fjtDBContext
öö, 9
.
öö9 :
	Agreement
öö: C
.
ööC D
Where
ööD I
(
ööI J
x
ööJ K
=>
ööL N
x
ööO P
.
ööP Q
agreementID
ööQ \
==
öö] _
agreementID
öö` k
)
öök l
.
ööl m"
FirstOrDefaultAsyncööm Ä
(ööÄ Å
)ööÅ Ç
;ööÇ É
if
õõ 
(
õõ 
!
õõ 
string
õõ 
.
õõ 
IsNullOrEmpty
õõ )
(
õõ) *
	agreement
õõ* 3
.
õõ3 4
agreementContent
õõ4 D
)
õõD E
)
õõE F
{
úú 
	agreement
ùù 
.
ùù 
agreementContent
ùù .
=
ùù/ 0$
_textAngularValueForDB
ùù1 G
.
ùùG H&
GetTextAngularValueForDB
ùùH `
(
ùù` a
	agreement
ùùa j
.
ùùj k
agreementContent
ùùk {
)
ùù{ |
;
ùù| }
if
ûû 
(
ûû 
	agreement
ûû !
.
ûû! "
agreementContent
ûû" 2
==
ûû3 5
null
ûû6 :
)
ûû: ;
{
üü 
return
†† 
new
†† "
	Agreement
††# ,
(
††, -
)
††- .
{
††/ 0
}
††1 2
;
††2 3
}
°° 
}
¢¢ 
if
££ 
(
££ 
!
££ 
string
££ 
.
££ 
IsNullOrEmpty
££ )
(
££) *
	agreement
££* 3
.
££3 4
agreementSubject
££4 D
)
££D E
)
££E F
{
§§ 
	agreement
•• 
.
•• 
agreementSubject
•• .
=
••/ 0$
_textAngularValueForDB
••1 G
.
••G H&
GetTextAngularValueForDB
••H `
(
••` a
	agreement
••a j
.
••j k
agreementSubject
••k {
)
••{ |
;
••| }
if
¶¶ 
(
¶¶ 
	agreement
¶¶ !
.
¶¶! "
agreementSubject
¶¶" 2
==
¶¶3 5
null
¶¶6 :
)
¶¶: ;
{
ßß 
return
®® 
new
®® "
	Agreement
®®# ,
(
®®, -
)
®®- .
{
®®/ 0
}
®®1 2
;
®®2 3
}
©© 
}
™™ 
return
´´ 
	agreement
´´  
;
´´  !
}
¨¨ 
catch
≠≠ 
(
≠≠ 
	Exception
≠≠ 
e
≠≠ 
)
≠≠ 
{
ÆÆ 
_logger
ØØ 
.
ØØ 
LogError
ØØ  
(
ØØ  !
e
ØØ! "
.
ØØ" #
ToString
ØØ# +
(
ØØ+ ,
)
ØØ, -
)
ØØ- .
;
ØØ. /
return
∞∞ 
new
∞∞ 
	Agreement
∞∞ $
(
∞∞$ %
)
∞∞% &
{
∞∞' (
}
∞∞) *
;
∞∞* +
}
±± 
}
≤≤ 	
[
¥¥ 	
Route
¥¥	 
(
¥¥ 
$str
¥¥ *
)
¥¥* +
]
¥¥+ ,
[
µµ 	
	Authorize
µµ	 
(
µµ #
AuthenticationSchemes
µµ (
=
µµ) *
JwtBearerDefaults
µµ+ <
.
µµ< ="
AuthenticationScheme
µµ= Q
)
µµQ R
]
µµR S
[
∂∂ 	
HttpPost
∂∂	 
]
∂∂ 
public
∑∑ 
async
∑∑ 
Task
∑∑ 
<
∑∑ 
IActionResult
∑∑ '
>
∑∑' (
ValidatePassword
∑∑) 9
(
∑∑9 :
[
∑∑: ;
FromBody
∑∑; C
]
∑∑C D.
 RequestUseridPasswordParameterVM
∑∑E e
model
∑∑f k
)
∑∑k l
{
∏∏ 	
if
ππ 
(
ππ 
model
ππ 
==
ππ 
null
ππ 
)
ππ 
{
∫∫ 
var
ªª !
invalidParameterMSG
ªª '
=
ªª( )
await
ªª* /$
_dynamicMessageService
ªª0 F
.
ªªF G
Get
ªªG J
(
ªªJ K
INVALID_PARAMETER
ªªK \
)
ªª\ ]
;
ªª] ^
return
ºº '
_iHttpsResponseRepository
ºº 0
.
ºº0 1
ReturnResult
ºº1 =
(
ºº= >
APIStatusCode
ºº> K
.
ººK L
ERROR
ººL Q
,
ººQ R
APIState
ººS [
.
ºº[ \
FAILED
ºº\ b
,
ººb c
null
ººd h
,
ººh i
new
ººj m
UserMessage
ººn y
(
ººy z
)
ººz {
{
ºº| }
messageContentºº~ å
=ººç é
newººè í
MessageContentººì °
{ºº¢ £
messageTypeºº§ Ø
=ºº∞ ±#
invalidParameterMSGºº≤ ≈
.ºº≈ ∆
messageTypeºº∆ —
,ºº— “
messageCodeºº” ﬁ
=ººﬂ ‡#
invalidParameterMSGºº· Ù
.ººÙ ı
messageCodeººı Ä
,ººÄ Å
messageººÇ â
=ººä ã#
invalidParameterMSGººå ü
.ººü †
messageºº† ß
}ºº® ©
}ºº™ ´
)ºº´ ¨
;ºº¨ ≠
}
ΩΩ 
try
ææ 
{
øø 
bool
¿¿ 
isMatchPassword
¿¿ $
=
¿¿% &
false
¿¿' ,
;
¿¿, -
var
¡¡ 
userId
¡¡ 
=
¡¡ 
CryptoJs
¡¡ %
.
¡¡% &
DecryptStringAES
¡¡& 6
(
¡¡6 7
model
¡¡7 <
.
¡¡< =
userId
¡¡= C
)
¡¡C D
;
¡¡D E
var
¬¬ 
password
¬¬ 
=
¬¬ 
CryptoJs
¬¬ '
.
¬¬' (
DecryptStringAES
¬¬( 8
(
¬¬8 9
model
¬¬9 >
.
¬¬> ?
password
¬¬? G
)
¬¬G H
;
¬¬H I
var
√√ 
user
√√ 
=
√√ 
await
√√  
_userManager
√√! -
.
√√- .
FindByIdAsync
√√. ;
(
√√; <
userId
√√< B
)
√√B C
;
√√C D
var
ƒƒ 
result
ƒƒ 
=
ƒƒ 
await
ƒƒ "
_signInManager
ƒƒ# 1
.
ƒƒ1 2
UserManager
ƒƒ2 =
.
ƒƒ= > 
CheckPasswordAsync
ƒƒ> P
(
ƒƒP Q
user
ƒƒQ U
,
ƒƒU V
password
ƒƒW _
)
ƒƒ_ `
;
ƒƒ` a
if
≈≈ 
(
≈≈ 
result
≈≈ 
)
≈≈ 
{
∆∆ 
isMatchPassword
«« #
=
««$ %
true
««& *
;
««* +
}
»» 
CommonResponse
   
commonResponse
   -
=
  . /
new
  0 3
CommonResponse
  4 B
(
  B C
)
  C D
{
ÀÀ 
isMatchPassword
ÃÃ #
=
ÃÃ$ %
isMatchPassword
ÃÃ& 5
}
ÕÕ 
;
ÕÕ 
return
œœ '
_iHttpsResponseRepository
œœ 0
.
œœ0 1
ReturnResult
œœ1 =
(
œœ= >
APIStatusCode
œœ> K
.
œœK L
SUCCESS
œœL S
,
œœS T
APIState
œœU ]
.
œœ] ^
SUCCESS
œœ^ e
,
œœe f
commonResponse
œœg u
,
œœu v
null
œœw {
)
œœ{ |
;
œœ| }
}
–– 
catch
—— 
(
—— 
	Exception
—— 
e
—— 
)
—— 
{
““ 
_logger
”” 
.
”” 
LogError
””  
(
””  !
e
””! "
.
””" #
ToString
””# +
(
””+ ,
)
””, -
)
””- .
;
””. /
return
‘‘ 
await
‘‘ '
_iHttpsResponseRepository
‘‘ 6
.
‘‘6 7%
ReturnExceptionResponse
‘‘7 N
(
‘‘N O
e
‘‘O P
)
‘‘P Q
;
‘‘Q R
}
’’ 
}
÷÷ 	
}
ÿÿ 
}ŸŸ •
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
AuthenticationScheme	 ì
;
ì î
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
} ˇˇ
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
ÄÄ 
return
ÅÅ 
Redirect
ÅÅ 
(
ÅÅ  
	returnUrl
ÅÅ  )
)
ÅÅ) *
;
ÅÅ* +
}
ÇÇ 
return
ÑÑ 
Redirect
ÑÑ 
(
ÑÑ 
$str
ÑÑ  
)
ÑÑ  !
;
ÑÑ! "
}
ÖÖ 	
private
áá 
async
áá 
Task
áá 
<
áá 
IActionResult
áá (
>
áá( )&
ProcessWindowsLoginAsync
áá* B
(
ááB C
string
ááC I
	returnUrl
ááJ S
)
ááS T
{
àà 	
var
ää 
result
ää 
=
ää 
await
ää 
HttpContext
ää *
.
ää* +
AuthenticateAsync
ää+ <
(
ää< =
AccountOptions
ää= K
.
ääK L-
WindowsAuthenticationSchemeName
ääL k
)
ääk l
;
ääl m
if
ãã 
(
ãã 
result
ãã 
?
ãã 
.
ãã 
	Principal
ãã !
is
ãã" $
WindowsPrincipal
ãã% 5
wp
ãã6 8
)
ãã8 9
{
åå 
var
êê 
props
êê 
=
êê 
new
êê &
AuthenticationProperties
êê  8
(
êê8 9
)
êê9 :
{
ëë 
RedirectUri
íí 
=
íí  !
Url
íí" %
.
íí% &
Action
íí& ,
(
íí, -
$str
íí- 7
)
íí7 8
,
íí8 9
Items
ìì 
=
ìì 
{
îî 
{
ïï 
$str
ïï %
,
ïï% &
	returnUrl
ïï' 0
}
ïï1 2
,
ïï2 3
{
ññ 
$str
ññ "
,
ññ" #
AccountOptions
ññ$ 2
.
ññ2 3-
WindowsAuthenticationSchemeName
ññ3 R
}
ññS T
,
ññT U
}
óó 
}
òò 
;
òò 
var
öö 
id
öö 
=
öö 
new
öö 
ClaimsIdentity
öö +
(
öö+ ,
AccountOptions
öö, :
.
öö: ;-
WindowsAuthenticationSchemeName
öö; Z
)
ööZ [
;
öö[ \
id
õõ 
.
õõ 
AddClaim
õõ 
(
õõ 
new
õõ 
Claim
õõ  %
(
õõ% &
JwtClaimTypes
õõ& 3
.
õõ3 4
Subject
õõ4 ;
,
õõ; <
wp
õõ= ?
.
õõ? @
Identity
õõ@ H
.
õõH I
Name
õõI M
)
õõM N
)
õõN O
;
õõO P
id
úú 
.
úú 
AddClaim
úú 
(
úú 
new
úú 
Claim
úú  %
(
úú% &
JwtClaimTypes
úú& 3
.
úú3 4
Name
úú4 8
,
úú8 9
wp
úú: <
.
úú< =
Identity
úú= E
.
úúE F
Name
úúF J
)
úúJ K
)
úúK L
;
úúL M
if
üü 
(
üü 
AccountOptions
üü "
.
üü" #"
IncludeWindowsGroups
üü# 7
)
üü7 8
{
†† 
var
°° 
wi
°° 
=
°° 
wp
°° 
.
°°  
Identity
°°  (
as
°°) +
WindowsIdentity
°°, ;
;
°°; <
var
¢¢ 
groups
¢¢ 
=
¢¢  
wi
¢¢! #
.
¢¢# $
Groups
¢¢$ *
.
¢¢* +
	Translate
¢¢+ 4
(
¢¢4 5
typeof
¢¢5 ;
(
¢¢; <
	NTAccount
¢¢< E
)
¢¢E F
)
¢¢F G
;
¢¢G H
var
££ 
roles
££ 
=
££ 
groups
££  &
.
££& '
Select
££' -
(
££- .
x
££. /
=>
££0 2
new
££3 6
Claim
££7 <
(
££< =
JwtClaimTypes
££= J
.
££J K
Role
££K O
,
££O P
x
££Q R
.
££R S
Value
££S X
)
££X Y
)
££Y Z
;
££Z [
id
§§ 
.
§§ 
	AddClaims
§§  
(
§§  !
roles
§§! &
)
§§& '
;
§§' (
}
•• 
await
ßß 
HttpContext
ßß !
.
ßß! "
SignInAsync
ßß" -
(
ßß- .
IdentityServer4
®® #
.
®®# $%
IdentityServerConstants
®®$ ;
.
®®; <0
"ExternalCookieAuthenticationScheme
®®< ^
,
®®^ _
new
©© 
ClaimsPrincipal
©© '
(
©©' (
id
©©( *
)
©©* +
,
©©+ ,
props
™™ 
)
™™ 
;
™™ 
return
´´ 
Redirect
´´ 
(
´´  
props
´´  %
.
´´% &
RedirectUri
´´& 1
)
´´1 2
;
´´2 3
}
¨¨ 
else
≠≠ 
{
ÆÆ 
return
≤≤ 
	Challenge
≤≤  
(
≤≤  !
AccountOptions
≤≤! /
.
≤≤/ 0-
WindowsAuthenticationSchemeName
≤≤0 O
)
≤≤O P
;
≤≤P Q
}
≥≥ 
}
¥¥ 	
private
∂∂ 
async
∂∂ 
Task
∂∂ 
<
∂∂ 
(
∂∂ 
ApplicationUser
∂∂ +
user
∂∂, 0
,
∂∂0 1
string
∂∂2 8
provider
∂∂9 A
,
∂∂A B
string
∂∂C I
providerUserId
∂∂J X
,
∂∂X Y
IEnumerable
∂∂Z e
<
∂∂e f
Claim
∂∂f k
>
∂∂k l
claims
∂∂m s
)
∂∂s t
>
∂∂t u/
!FindUserFromExternalProviderAsync
∑∑ -
(
∑∑- . 
AuthenticateResult
∑∑. @
result
∑∑A G
)
∑∑G H
{
∏∏ 	
var
ππ 
externalUser
ππ 
=
ππ 
result
ππ %
.
ππ% &
	Principal
ππ& /
;
ππ/ 0
var
ææ 
userIdClaim
ææ 
=
ææ 
externalUser
ææ *
.
ææ* +
	FindFirst
ææ+ 4
(
ææ4 5
JwtClaimTypes
ææ5 B
.
ææB C
Subject
ææC J
)
ææJ K
??
ææL N
externalUser
øø *
.
øø* +
	FindFirst
øø+ 4
(
øø4 5

ClaimTypes
øø5 ?
.
øø? @
NameIdentifier
øø@ N
)
øøN O
??
øøP R
throw
¿¿ #
new
¿¿$ '
	Exception
¿¿( 1
(
¿¿1 2
$str
¿¿2 B
)
¿¿B C
;
¿¿C D
var
√√ 
claims
√√ 
=
√√ 
externalUser
√√ %
.
√√% &
Claims
√√& ,
.
√√, -
ToList
√√- 3
(
√√3 4
)
√√4 5
;
√√5 6
claims
ƒƒ 
.
ƒƒ 
Remove
ƒƒ 
(
ƒƒ 
userIdClaim
ƒƒ %
)
ƒƒ% &
;
ƒƒ& '
var
∆∆ 
provider
∆∆ 
=
∆∆ 
result
∆∆ !
.
∆∆! "

Properties
∆∆" ,
.
∆∆, -
Items
∆∆- 2
[
∆∆2 3
$str
∆∆3 ;
]
∆∆; <
;
∆∆< =
var
«« 
providerUserId
«« 
=
««  
userIdClaim
««! ,
.
««, -
Value
««- 2
;
««2 3
var
   
user
   
=
   
await
   
_userManager
   )
.
  ) *
FindByLoginAsync
  * :
(
  : ;
provider
  ; C
,
  C D
providerUserId
  E S
)
  S T
;
  T U
if
ÕÕ 
(
ÕÕ 
user
ÕÕ 
==
ÕÕ 
null
ÕÕ 
)
ÕÕ 
{
ŒŒ 
var
œœ 
name
œœ 
=
œœ 
claims
œœ !
.
œœ! "
FirstOrDefault
œœ" 0
(
œœ0 1
x
œœ1 2
=>
œœ3 5
x
œœ6 7
.
œœ7 8
Type
œœ8 <
==
œœ= ?
JwtClaimTypes
œœ@ M
.
œœM N
Name
œœN R
)
œœR S
?
œœS T
.
œœT U
Value
œœU Z
??
œœ[ ]
claims
œœ^ d
.
œœd e
FirstOrDefault
œœe s
(
œœs t
x
œœt u
=>
œœv x
x
œœy z
.
œœz {
Type
œœ{ 
==œœÄ Ç

ClaimTypesœœÉ ç
.œœç é
Nameœœé í
)œœí ì
?œœì î
.œœî ï
Valueœœï ö
;œœö õ
if
–– 
(
–– 
name
–– 
!=
–– 
null
––  
)
––  !
{
—— 
user
““ 
=
““ 
await
““  
_userManager
““! -
.
““- .
FindByNameAsync
““. =
(
““= >
name
““> B
)
““B C
;
““C D
}
”” 
if
‘‘ 
(
‘‘ 
user
‘‘ 
==
‘‘ 
null
‘‘  
)
‘‘  !
{
’’ 
var
÷÷ 
prefname
÷÷  
=
÷÷! "
claims
÷÷# )
.
÷÷) *
FirstOrDefault
÷÷* 8
(
÷÷8 9
x
÷÷9 :
=>
÷÷; =
x
÷÷> ?
.
÷÷? @
Type
÷÷@ D
==
÷÷E G
JwtClaimTypes
÷÷H U
.
÷÷U V
PreferredUserName
÷÷V g
)
÷÷g h
?
÷÷h i
.
÷÷i j
Value
÷÷j o
;
÷÷o p
if
◊◊ 
(
◊◊ 
prefname
◊◊  
!=
◊◊! #
null
◊◊$ (
)
◊◊( )
{
ÿÿ 
user
ŸŸ 
=
ŸŸ 
await
ŸŸ $
_userManager
ŸŸ% 1
.
ŸŸ1 2
FindByNameAsync
ŸŸ2 A
(
ŸŸA B
prefname
ŸŸB J
)
ŸŸJ K
;
ŸŸK L
}
⁄⁄ 
}
€€ 
if
‹‹ 
(
‹‹ 
user
‹‹ 
==
‹‹ 
null
‹‹  
)
‹‹  !
{
›› 
var
ﬁﬁ 
email
ﬁﬁ 
=
ﬁﬁ 
claims
ﬁﬁ  &
.
ﬁﬁ& '
FirstOrDefault
ﬁﬁ' 5
(
ﬁﬁ5 6
x
ﬁﬁ6 7
=>
ﬁﬁ8 :
x
ﬁﬁ; <
.
ﬁﬁ< =
Type
ﬁﬁ= A
==
ﬁﬁB D
JwtClaimTypes
ﬁﬁE R
.
ﬁﬁR S
Email
ﬁﬁS X
)
ﬁﬁX Y
?
ﬁﬁY Z
.
ﬁﬁZ [
Value
ﬁﬁ[ `
??
ﬁﬁa c
claims
ﬁﬁd j
.
ﬁﬁj k
FirstOrDefault
ﬁﬁk y
(
ﬁﬁy z
x
ﬁﬁz {
=>
ﬁﬁ| ~
xﬁﬁ Ä
.ﬁﬁÄ Å
TypeﬁﬁÅ Ö
==ﬁﬁÜ à

ClaimTypesﬁﬁâ ì
.ﬁﬁì î
Emailﬁﬁî ô
)ﬁﬁô ö
?ﬁﬁö õ
.ﬁﬁõ ú
Valueﬁﬁú °
;ﬁﬁ° ¢
if
ﬂﬂ 
(
ﬂﬂ 
email
ﬂﬂ 
!=
ﬂﬂ  
null
ﬂﬂ! %
)
ﬂﬂ% &
{
‡‡ 
user
·· 
=
·· 
await
·· $
_userManager
··% 1
.
··1 2
FindByEmailAsync
··2 B
(
··B C
email
··C H
)
··H I
;
··I J
}
‚‚ 
}
„„ 
if
‰‰ 
(
‰‰ 
user
‰‰ 
!=
‰‰ 
null
‰‰  
)
‰‰  !
{
ÂÂ 
var
ÊÊ 
identityResult
ÊÊ &
=
ÊÊ' (
await
ÊÊ) .
_userManager
ÊÊ/ ;
.
ÊÊ; <
AddLoginAsync
ÊÊ< I
(
ÊÊI J
user
ÊÊJ N
,
ÊÊN O
new
ÊÊP S
UserLoginInfo
ÊÊT a
(
ÊÊa b
provider
ÊÊb j
,
ÊÊj k
providerUserId
ÊÊl z
,
ÊÊz {
providerÊÊ| Ñ
)ÊÊÑ Ö
)ÊÊÖ Ü
;ÊÊÜ á
if
ÁÁ 
(
ÁÁ 
!
ÁÁ 
identityResult
ÁÁ '
.
ÁÁ' (
	Succeeded
ÁÁ( 1
)
ÁÁ1 2
throw
ÁÁ3 8
new
ÁÁ9 <
	Exception
ÁÁ= F
(
ÁÁF G
identityResult
ÁÁG U
.
ÁÁU V
Errors
ÁÁV \
.
ÁÁ\ ]
First
ÁÁ] b
(
ÁÁb c
)
ÁÁc d
.
ÁÁd e
Description
ÁÁe p
)
ÁÁp q
;
ÁÁq r
}
ËË 
}
ÈÈ 
return
ÎÎ 
(
ÎÎ 
user
ÎÎ 
,
ÎÎ 
provider
ÎÎ "
,
ÎÎ" #
providerUserId
ÎÎ$ 2
,
ÎÎ2 3
claims
ÎÎ4 :
)
ÎÎ: ;
;
ÎÎ; <
}
ÏÏ 	
private
ÓÓ 
async
ÓÓ 
Task
ÓÓ 
<
ÓÓ 
ApplicationUser
ÓÓ *
>
ÓÓ* +$
AutoProvisionUserAsync
ÓÓ, B
(
ÓÓB C
string
ÓÓC I
provider
ÓÓJ R
,
ÓÓR S
string
ÓÓT Z
providerUserId
ÓÓ[ i
,
ÓÓi j
IEnumerable
ÓÓk v
<
ÓÓv w
Claim
ÓÓw |
>
ÓÓ| }
claimsÓÓ~ Ñ
)ÓÓÑ Ö
{
ÔÔ 	
var
ÒÒ 
filtered
ÒÒ 
=
ÒÒ 
new
ÒÒ 
List
ÒÒ #
<
ÒÒ# $
Claim
ÒÒ$ )
>
ÒÒ) *
(
ÒÒ* +
)
ÒÒ+ ,
;
ÒÒ, -
var
ÙÙ 
name
ÙÙ 
=
ÙÙ 
claims
ÙÙ 
.
ÙÙ 
FirstOrDefault
ÙÙ ,
(
ÙÙ, -
x
ÙÙ- .
=>
ÙÙ/ 1
x
ÙÙ2 3
.
ÙÙ3 4
Type
ÙÙ4 8
==
ÙÙ9 ;
JwtClaimTypes
ÙÙ< I
.
ÙÙI J
Name
ÙÙJ N
)
ÙÙN O
?
ÙÙO P
.
ÙÙP Q
Value
ÙÙQ V
??
ÙÙW Y
claims
ıı 
.
ıı 
FirstOrDefault
ıı %
(
ıı% &
x
ıı& '
=>
ıı( *
x
ıı+ ,
.
ıı, -
Type
ıı- 1
==
ıı2 4

ClaimTypes
ıı5 ?
.
ıı? @
Name
ıı@ D
)
ııD E
?
ııE F
.
ııF G
Value
ııG L
;
ııL M
if
ˆˆ 
(
ˆˆ 
name
ˆˆ 
!=
ˆˆ 
null
ˆˆ 
)
ˆˆ 
{
˜˜ 
filtered
¯¯ 
.
¯¯ 
Add
¯¯ 
(
¯¯ 
new
¯¯  
Claim
¯¯! &
(
¯¯& '
JwtClaimTypes
¯¯' 4
.
¯¯4 5
Name
¯¯5 9
,
¯¯9 :
name
¯¯; ?
)
¯¯? @
)
¯¯@ A
;
¯¯A B
}
˘˘ 
else
˙˙ 
{
˚˚ 
var
¸¸ 
first
¸¸ 
=
¸¸ 
claims
¸¸ "
.
¸¸" #
FirstOrDefault
¸¸# 1
(
¸¸1 2
x
¸¸2 3
=>
¸¸4 6
x
¸¸7 8
.
¸¸8 9
Type
¸¸9 =
==
¸¸> @
JwtClaimTypes
¸¸A N
.
¸¸N O
	GivenName
¸¸O X
)
¸¸X Y
?
¸¸Y Z
.
¸¸Z [
Value
¸¸[ `
??
¸¸a c
claims
˝˝ 
.
˝˝ 
FirstOrDefault
˝˝ )
(
˝˝) *
x
˝˝* +
=>
˝˝, .
x
˝˝/ 0
.
˝˝0 1
Type
˝˝1 5
==
˝˝6 8

ClaimTypes
˝˝9 C
.
˝˝C D
	GivenName
˝˝D M
)
˝˝M N
?
˝˝N O
.
˝˝O P
Value
˝˝P U
;
˝˝U V
var
˛˛ 
last
˛˛ 
=
˛˛ 
claims
˛˛ !
.
˛˛! "
FirstOrDefault
˛˛" 0
(
˛˛0 1
x
˛˛1 2
=>
˛˛3 5
x
˛˛6 7
.
˛˛7 8
Type
˛˛8 <
==
˛˛= ?
JwtClaimTypes
˛˛@ M
.
˛˛M N

FamilyName
˛˛N X
)
˛˛X Y
?
˛˛Y Z
.
˛˛Z [
Value
˛˛[ `
??
˛˛a c
claims
ˇˇ 
.
ˇˇ 
FirstOrDefault
ˇˇ )
(
ˇˇ) *
x
ˇˇ* +
=>
ˇˇ, .
x
ˇˇ/ 0
.
ˇˇ0 1
Type
ˇˇ1 5
==
ˇˇ6 8

ClaimTypes
ˇˇ9 C
.
ˇˇC D
Surname
ˇˇD K
)
ˇˇK L
?
ˇˇL M
.
ˇˇM N
Value
ˇˇN S
;
ˇˇS T
if
ÄÄ 
(
ÄÄ 
first
ÄÄ 
!=
ÄÄ 
null
ÄÄ !
&&
ÄÄ" $
last
ÄÄ% )
!=
ÄÄ* ,
null
ÄÄ- 1
)
ÄÄ1 2
{
ÅÅ 
filtered
ÇÇ 
.
ÇÇ 
Add
ÇÇ  
(
ÇÇ  !
new
ÇÇ! $
Claim
ÇÇ% *
(
ÇÇ* +
JwtClaimTypes
ÇÇ+ 8
.
ÇÇ8 9
Name
ÇÇ9 =
,
ÇÇ= >
first
ÇÇ? D
+
ÇÇE F
$str
ÇÇG J
+
ÇÇK L
last
ÇÇM Q
)
ÇÇQ R
)
ÇÇR S
;
ÇÇS T
}
ÉÉ 
else
ÑÑ 
if
ÑÑ 
(
ÑÑ 
first
ÑÑ 
!=
ÑÑ !
null
ÑÑ" &
)
ÑÑ& '
{
ÖÖ 
filtered
ÜÜ 
.
ÜÜ 
Add
ÜÜ  
(
ÜÜ  !
new
ÜÜ! $
Claim
ÜÜ% *
(
ÜÜ* +
JwtClaimTypes
ÜÜ+ 8
.
ÜÜ8 9
Name
ÜÜ9 =
,
ÜÜ= >
first
ÜÜ? D
)
ÜÜD E
)
ÜÜE F
;
ÜÜF G
}
áá 
else
àà 
if
àà 
(
àà 
last
àà 
!=
àà  
null
àà! %
)
àà% &
{
ââ 
filtered
ää 
.
ää 
Add
ää  
(
ää  !
new
ää! $
Claim
ää% *
(
ää* +
JwtClaimTypes
ää+ 8
.
ää8 9
Name
ää9 =
,
ää= >
last
ää? C
)
ääC D
)
ääD E
;
ääE F
}
ãã 
}
åå 
var
èè 
email
èè 
=
èè 
claims
èè 
.
èè 
FirstOrDefault
èè -
(
èè- .
x
èè. /
=>
èè0 2
x
èè3 4
.
èè4 5
Type
èè5 9
==
èè: <
JwtClaimTypes
èè= J
.
èèJ K
Email
èèK P
)
èèP Q
?
èèQ R
.
èèR S
Value
èèS X
??
èèY [
claims
êê 
.
êê 
FirstOrDefault
êê $
(
êê$ %
x
êê% &
=>
êê' )
x
êê* +
.
êê+ ,
Type
êê, 0
==
êê1 3

ClaimTypes
êê4 >
.
êê> ?
Email
êê? D
)
êêD E
?
êêE F
.
êêF G
Value
êêG L
;
êêL M
if
ëë 
(
ëë 
email
ëë 
!=
ëë 
null
ëë 
)
ëë 
{
íí 
filtered
ìì 
.
ìì 
Add
ìì 
(
ìì 
new
ìì  
Claim
ìì! &
(
ìì& '
JwtClaimTypes
ìì' 4
.
ìì4 5
Email
ìì5 :
,
ìì: ;
email
ìì< A
)
ììA B
)
ììB C
;
ììC D
}
îî 
var
ññ 
user
ññ 
=
ññ 
new
ññ 
ApplicationUser
ññ *
{
óó 
UserName
òò 
=
òò 
Guid
òò 
.
òò  
NewGuid
òò  '
(
òò' (
)
òò( )
.
òò) *
ToString
òò* 2
(
òò2 3
)
òò3 4
,
òò4 5
}
ôô 
;
ôô 
var
öö 
identityResult
öö 
=
öö  
await
öö! &
_userManager
öö' 3
.
öö3 4
CreateAsync
öö4 ?
(
öö? @
user
öö@ D
)
ööD E
;
ööE F
if
õõ 
(
õõ 
!
õõ 
identityResult
õõ 
.
õõ  
	Succeeded
õõ  )
)
õõ) *
throw
õõ+ 0
new
õõ1 4
	Exception
õõ5 >
(
õõ> ?
identityResult
õõ? M
.
õõM N
Errors
õõN T
.
õõT U
First
õõU Z
(
õõZ [
)
õõ[ \
.
õõ\ ]
Description
õõ] h
)
õõh i
;
õõi j
if
ùù 
(
ùù 
filtered
ùù 
.
ùù 
Any
ùù 
(
ùù 
)
ùù 
)
ùù 
{
ûû 
identityResult
üü 
=
üü  
await
üü! &
_userManager
üü' 3
.
üü3 4
AddClaimsAsync
üü4 B
(
üüB C
user
üüC G
,
üüG H
filtered
üüI Q
)
üüQ R
;
üüR S
if
†† 
(
†† 
!
†† 
identityResult
†† #
.
††# $
	Succeeded
††$ -
)
††- .
throw
††/ 4
new
††5 8
	Exception
††9 B
(
††B C
identityResult
††C Q
.
††Q R
Errors
††R X
.
††X Y
First
††Y ^
(
††^ _
)
††_ `
.
††` a
Description
††a l
)
††l m
;
††m n
}
°° 
identityResult
££ 
=
££ 
await
££ "
_userManager
££# /
.
££/ 0
AddLoginAsync
££0 =
(
££= >
user
££> B
,
££B C
new
££D G
UserLoginInfo
££H U
(
££U V
provider
££V ^
,
££^ _
providerUserId
££` n
,
££n o
provider
££p x
)
££x y
)
££y z
;
££z {
if
§§ 
(
§§ 
!
§§ 
identityResult
§§ 
.
§§  
	Succeeded
§§  )
)
§§) *
throw
§§+ 0
new
§§1 4
	Exception
§§5 >
(
§§> ?
identityResult
§§? M
.
§§M N
Errors
§§N T
.
§§T U
First
§§U Z
(
§§Z [
)
§§[ \
.
§§\ ]
Description
§§] h
)
§§h i
;
§§i j
return
¶¶ 
user
¶¶ 
;
¶¶ 
}
ßß 	
private
©© 
void
©© )
ProcessLoginCallbackForOidc
©© 0
(
©©0 1 
AuthenticateResult
©©1 C
externalResult
©©D R
,
©©R S
List
©©T X
<
©©X Y
Claim
©©Y ^
>
©©^ _
localClaims
©©` k
,
©©k l'
AuthenticationProperties©©m Ö 
localSignInProps©©Ü ñ
)©©ñ ó
{
™™ 	
var
≠≠ 
sid
≠≠ 
=
≠≠ 
externalResult
≠≠ $
.
≠≠$ %
	Principal
≠≠% .
.
≠≠. /
Claims
≠≠/ 5
.
≠≠5 6
FirstOrDefault
≠≠6 D
(
≠≠D E
x
≠≠E F
=>
≠≠G I
x
≠≠J K
.
≠≠K L
Type
≠≠L P
==
≠≠Q S
JwtClaimTypes
≠≠T a
.
≠≠a b
	SessionId
≠≠b k
)
≠≠k l
;
≠≠l m
if
ÆÆ 
(
ÆÆ 
sid
ÆÆ 
!=
ÆÆ 
null
ÆÆ 
)
ÆÆ 
{
ØØ 
localClaims
∞∞ 
.
∞∞ 
Add
∞∞ 
(
∞∞  
new
∞∞  #
Claim
∞∞$ )
(
∞∞) *
JwtClaimTypes
∞∞* 7
.
∞∞7 8
	SessionId
∞∞8 A
,
∞∞A B
sid
∞∞C F
.
∞∞F G
Value
∞∞G L
)
∞∞L M
)
∞∞M N
;
∞∞N O
}
±± 
var
¥¥ 
id_token
¥¥ 
=
¥¥ 
externalResult
¥¥ )
.
¥¥) *

Properties
¥¥* 4
.
¥¥4 5
GetTokenValue
¥¥5 B
(
¥¥B C
$str
¥¥C M
)
¥¥M N
;
¥¥N O
if
µµ 
(
µµ 
id_token
µµ 
!=
µµ 
null
µµ  
)
µµ  !
{
∂∂ 
localSignInProps
∑∑  
.
∑∑  !
StoreTokens
∑∑! ,
(
∑∑, -
new
∑∑- 0
[
∑∑0 1
]
∑∑1 2
{
∑∑3 4
new
∑∑5 8!
AuthenticationToken
∑∑9 L
{
∑∑M N
Name
∑∑O S
=
∑∑T U
$str
∑∑V `
,
∑∑` a
Value
∑∑b g
=
∑∑h i
id_token
∑∑j r
}
∑∑s t
}
∑∑u v
)
∑∑v w
;
∑∑w x
}
∏∏ 
}
ππ 	
private
ªª 
void
ªª *
ProcessLoginCallbackForWsFed
ªª 1
(
ªª1 2 
AuthenticateResult
ªª2 D
externalResult
ªªE S
,
ªªS T
List
ªªU Y
<
ªªY Z
Claim
ªªZ _
>
ªª_ `
localClaims
ªªa l
,
ªªl m'
AuthenticationPropertiesªªn Ü 
localSignInPropsªªá ó
)ªªó ò
{
ºº 	
}
ΩΩ 	
private
øø 
void
øø +
ProcessLoginCallbackForSaml2p
øø 2
(
øø2 3 
AuthenticateResult
øø3 E
externalResult
øøF T
,
øøT U
List
øøV Z
<
øøZ [
Claim
øø[ `
>
øø` a
localClaims
øøb m
,
øøm n'
AuthenticationPropertiesøøo á 
localSignInPropsøøà ò
)øøò ô
{
¿¿ 	
}
¡¡ 	
}
¬¬ 
}√√ ï
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
} û
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
} è
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
} À
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
IsNullOrWhiteSpace	n Ä
(
Ä Å
x
Å Ç
.
Ç É
DisplayName
É é
)
é è
)
è ê
;
ê ë
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
Ä Ñ
;
Ñ Ö
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
} Í
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
} À
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
} Ô
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
} ˚v
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
IConfigurationDbContext	$$l É$
configurationDbContext
$$Ñ ö
,
$$ö õ&
IHttpsResponseRepository
$$ú ¥%
httpsResponseRepository
$$µ Ã
,
$$Ã Õ$
IDynamicMessageService
$$Œ ‰#
dynamicMessageService
$$Â ˙
,
$$˙ ˚
ILogger
$$¸ É
<
$$É Ñ
UtilityController
$$Ñ ï
>
$$ï ñ
logger
$$ó ù
)
$$ù û
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

Q2CClients	NNx Ç
.
NNÇ É
Q2CUI
NNÉ à
.
NNà â
GetDisplayValue
NNâ ò
(
NNò ô
)
NNô ö
)
NNö õ
.
NNõ ú!
FirstOrDefaultAsync
NNú Ø
(
NNØ ∞
)
NN∞ ±
;
NN± ≤
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
ÄÄ 
async
ÄÄ 
Task
ÄÄ 
<
ÄÄ 
IActionResult
ÄÄ '
>
ÄÄ' (%
ManageClientUserMapping
ÄÄ) @
(
ÄÄ@ A
[
ÄÄA B
FromBody
ÄÄB J
]
ÄÄJ K'
ManageClientUserMappingVM
ÄÄL e
model
ÄÄf k
)
ÄÄk l
{
ÅÅ 	
if
ÇÇ 
(
ÇÇ 
model
ÇÇ 
==
ÇÇ 
null
ÇÇ 
)
ÇÇ 
{
ÉÉ 
var
ÑÑ !
invalidParameterMSG
ÑÑ '
=
ÑÑ( )
await
ÑÑ* /$
_dynamicMessageService
ÑÑ0 F
.
ÑÑF G
Get
ÑÑG J
(
ÑÑJ K
INVALID_PARAMETER
ÑÑK \
)
ÑÑ\ ]
;
ÑÑ] ^
return
ÖÖ '
_iHttpsResponseRepository
ÖÖ 0
.
ÖÖ0 1
ReturnResult
ÖÖ1 =
(
ÖÖ= >
APIStatusCode
ÖÖ> K
.
ÖÖK L
ERROR
ÖÖL Q
,
ÖÖQ R
APIState
ÖÖS [
.
ÖÖ[ \
FAILED
ÖÖ\ b
,
ÖÖb c
null
ÖÖd h
,
ÖÖh i
new
ÖÖj m
UserMessage
ÖÖn y
(
ÖÖy z
)
ÖÖz {
{
ÖÖ| }
messageContentÖÖ~ å
=ÖÖç é
newÖÖè í
MessageContentÖÖì °
{ÖÖ¢ £
messageTypeÖÖ§ Ø
=ÖÖ∞ ±#
invalidParameterMSGÖÖ≤ ≈
.ÖÖ≈ ∆
messageTypeÖÖ∆ —
,ÖÖ— “
messageCodeÖÖ” ﬁ
=ÖÖﬂ ‡#
invalidParameterMSGÖÖ· Ù
.ÖÖÙ ı
messageCodeÖÖı Ä
,ÖÖÄ Å
messageÖÖÇ â
=ÖÖä ã#
invalidParameterMSGÖÖå ü
.ÖÖü †
messageÖÖ† ß
}ÖÖ® ©
}ÖÖ™ ´
)ÖÖ´ ¨
;ÖÖ¨ ≠
}
ÜÜ 
try
áá 
{
àà 
bool
ââ 
mappingSuccess
ââ #
;
ââ# $
var
ãã 
objClint
ãã 
=
ãã 
await
ãã $%
_configurationDbContext
ãã% <
.
ãã< =
Clients
ãã= D
.
ããD E
Where
ããE J
(
ããJ K
x
ããK L
=>
ããM O
x
ããP Q
.
ããQ R

ClientName
ããR \
==
ãã] _
model
ãã` e
.
ããe f

ClientName
ããf p
)
ããp q
.
ããq r"
FirstOrDefaultAsyncããr Ö
(ããÖ Ü
)ããÜ á
;ããá à
if
åå 
(
åå 
objClint
åå 
==
åå 
null
åå  $
)
åå$ %
{
çç 
var
éé 
notFoundMSG
éé #
=
éé$ %
await
éé& +$
_dynamicMessageService
éé, B
.
ééB C
Get
ééC F
(
ééF G
	NOT_FOUND
ééG P
)
ééP Q
;
ééQ R
return
èè '
_iHttpsResponseRepository
èè 4
.
èè4 5
ReturnResult
èè5 A
(
èèA B
APIStatusCode
èèB O
.
èèO P
ERROR
èèP U
,
èèU V
APIState
èèW _
.
èè_ `
FAILED
èè` f
,
èèf g
null
èèh l
,
èèl m
new
èèn q
UserMessage
èèr }
(
èè} ~
)
èè~ 
{èèÄ Å
messageContentèèÇ ê
=èèë í
newèèì ñ
MessageContentèèó •
{èè¶ ß
messageTypeèè® ≥
=èè¥ µ
notFoundMSGèè∂ ¡
.èè¡ ¬
messageTypeèè¬ Õ
,èèÕ Œ
messageCodeèèœ ⁄
=èè€ ‹
notFoundMSGèè› Ë
.èèË È
messageCodeèèÈ Ù
,èèÙ ı
messageèèˆ ˝
=èè˛ ˇ
stringèèÄ Ü
.èèÜ á
Formatèèá ç
(èèç é
notFoundMSGèèé ô
.èèô ö
messageèèö °
,èè° ¢
$strèè£ ´
)èè´ ¨
}èè≠ Æ
}èèØ ∞
)èè∞ ±
;èè± ≤
}
êê !
ClientUserMappingVM
íí ##
newClientUsersMapping
íí$ 9
=
íí: ;
new
íí< ?!
ClientUserMappingVM
íí@ S
(
ííS T
)
ííT U
{
ìì 
ClientId
îî 
=
îî 
objClint
îî '
.
îî' (
ClientId
îî( 0
,
îî0 1
UserId
ïï 
=
ïï 
model
ïï "
.
ïï" #
UserId
ïï# )
}
ññ 
;
ññ 
if
òò 
(
òò 
model
òò 
.
òò 
toAdd
òò 
)
òò  
{
ôô 
mappingSuccess
öö "
=
öö# $
await
öö% *
_iUserRepository
öö+ ;
.
öö; <
AddClientUserMap
öö< L
(
ööL M#
newClientUsersMapping
ööM b
)
ööb c
;
ööc d
}
õõ 
else
úú 
{
ùù 
mappingSuccess
ûû "
=
ûû# $
await
ûû% *
_iUserRepository
ûû+ ;
.
ûû; <!
RemoveClientUserMap
ûû< O
(
ûûO P#
newClientUsersMapping
ûûP e
)
ûûe f
;
ûûf g
}
üü 
if
°° 
(
°° 
mappingSuccess
°° "
)
°°" #
{
¢¢ 
return
££ '
_iHttpsResponseRepository
££ 4
.
££4 5
ReturnResult
££5 A
(
££A B
APIStatusCode
££B O
.
££O P
SUCCESS
££P W
,
££W X
APIState
££Y a
.
££a b
SUCCESS
££b i
,
££i j
null
££k o
,
££o p
null
££q u
)
££u v
;
££v w
}
§§ 
else
•• 
{
¶¶ 
var
ßß 
somethingWrongMSG
ßß )
=
ßß* +
await
ßß, 1$
_dynamicMessageService
ßß2 H
.
ßßH I
Get
ßßI L
(
ßßL M
SOMTHING_WRONG
ßßM [
)
ßß[ \
;
ßß\ ]
return
®® '
_iHttpsResponseRepository
®® 4
.
®®4 5
ReturnResult
®®5 A
(
®®A B
APIStatusCode
®®B O
.
®®O P
ERROR
®®P U
,
®®U V
APIState
®®W _
.
®®_ `
FAILED
®®` f
,
®®f g
null
®®h l
,
®®l m
new
®®n q
UserMessage
®®r }
(
®®} ~
)
®®~ 
{®®Ä Å
messageContent®®Ç ê
=®®ë í
new®®ì ñ
MessageContent®®ó •
{®®¶ ß
messageType®®® ≥
=®®¥ µ!
somethingWrongMSG®®∂ «
.®®« »
messageType®®» ”
,®®” ‘
messageCode®®’ ‡
=®®· ‚!
somethingWrongMSG®®„ Ù
.®®Ù ı
messageCode®®ı Ä
,®®Ä Å
message®®Ç â
=®®ä ã!
somethingWrongMSG®®å ù
.®®ù û
message®®û •
}®®¶ ß
}®®® ©
)®®© ™
;®®™ ´
}
©© 
}
™™ 
catch
´´ 
(
´´ 
	Exception
´´ 
e
´´ 
)
´´ 
{
¨¨ 
_logger
≠≠ 
.
≠≠ 
LogError
≠≠  
(
≠≠  !
e
≠≠! "
.
≠≠" #
ToString
≠≠# +
(
≠≠+ ,
)
≠≠, -
)
≠≠- .
;
≠≠. /
return
ÆÆ 
await
ÆÆ '
_iHttpsResponseRepository
ÆÆ 6
.
ÆÆ6 7%
ReturnExceptionResponse
ÆÆ7 N
(
ÆÆN O
e
ÆÆO P
)
ÆÆP Q
;
ÆÆQ R
}
ØØ 
}
∞∞ 	
}
±± 
}≤≤ Ë
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
} ˆ·
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

ClientName	bbx Ç
)
bbÇ É
.
bbÉ Ñ
FirstOrDefault
bbÑ í
(
bbí ì
)
bbì î
;
bbî ï
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
ÄÄ 
objnewClints
ÄÄ  
=
ÄÄ! "%
_configurationDbContext
ÄÄ# :
.
ÄÄ: ;
Clients
ÄÄ; B
.
ÄÄB C
Include
ÄÄC J
(
ÄÄJ K
x
ÄÄK L
=>
ÄÄM O
x
ÄÄP Q
.
ÄÄQ R
ClientSecrets
ÄÄR _
)
ÄÄ_ `
.
ÄÄ` a
Where
ÄÄa f
(
ÄÄf g
x
ÄÄg h
=>
ÄÄi k
x
ÄÄl m
.
ÄÄm n

ClientName
ÄÄn x
==
ÄÄy {
modelÄÄ| Å
.ÄÄÅ Ç

ClientNameÄÄÇ å
)ÄÄå ç
.ÄÄç é
FirstOrDefaultÄÄé ú
(ÄÄú ù
)ÄÄù û
;ÄÄû ü
return
ÅÅ 
Ok
ÅÅ 
(
ÅÅ 
new
ÅÅ 
{
ÅÅ 
ClientID
ÅÅ  (
=
ÅÅ) *
clientId
ÅÅ+ 3
,
ÅÅ3 4
ClientSecrets
ÅÅ5 B
=
ÅÅC D
clientSecret
ÅÅE Q
,
ÅÅQ R
id
ÅÅS U
=
ÅÅV W
objnewClints
ÅÅX d
!=
ÅÅe g
null
ÅÅh l
?
ÅÅm n
objnewClints
ÅÅo {
.
ÅÅ{ |
Id
ÅÅ| ~
:ÅÅ Ä
$numÅÅÅ Ç
}ÅÅÉ Ñ
)ÅÅÑ Ö
;ÅÅÖ Ü
}
ÉÉ 
}
ÑÑ 	
[
åå 	
HttpPost
åå	 
]
åå 
public
çç 
async
çç 
Task
çç 
<
çç 
IActionResult
çç '
>
çç' ( 
UpdateClientSecret
çç) ;
(
çç; <
ClientsViewModel
çç< L
model
ççM R
)
ççR S
{
éé 	
var
èè 
client
èè 
=
èè %
_configurationDbContext
èè 0
.
èè0 1
Clients
èè1 8
.
èè8 9
Include
èè9 @
(
èè@ A
x
èèA B
=>
èèC E
x
èèF G
.
èèG H
ClientSecrets
èèH U
)
èèU V
.
èèV W
Where
èèW \
(
èè\ ]
x
èè] ^
=>
èè_ a
x
èèb c
.
èèc d

ClientName
èèd n
==
èèo q
model
èèr w
.
èèw x

ClientNameèèx Ç
)èèÇ É
.èèÉ Ñ
FirstOrDefaultèèÑ í
(èèí ì
)èèì î
;èèî ï
if
êê 
(
êê 
client
êê 
!=
êê 
null
êê 
&&
êê !
client
êê" (
.
êê( )
ClientSecrets
êê) 6
!=
êê7 9
null
êê: >
)
êê> ?
{
ëë 
var
íí 
clientSecret
íí  
=
íí! "
Helper
íí# )
.
íí) *
Helper
íí* 0
.
íí0 1"
GenerateClientSecret
íí1 E
(
ííE F
)
ííF G
;
ííG H
var
îî 
objcientscret
îî !
=
îî" #
client
îî$ *
.
îî* +
ClientSecrets
îî+ 8
.
îî8 9
Where
îî9 >
(
îî> ?
x
îî? @
=>
îîA C
x
îîD E
.
îîE F
ClientId
îîF N
==
îîO Q
client
îîR X
.
îîX Y
Id
îîY [
)
îî[ \
.
îî\ ]
FirstOrDefault
îî] k
(
îîk l
)
îîl m
;
îîm n
objcientscret
ññ 
.
ññ 
Value
ññ #
=
ññ$ %
clientSecret
ññ& 2
.
ññ2 3
Sha256
ññ3 9
(
ññ9 :
)
ññ: ;
;
ññ; <
await
ôô %
_configurationDbContext
ôô -
.
ôô- .
SaveChangesAsync
ôô. >
(
ôô> ?
)
ôô? @
;
ôô@ A
return
õõ 
Ok
õõ 
(
õõ 
new
õõ 
{
õõ 
ClientID
õõ  (
=
õõ) *
client
õõ+ 1
.
õõ1 2
ClientId
õõ2 :
,
õõ: ;
ClientSecrets
õõ< I
=
õõJ K
clientSecret
õõL X
,
õõX Y
id
õõZ \
=
õõ] ^
client
õõ_ e
.
õõe f
Id
õõf h
}
õõi j
)
õõj k
;
õõk l
}
ùù 
return
ûû 
Ok
ûû 
(
ûû 
new
ûû 
{
ûû 
ClientID
ûû $
=
ûû% &
$str
ûû' )
,
ûû) *
ClientSecrets
ûû+ 8
=
ûû9 :
$str
ûû; =
,
ûû= >
id
ûû? A
=
ûûB C
$str
ûûD F
}
ûûG H
)
ûûH I
;
ûûI J
}
üü 	
[
®® 	
HttpPost
®®	 
]
®® 
public
©© 
async
©© 
Task
©© 
<
©© 
IActionResult
©© '
>
©©' ($
UpdateAppicationClient
©©) ?
(
©©? @
ClientsViewModel
©©@ P
model
©©Q V
)
©©V W
{
™™ 	
string
´´ 

DomainName
´´ 
=
´´ 
_configuration
´´  .
[
´´. /
$str
´´/ ;
]
´´; <
;
´´< =
string
¨¨ &
LoginResponseRedirectUri
¨¨ +
=
¨¨, -
_configuration
¨¨. <
[
¨¨< =
$str
¨¨= W
]
¨¨W X
;
¨¨X Y
string
≠≠ 
LogoutRedirectUri
≠≠ $
=
≠≠% &
_configuration
≠≠' 5
[
≠≠5 6
$str
≠≠6 I
]
≠≠I J
;
≠≠J K
bool
ÆÆ 
IsSecure
ÆÆ 
=
ÆÆ 
Convert
ÆÆ #
.
ÆÆ# $
	ToBoolean
ÆÆ$ -
(
ÆÆ- .
_configuration
ÆÆ. <
[
ÆÆ< =
$str
ÆÆ= G
]
ÆÆG H
)
ÆÆH I
;
ÆÆI J
var
∞∞ 
client
∞∞ 
=
∞∞ %
_configurationDbContext
∞∞ 0
.
∞∞0 1
Clients
∞∞1 8
.
±± 
Include
±± 
(
±± 
x
±± 
=>
±± 
x
±± 
.
±±  
RedirectUris
±±  ,
)
±±, -
.
≤≤ 
Include
≤≤ 
(
≤≤ 
x
≤≤ 
=>
≤≤ 
x
≤≤ 
.
≤≤  $
PostLogoutRedirectUris
≤≤  6
)
≤≤6 7
.
≥≥ 
Include
≥≥ 
(
≥≥ 
x
≥≥ 
=>
≥≥ 
x
≥≥ 
.
≥≥   
AllowedCorsOrigins
≥≥  2
)
≥≥2 3
.
¥¥ 
Where
¥¥ 
(
¥¥ 
x
¥¥ 
=>
¥¥ 
x
¥¥ 
.
¥¥ 
Id
¥¥  
==
¥¥! #
model
¥¥$ )
.
¥¥) *
Id
¥¥* ,
)
¥¥, -
.
¥¥- .
FirstOrDefault
¥¥. <
(
¥¥< =
)
¥¥= >
;
¥¥> ?
if
∂∂ 
(
∂∂ 
client
∂∂ 
!=
∂∂ 
null
∂∂ 
)
∂∂ 
{
∑∑ 
client
∏∏ 
.
∏∏ 
ClientId
∏∏ 
=
∏∏  !
model
∏∏" '
.
∏∏' (

ClientName
∏∏( 2
;
∏∏2 3
client
ππ 
.
ππ 

ClientName
ππ !
=
ππ" #
model
ππ$ )
.
ππ) *

ClientName
ππ* 4
;
ππ4 5
string
ªª 
AllowedCorsOrigin
ªª (
=
ªª) *
string
ªª+ 1
.
ªª1 2
Format
ªª2 8
(
ªª8 9
$str
ªª9 H
,
ªªH I
(
ªªJ K
IsSecure
ªªK S
?
ªªT U
$str
ªªV ]
:
ªª^ _
$str
ªª` f
)
ªªf g
,
ªªg h
model
ªªi n
.
ªªn o

ClientName
ªªo y
,
ªªy z

DomainNameªª{ Ö
)ªªÖ Ü
;ªªÜ á
string
ºº 
RedirectUri
ºº "
=
ºº# $
string
ºº% +
.
ºº+ ,
Format
ºº, 2
(
ºº2 3
$str
ºº3 E
,
ººE F
(
ººG H
IsSecure
ººH P
?
ººQ R
$str
ººS Z
:
ºº[ \
$str
ºº] c
)
ººc d
,
ººd e
model
ººf k
.
ººk l

ClientName
ººl v
,
ººv w

DomainNameººx Ç
,ººÇ É(
LoginResponseRedirectUriººÑ ú
)ººú ù
;ººù û
string
ΩΩ #
PostLogoutRedirectUri
ΩΩ ,
=
ΩΩ- .
string
ΩΩ/ 5
.
ΩΩ5 6
Format
ΩΩ6 <
(
ΩΩ< =
$str
ΩΩ= O
,
ΩΩO P
(
ΩΩQ R
IsSecure
ΩΩR Z
?
ΩΩ[ \
$str
ΩΩ] d
:
ΩΩe f
$str
ΩΩg m
)
ΩΩm n
,
ΩΩn o
model
ΩΩp u
.
ΩΩu v

ClientNameΩΩv Ä
,ΩΩÄ Å

DomainNameΩΩÇ å
,ΩΩå ç!
LogoutRedirectUriΩΩé ü
)ΩΩü †
;ΩΩ† °
var
øø "
objAllowedCorsOrigin
øø (
=
øø) *
client
øø+ 1
.
øø1 2 
AllowedCorsOrigins
øø2 D
.
øøD E
Where
øøE J
(
øøJ K
x
øøK L
=>
øøM O
x
øøP Q
.
øøQ R
ClientId
øøR Z
==
øø[ ]
client
øø^ d
.
øød e
Id
øøe g
)
øøg h
.
øøh i
FirstOrDefault
øøi w
(
øøw x
)
øøx y
;
øøy z
var
¿¿ 
objRedirectUris
¿¿ #
=
¿¿$ %
client
¿¿& ,
.
¿¿, -
RedirectUris
¿¿- 9
.
¿¿9 :
Where
¿¿: ?
(
¿¿? @
x
¿¿@ A
=>
¿¿B D
x
¿¿E F
.
¿¿F G
ClientId
¿¿G O
==
¿¿P R
client
¿¿S Y
.
¿¿Y Z
Id
¿¿Z \
)
¿¿\ ]
.
¿¿] ^
FirstOrDefault
¿¿^ l
(
¿¿l m
)
¿¿m n
;
¿¿n o
var
¡¡ '
objPostLogoutRedirectUris
¡¡ -
=
¡¡. /
client
¡¡0 6
.
¡¡6 7$
PostLogoutRedirectUris
¡¡7 M
.
¡¡M N
Where
¡¡N S
(
¡¡S T
x
¡¡T U
=>
¡¡V X
x
¡¡Y Z
.
¡¡Z [
ClientId
¡¡[ c
==
¡¡d f
client
¡¡g m
.
¡¡m n
Id
¡¡n p
)
¡¡p q
.
¡¡q r
FirstOrDefault¡¡r Ä
(¡¡Ä Å
)¡¡Å Ç
;¡¡Ç É"
objAllowedCorsOrigin
√√ $
.
√√$ %
Origin
√√% +
=
√√, -
AllowedCorsOrigin
√√. ?
;
√√? @
objRedirectUris
ƒƒ 
.
ƒƒ  
RedirectUri
ƒƒ  +
=
ƒƒ, -
RedirectUri
ƒƒ. 9
;
ƒƒ9 :'
objPostLogoutRedirectUris
≈≈ )
.
≈≈) *#
PostLogoutRedirectUri
≈≈* ?
=
≈≈@ A#
PostLogoutRedirectUri
≈≈B W
;
≈≈W X
await
«« %
_configurationDbContext
«« -
.
««- .
SaveChangesAsync
««. >
(
««> ?
)
««? @
;
««@ A
return
…… 
Ok
…… 
(
…… 
new
…… 
{
…… 
ClientID
……  (
=
……) *
client
……+ 1
.
……1 2
ClientId
……2 :
,
……: ;
id
……< >
=
……? @
client
……A G
.
……G H
Id
……H J
}
……K L
)
……L M
;
……M N
}
ÀÀ 
return
ÃÃ 
Ok
ÃÃ 
(
ÃÃ 
new
ÃÃ 
{
ÃÃ 
ClientID
ÃÃ $
=
ÃÃ% &
$str
ÃÃ' )
,
ÃÃ) *
id
ÃÃ+ -
=
ÃÃ. /
$str
ÃÃ0 2
}
ÃÃ3 4
)
ÃÃ4 5
;
ÃÃ5 6
}
ÕÕ 	
[
’’ 	
HttpPost
’’	 
]
’’ 
public
÷÷ 
async
÷÷ 
Task
÷÷ 
<
÷÷ 
IActionResult
÷÷ '
>
÷÷' (&
ManageApplicationClients
÷÷) A
(
÷÷A B(
ApplicationClientViewModel
÷÷B \
model
÷÷] b
)
÷÷b c
{
◊◊ 	
string
ÿÿ #
PostLogoutRedirectUri
ÿÿ (
=
ÿÿ) *
model
ÿÿ+ 0
.
ÿÿ0 1#
PostLogoutRedirectUri
ÿÿ1 F
;
ÿÿF G

Dictionary
⁄⁄ 
<
⁄⁄ 
string
⁄⁄ 
,
⁄⁄ 
string
⁄⁄ %
>
⁄⁄% &

properties
⁄⁄' 1
=
⁄⁄2 3
new
€€ 

Dictionary
€€ %
<
€€% &
string
€€& ,
,
€€, -
string
€€. 4
>
€€4 5
(
€€5 6
)
€€6 7
;
€€7 8
var
‹‹ 
clientSecret
‹‹ 
=
‹‹ 
model
‹‹ $
.
‹‹$ %
ClientSceret
‹‹% 1
;
‹‹1 2
var
›› 
clientModel
›› 
=
›› 
new
›› !
Client
››" (
{
ﬁﬁ 
ClientId
ﬂﬂ 
=
ﬂﬂ 
model
ﬂﬂ  
.
ﬂﬂ  !
ClientID
ﬂﬂ! )
,
ﬂﬂ) *

ClientName
‡‡ 
=
‡‡ 
model
‡‡ "
.
‡‡" #
ClientID
‡‡# +
,
‡‡+ ,
ClientSecrets
·· 
=
·· 
new
··  #
List
··$ (
<
··( )
Secret
··) /
>
··/ 0
{
‚‚ 
new
„„ 
Secret
„„ 
(
„„ 
clientSecret
„„ +
.
„„+ ,
Sha256
„„, 2
(
„„2 3
)
„„3 4
)
„„4 5
}
‰‰ 
,
‰‰ 
Enabled
ÂÂ 
=
ÂÂ 
true
ÂÂ 
,
ÂÂ 
ProtocolType
ÊÊ 
=
ÊÊ 
$str
ÊÊ %
,
ÊÊ% &!
RequireClientSecret
ÁÁ #
=
ÁÁ$ %
false
ÁÁ& +
,
ÁÁ+ ,
RequireConsent
ËË 
=
ËË  
false
ËË! &
,
ËË& '"
AllowRememberConsent
ÈÈ $
=
ÈÈ% &
true
ÈÈ' +
,
ÈÈ+ ,.
 AlwaysIncludeUserClaimsInIdToken
ÍÍ 0
=
ÍÍ1 2
false
ÍÍ3 8
,
ÍÍ8 9
RequirePkce
ÎÎ 
=
ÎÎ 
true
ÎÎ "
,
ÎÎ" # 
AllowPlainTextPkce
ÏÏ "
=
ÏÏ# $
false
ÏÏ% *
,
ÏÏ* +)
AllowAccessTokensViaBrowser
ÌÌ +
=
ÌÌ, -
model
ÌÌ. 3
.
ÌÌ3 4)
AllowAccessTokensViaBrowser
ÌÌ4 O
,
ÌÌO P#
FrontChannelLogoutUri
ÓÓ %
=
ÓÓ& '
model
ÓÓ( -
.
ÓÓ- .#
FrontChannelLogoutUri
ÓÓ. C
,
ÓÓC D/
!FrontChannelLogoutSessionRequired
ÔÔ 1
=
ÔÔ2 3
true
ÔÔ4 8
,
ÔÔ8 9.
 BackChannelLogoutSessionRequired
 0
=
1 2
true
3 7
,
7 8 
AllowOfflineAccess
ÒÒ "
=
ÒÒ# $
true
ÒÒ% )
,
ÒÒ) *#
IdentityTokenLifetime
ÚÚ %
=
ÚÚ& '
$num
ÚÚ( ,
,
ÚÚ, -!
AccessTokenLifetime
ÛÛ #
=
ÛÛ$ %
$num
ÛÛ& *
,
ÛÛ* +'
AuthorizationCodeLifetime
ÙÙ )
=
ÙÙ* +
$num
ÙÙ, 0
,
ÙÙ0 1*
AbsoluteRefreshTokenLifetime
ıı ,
=
ıı- .
$num
ıı/ 7
,
ıı7 8)
SlidingRefreshTokenLifetime
ˆˆ +
=
ˆˆ, -
$num
ˆˆ. 6
,
ˆˆ6 7
RefreshTokenUsage
˜˜ !
=
˜˜" #

TokenUsage
˜˜$ .
.
˜˜. /
OneTimeOnly
˜˜/ :
,
˜˜: ;.
 UpdateAccessTokenClaimsOnRefresh
¯¯ 0
=
¯¯1 2
true
¯¯3 7
,
¯¯7 8$
RefreshTokenExpiration
˘˘ &
=
˘˘' (
TokenExpiration
˘˘) 8
.
˘˘8 9
Absolute
˘˘9 A
,
˘˘A B
AccessTokenType
˙˙ 
=
˙˙  !
AccessTokenType
˙˙" 1
.
˙˙1 2
Jwt
˙˙2 5
,
˙˙5 6
EnableLocalLogin
˚˚  
=
˚˚! "
true
˚˚# '
,
˚˚' (
IncludeJwtId
¸¸ 
=
¸¸ 
false
¸¸ $
,
¸¸$ %$
AlwaysSendClientClaims
˝˝ &
=
˝˝' (
false
˝˝) .
,
˝˝. / 
ClientClaimsPrefix
˛˛ "
=
˛˛# $
$str
˛˛% .
,
˛˛. / 
DeviceCodeLifetime
ˇˇ "
=
ˇˇ# $
$num
ˇˇ% )
,
ˇˇ) *
AllowedGrantTypes
ÅÅ !
=
ÅÅ" #

GrantTypes
ÅÅ$ .
.
ÅÅ. /
Code
ÅÅ/ 3
,
ÅÅ3 4$
PostLogoutRedirectUris
ÇÇ &
=
ÇÇ' (
new
ÇÇ) ,
List
ÇÇ- 1
<
ÇÇ1 2
string
ÇÇ2 8
>
ÇÇ8 9
{
ÉÉ #
PostLogoutRedirectUri
ÑÑ )
}
ÖÖ 
,
ÖÖ 
AllowedScopes
áá 
=
áá 
new
áá  #
List
áá$ (
<
áá( )
string
áá) /
>
áá/ 0
{
àà %
IdentityServerConstants
ââ +
.
ââ+ ,
StandardScopes
ââ, :
.
ââ: ;
OpenId
ââ; A
,
ââA B%
IdentityServerConstants
ää +
.
ää+ ,
StandardScopes
ää, :
.
ää: ;
Profile
ää; B
,
ääB C
ClientConstant
ãã "
.
ãã" #
	APIScopes
ãã# ,
.
ãã, -
IdentityServerAPI
ãã- >
.
ãã> ?
ToString
ãã? G
(
ããG H
)
ããH I
}
çç 
,
çç 

Properties
éé 
=
éé 

properties
éé '
}
èè 
;
èè 
if
ïï 
(
ïï 
model
ïï 
.
ïï 
AllowedScopes
ïï #
!=
ïï$ &
null
ïï' +
)
ïï+ ,
{
ññ 
model
óó 
.
óó 
AllowedScopes
óó #
.
óó# $
ToList
óó$ *
(
óó* +
)
óó+ ,
.
óó, -
ForEach
óó- 4
(
óó4 5
x
óó5 6
=>
óó7 9
{
òò 
clientModel
ôô 
.
ôô  
AllowedScopes
ôô  -
.
ôô- .
Add
ôô. 1
(
ôô1 2
x
ôô2 3
)
ôô3 4
;
ôô4 5
}
öö 
)
öö 
;
öö 
}
õõ 
if
ùù 
(
ùù 
model
ùù 
.
ùù  
AllowedCorsOrigins
ùù (
!=
ùù) +
null
ùù, 0
)
ùù0 1
{
ûû 
model
üü 
.
üü  
AllowedCorsOrigins
üü (
.
üü( )
ToList
üü) /
(
üü/ 0
)
üü0 1
.
üü1 2
ForEach
üü2 9
(
üü9 :
x
üü: ;
=>
üü< >
{
†† 
clientModel
°° 
.
°°   
AllowedCorsOrigins
°°  2
.
°°2 3
Add
°°3 6
(
°°6 7
x
°°7 8
)
°°8 9
;
°°9 :
}
¢¢ 
)
¢¢ 
;
¢¢ 
}
££ 
if
•• 
(
•• 
model
•• 
.
•• 
RedirectUris
•• "
!=
••# %
null
••& *
)
••* +
{
¶¶ 
model
ßß 
.
ßß 
RedirectUris
ßß "
.
ßß" #
ToList
ßß# )
(
ßß) *
)
ßß* +
.
ßß+ ,
ForEach
ßß, 3
(
ßß3 4
x
ßß4 5
=>
ßß6 8
{
®® 
clientModel
©© 
.
©©  
RedirectUris
©©  ,
.
©©, -
Add
©©- 0
(
©©0 1
x
©©1 2
)
©©2 3
;
©©3 4
}
™™ 
)
™™ 
;
™™ 
}
´´ %
_configurationDbContext
≠≠ #
.
≠≠# $
Clients
≠≠$ +
.
≠≠+ ,
Add
≠≠, /
(
≠≠/ 0
clientModel
≠≠0 ;
.
≠≠; <
ToEntity
≠≠< D
(
≠≠D E
)
≠≠E F
)
≠≠F G
;
≠≠G H
await
ØØ %
_configurationDbContext
ØØ )
.
ØØ) *
SaveChangesAsync
ØØ* :
(
ØØ: ;
)
ØØ; <
;
ØØ< =
var
±± 
objClint
±± 
=
±± %
_configurationDbContext
±± 2
.
±±2 3
Clients
±±3 :
.
±±: ;
Where
±±; @
(
±±@ A
x
±±A B
=>
±±C E
x
±±F G
.
±±G H

ClientName
±±H R
==
±±S U
model
±±V [
.
±±[ \
ClientID
±±\ d
)
±±d e
.
±±e f
FirstOrDefault
±±f t
(
±±t u
)
±±u v
;
±±v w
if
≥≥ 
(
≥≥ 
model
≥≥ 
.
≥≥ 
isDefaultApp
≥≥ "
)
≥≥" #
{
¥¥ 
var
µµ 
userList
µµ 
=
µµ 
_fjtDBContext
µµ ,
.
µµ, -
ApplicationUsers
µµ- =
.
µµ= >
ToList
µµ> D
(
µµD E
)
µµE F
;
µµF G
foreach
∂∂ 
(
∂∂ 
var
∂∂ 
user
∂∂ !
in
∂∂" $
userList
∂∂% -
)
∂∂- .
{
∑∑ !
ClientUserMappingVM
∏∏ '#
newClientUsersMapping
∏∏( =
=
∏∏> ?
new
∏∏@ C!
ClientUserMappingVM
∏∏D W
(
∏∏W X
)
∏∏X Y
{
ππ 
ClientId
∫∫  
=
∫∫! "
objClint
∫∫# +
.
∫∫+ ,
ClientId
∫∫, 4
,
∫∫4 5
UserId
ªª 
=
ªª  
user
ªª! %
.
ªª% &
Id
ªª& (
}
ºº 
;
ºº 
bool
ΩΩ 
mappingSuccess
ΩΩ '
=
ΩΩ( )
await
ΩΩ* /
_iUserRepository
ΩΩ0 @
.
ΩΩ@ A
AddClientUserMap
ΩΩA Q
(
ΩΩQ R#
newClientUsersMapping
ΩΩR g
)
ΩΩg h
;
ΩΩh i
}
ææ 
}
øø 
return
¡¡ 
Ok
¡¡ 
(
¡¡ 
new
¡¡ 
{
¡¡ 
Id
¡¡ 
=
¡¡  
objClint
¡¡! )
!=
¡¡* ,
null
¡¡- 1
?
¡¡2 3
objClint
¡¡4 <
.
¡¡< =
Id
¡¡= ?
:
¡¡@ A
$num
¡¡B C
,
¡¡C D
clientSecret
¡¡E Q
}
¡¡R S
)
¡¡S T
;
¡¡T U
}
¬¬ 	
}
≈≈ 
}∆∆ †
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
} ¡¨
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
ValidatedResources	vvv à
.
vvà â
RawScopeValues
vvâ ó
)
vvó ò
)
vvò ô
;
vvô ö
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
ÄÄ 
scopes
ÅÅ 
=
ÅÅ  
scopes
ÅÅ! '
.
ÅÅ' (
Where
ÅÅ( -
(
ÅÅ- .
x
ÅÅ. /
=>
ÅÅ0 2
x
ÅÅ3 4
!=
ÅÅ5 7
IdentityServer4
ÅÅ8 G
.
ÅÅG H%
IdentityServerConstants
ÅÅH _
.
ÅÅ_ `
StandardScopes
ÅÅ` n
.
ÅÅn o
OfflineAccess
ÅÅo |
)
ÅÅ| }
;
ÅÅ} ~
}
ÇÇ 
grantedConsent
ÑÑ "
=
ÑÑ# $
new
ÑÑ% (
ConsentResponse
ÑÑ) 8
{
ÖÖ 
RememberConsent
ÜÜ '
=
ÜÜ( )
model
ÜÜ* /
.
ÜÜ/ 0
RememberConsent
ÜÜ0 ?
,
ÜÜ? @#
ScopesValuesConsented
áá -
=
áá. /
scopes
áá0 6
.
áá6 7
ToArray
áá7 >
(
áá> ?
)
áá? @
,
áá@ A
Description
àà #
=
àà$ %
model
àà& +
.
àà+ ,
Description
àà, 7
}
ââ 
;
ââ 
await
åå 
_events
åå !
.
åå! "

RaiseAsync
åå" ,
(
åå, -
new
åå- 0!
ConsentGrantedEvent
åå1 D
(
ååD E
User
ååE I
.
ååI J
GetSubjectId
ååJ V
(
ååV W
)
ååW X
,
ååX Y
request
ååZ a
.
ååa b
Client
ååb h
.
ååh i
ClientId
ååi q
,
ååq r
request
åås z
.
ååz {!
ValidatedResourcesåå{ ç
.ååç é
RawScopeValuesååé ú
,ååú ù
grantedConsentååû ¨
.åå¨ ≠%
ScopesValuesConsentedåå≠ ¬
,åå¬ √
grantedConsentååƒ “
.åå“ ”
RememberConsentåå” ‚
)åå‚ „
)åå„ ‰
;åå‰ Â
}
çç 
else
éé 
{
èè 
result
êê 
.
êê 
ValidationError
êê *
=
êê+ ,
ConsentOptions
êê- ;
.
êê; <'
MustChooseOneErrorMessage
êê< U
;
êêU V
}
ëë 
}
íí 
else
ìì 
{
îî 
result
ïï 
.
ïï 
ValidationError
ïï &
=
ïï' (
ConsentOptions
ïï) 7
.
ïï7 8*
InvalidSelectionErrorMessage
ïï8 T
;
ïïT U
}
ññ 
if
òò 
(
òò 
grantedConsent
òò 
!=
òò !
null
òò" &
)
òò& '
{
ôô 
await
õõ 
_interaction
õõ "
.
õõ" #
GrantConsentAsync
õõ# 4
(
õõ4 5
request
õõ5 <
,
õõ< =
grantedConsent
õõ> L
)
õõL M
;
õõM N
result
ûû 
.
ûû 
RedirectUri
ûû "
=
ûû# $
model
ûû% *
.
ûû* +
	ReturnUrl
ûû+ 4
;
ûû4 5
result
üü 
.
üü 
ClientId
üü 
=
üü  !
request
üü" )
.
üü) *
Client
üü* 0
.
üü0 1
ClientId
üü1 9
;
üü9 :
}
†† 
else
°° 
{
¢¢ 
result
§§ 
.
§§ 
	ViewModel
§§  
=
§§! "
await
§§# (!
BuildViewModelAsync
§§) <
(
§§< =
model
§§= B
.
§§B C
	ReturnUrl
§§C L
,
§§L M
model
§§N S
)
§§S T
;
§§T U
}
•• 
return
ßß 
result
ßß 
;
ßß 
}
®® 	
private
™™ 
async
™™ 
Task
™™ 
<
™™ 
ConsentViewModel
™™ +
>
™™+ ,!
BuildViewModelAsync
™™- @
(
™™@ A
string
™™A G
	returnUrl
™™H Q
,
™™Q R
ConsentInputModel
™™S d
model
™™e j
=
™™k l
null
™™m q
)
™™q r
{
´´ 	
var
¨¨ 
request
¨¨ 
=
¨¨ 
await
¨¨ 
_interaction
¨¨  ,
.
¨¨, -*
GetAuthorizationContextAsync
¨¨- I
(
¨¨I J
	returnUrl
¨¨J S
)
¨¨S T
;
¨¨T U
if
≠≠ 
(
≠≠ 
request
≠≠ 
!=
≠≠ 
null
≠≠ 
)
≠≠  
{
ÆÆ 
return
ØØ $
CreateConsentViewModel
ØØ -
(
ØØ- .
model
ØØ. 3
,
ØØ3 4
	returnUrl
ØØ5 >
,
ØØ> ?
request
ØØ@ G
)
ØØG H
;
ØØH I
}
∞∞ 
else
±± 
{
≤≤ 
_logger
≥≥ 
.
≥≥ 
LogError
≥≥  
(
≥≥  !
$str
≥≥! K
,
≥≥K L
	returnUrl
≥≥M V
)
≥≥V W
;
≥≥W X
}
¥¥ 
return
∂∂ 
null
∂∂ 
;
∂∂ 
}
∑∑ 	
private
ππ 
ConsentViewModel
ππ  $
CreateConsentViewModel
ππ! 7
(
ππ7 8
ConsentInputModel
ππ8 I
model
ππJ O
,
ππO P
string
ππQ W
	returnUrl
ππX a
,
ππa b"
AuthorizationRequest
ππc w
request
ππx 
)ππ Ä
{
∫∫ 	
var
ªª 
vm
ªª 
=
ªª 
new
ªª 
ConsentViewModel
ªª )
{
ºº 
RememberConsent
ΩΩ 
=
ΩΩ  !
model
ΩΩ" '
?
ΩΩ' (
.
ΩΩ( )
RememberConsent
ΩΩ) 8
??
ΩΩ9 ;
true
ΩΩ< @
,
ΩΩ@ A
ScopesConsented
ææ 
=
ææ  !
model
ææ" '
?
ææ' (
.
ææ( )
ScopesConsented
ææ) 8
??
ææ9 ;

Enumerable
ææ< F
.
ææF G
Empty
ææG L
<
ææL M
string
ææM S
>
ææS T
(
ææT U
)
ææU V
,
ææV W
Description
øø 
=
øø 
model
øø #
?
øø# $
.
øø$ %
Description
øø% 0
,
øø0 1
	ReturnUrl
¡¡ 
=
¡¡ 
	returnUrl
¡¡ %
,
¡¡% &

ClientName
√√ 
=
√√ 
request
√√ $
.
√√$ %
Client
√√% +
.
√√+ ,

ClientName
√√, 6
??
√√7 9
request
√√: A
.
√√A B
Client
√√B H
.
√√H I
ClientId
√√I Q
,
√√Q R
	ClientUrl
ƒƒ 
=
ƒƒ 
request
ƒƒ #
.
ƒƒ# $
Client
ƒƒ$ *
.
ƒƒ* +
	ClientUri
ƒƒ+ 4
,
ƒƒ4 5
ClientLogoUrl
≈≈ 
=
≈≈ 
request
≈≈  '
.
≈≈' (
Client
≈≈( .
.
≈≈. /
LogoUri
≈≈/ 6
,
≈≈6 7"
AllowRememberConsent
∆∆ $
=
∆∆% &
request
∆∆' .
.
∆∆. /
Client
∆∆/ 5
.
∆∆5 6"
AllowRememberConsent
∆∆6 J
}
«« 
;
«« 
vm
…… 
.
…… 
IdentityScopes
…… 
=
…… 
request
……  '
.
……' ( 
ValidatedResources
……( :
.
……: ;
	Resources
……; D
.
……D E
IdentityResources
……E V
.
……V W
Select
……W ]
(
……] ^
x
……^ _
=>
……` b"
CreateScopeViewModel
……c w
(
……w x
x
……x y
,
……y z
vm
……{ }
.
……} ~
ScopesConsented……~ ç
.……ç é
Contains……é ñ
(……ñ ó
x……ó ò
.……ò ô
Name……ô ù
)……ù û
||……ü °
model……¢ ß
==……® ™
null……´ Ø
)……Ø ∞
)……∞ ±
.……± ≤
ToArray……≤ π
(……π ∫
)……∫ ª
;……ª º
var
ÀÀ 
	apiScopes
ÀÀ 
=
ÀÀ 
new
ÀÀ 
List
ÀÀ  $
<
ÀÀ$ %
ScopeViewModel
ÀÀ% 3
>
ÀÀ3 4
(
ÀÀ4 5
)
ÀÀ5 6
;
ÀÀ6 7
foreach
ÃÃ 
(
ÃÃ 
var
ÃÃ 
parsedScope
ÃÃ $
in
ÃÃ% '
request
ÃÃ( /
.
ÃÃ/ 0 
ValidatedResources
ÃÃ0 B
.
ÃÃB C
ParsedScopes
ÃÃC O
)
ÃÃO P
{
ÕÕ 
var
ŒŒ 
apiScope
ŒŒ 
=
ŒŒ 
request
ŒŒ &
.
ŒŒ& ' 
ValidatedResources
ŒŒ' 9
.
ŒŒ9 :
	Resources
ŒŒ: C
.
ŒŒC D
FindApiScope
ŒŒD P
(
ŒŒP Q
parsedScope
ŒŒQ \
.
ŒŒ\ ]

ParsedName
ŒŒ] g
)
ŒŒg h
;
ŒŒh i
if
œœ 
(
œœ 
apiScope
œœ 
!=
œœ 
null
œœ  $
)
œœ$ %
{
–– 
var
—— 
scopeVm
—— 
=
——  !"
CreateScopeViewModel
——" 6
(
——6 7
parsedScope
——7 B
,
——B C
apiScope
——D L
,
——L M
vm
——N P
.
——P Q
ScopesConsented
——Q `
.
——` a
Contains
——a i
(
——i j
parsedScope
——j u
.
——u v
RawValue
——v ~
)
——~ 
||——Ä Ç
model——É à
==——â ã
null——å ê
)——ê ë
;——ë í
	apiScopes
““ 
.
““ 
Add
““ !
(
““! "
scopeVm
““" )
)
““) *
;
““* +
}
”” 
}
‘‘ 
if
’’ 
(
’’ 
ConsentOptions
’’ 
.
’’ !
EnableOfflineAccess
’’ 2
&&
’’3 5
request
’’6 =
.
’’= > 
ValidatedResources
’’> P
.
’’P Q
	Resources
’’Q Z
.
’’Z [
OfflineAccess
’’[ h
)
’’h i
{
÷÷ 
	apiScopes
◊◊ 
.
◊◊ 
Add
◊◊ 
(
◊◊ #
GetOfflineAccessScope
◊◊ 3
(
◊◊3 4
vm
◊◊4 6
.
◊◊6 7
ScopesConsented
◊◊7 F
.
◊◊F G
Contains
◊◊G O
(
◊◊O P
IdentityServer4
◊◊P _
.
◊◊_ `%
IdentityServerConstants
◊◊` w
.
◊◊w x
StandardScopes◊◊x Ü
.◊◊Ü á
OfflineAccess◊◊á î
)◊◊î ï
||◊◊ñ ò
model◊◊ô û
==◊◊ü °
null◊◊¢ ¶
)◊◊¶ ß
)◊◊ß ®
;◊◊® ©
}
ÿÿ 
vm
ŸŸ 
.
ŸŸ 
	ApiScopes
ŸŸ 
=
ŸŸ 
	apiScopes
ŸŸ $
;
ŸŸ$ %
return
€€ 
vm
€€ 
;
€€ 
}
‹‹ 	
private
ﬁﬁ 
ScopeViewModel
ﬁﬁ "
CreateScopeViewModel
ﬁﬁ 3
(
ﬁﬁ3 4
IdentityResource
ﬁﬁ4 D
identity
ﬁﬁE M
,
ﬁﬁM N
bool
ﬁﬁO S
check
ﬁﬁT Y
)
ﬁﬁY Z
{
ﬂﬂ 	
return
‡‡ 
new
‡‡ 
ScopeViewModel
‡‡ %
{
·· 
Value
‚‚ 
=
‚‚ 
identity
‚‚  
.
‚‚  !
Name
‚‚! %
,
‚‚% &
DisplayName
„„ 
=
„„ 
identity
„„ &
.
„„& '
DisplayName
„„' 2
,
„„2 3
Description
‰‰ 
=
‰‰ 
identity
‰‰ &
.
‰‰& '
Description
‰‰' 2
,
‰‰2 3
	Emphasize
ÂÂ 
=
ÂÂ 
identity
ÂÂ $
.
ÂÂ$ %
	Emphasize
ÂÂ% .
,
ÂÂ. /
Required
ÊÊ 
=
ÊÊ 
identity
ÊÊ #
.
ÊÊ# $
Required
ÊÊ$ ,
,
ÊÊ, -
Checked
ÁÁ 
=
ÁÁ 
check
ÁÁ 
||
ÁÁ  "
identity
ÁÁ# +
.
ÁÁ+ ,
Required
ÁÁ, 4
}
ËË 
;
ËË 
}
ÈÈ 	
public
ÎÎ 
ScopeViewModel
ÎÎ "
CreateScopeViewModel
ÎÎ 2
(
ÎÎ2 3
ParsedScopeValue
ÎÎ3 C
parsedScopeValue
ÎÎD T
,
ÎÎT U
ApiScope
ÎÎV ^
apiScope
ÎÎ_ g
,
ÎÎg h
bool
ÎÎi m
check
ÎÎn s
)
ÎÎs t
{
ÏÏ 	
var
ÌÌ 
displayName
ÌÌ 
=
ÌÌ 
apiScope
ÌÌ &
.
ÌÌ& '
DisplayName
ÌÌ' 2
??
ÌÌ3 5
apiScope
ÌÌ6 >
.
ÌÌ> ?
Name
ÌÌ? C
;
ÌÌC D
if
ÓÓ 
(
ÓÓ 
!
ÓÓ 
String
ÓÓ 
.
ÓÓ  
IsNullOrWhiteSpace
ÓÓ *
(
ÓÓ* +
parsedScopeValue
ÓÓ+ ;
.
ÓÓ; <
ParsedParameter
ÓÓ< K
)
ÓÓK L
)
ÓÓL M
{
ÔÔ 
displayName
 
+=
 
$str
 "
+
# $
parsedScopeValue
% 5
.
5 6
ParsedParameter
6 E
;
E F
}
ÒÒ 
return
ÛÛ 
new
ÛÛ 
ScopeViewModel
ÛÛ %
{
ÙÙ 
Value
ıı 
=
ıı 
parsedScopeValue
ıı (
.
ıı( )
RawValue
ıı) 1
,
ıı1 2
DisplayName
ˆˆ 
=
ˆˆ 
displayName
ˆˆ )
,
ˆˆ) *
Description
˜˜ 
=
˜˜ 
apiScope
˜˜ &
.
˜˜& '
Description
˜˜' 2
,
˜˜2 3
	Emphasize
¯¯ 
=
¯¯ 
apiScope
¯¯ $
.
¯¯$ %
	Emphasize
¯¯% .
,
¯¯. /
Required
˘˘ 
=
˘˘ 
apiScope
˘˘ #
.
˘˘# $
Required
˘˘$ ,
,
˘˘, -
Checked
˙˙ 
=
˙˙ 
check
˙˙ 
||
˙˙  "
apiScope
˙˙# +
.
˙˙+ ,
Required
˙˙, 4
}
˚˚ 
;
˚˚ 
}
¸¸ 	
private
˛˛ 
ScopeViewModel
˛˛ #
GetOfflineAccessScope
˛˛ 4
(
˛˛4 5
bool
˛˛5 9
check
˛˛: ?
)
˛˛? @
{
ˇˇ 	
return
ÄÄ 
new
ÄÄ 
ScopeViewModel
ÄÄ %
{
ÅÅ 
Value
ÇÇ 
=
ÇÇ 
IdentityServer4
ÇÇ '
.
ÇÇ' (%
IdentityServerConstants
ÇÇ( ?
.
ÇÇ? @
StandardScopes
ÇÇ@ N
.
ÇÇN O
OfflineAccess
ÇÇO \
,
ÇÇ\ ]
DisplayName
ÉÉ 
=
ÉÉ 
ConsentOptions
ÉÉ ,
.
ÉÉ, -&
OfflineAccessDisplayName
ÉÉ- E
,
ÉÉE F
Description
ÑÑ 
=
ÑÑ 
ConsentOptions
ÑÑ ,
.
ÑÑ, -&
OfflineAccessDescription
ÑÑ- E
,
ÑÑE F
	Emphasize
ÖÖ 
=
ÖÖ 
true
ÖÖ  
,
ÖÖ  !
Checked
ÜÜ 
=
ÜÜ 
check
ÜÜ 
}
áá 
;
áá 
}
àà 	
}
ââ 
}ää ∑	
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
} Œ
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
} ª
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
} ´
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
} Ô	
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
} ±
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
} œ
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
} î©
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
ValidatedResources	__v à
.
__à â
RawScopeValues
__â ó
)
__ó ò
)
__ò ô
;
__ô ö
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
ValidatedResources	uu{ ç
.
uuç é
RawScopeValues
uué ú
,
uuú ù
grantedConsent
uuû ¨
.
uu¨ ≠#
ScopesValuesConsented
uu≠ ¬
,
uu¬ √
grantedConsent
uuƒ “
.
uu“ ”
RememberConsent
uu” ‚
)
uu‚ „
)
uu„ ‰
;
uu‰ Â
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
ÅÅ 
(
ÅÅ 
grantedConsent
ÅÅ 
!=
ÅÅ !
null
ÅÅ" &
)
ÅÅ& '
{
ÇÇ 
await
ÑÑ 
_interaction
ÑÑ "
.
ÑÑ" # 
HandleRequestAsync
ÑÑ# 5
(
ÑÑ5 6
model
ÑÑ6 ;
.
ÑÑ; <
UserCode
ÑÑ< D
,
ÑÑD E
grantedConsent
ÑÑF T
)
ÑÑT U
;
ÑÑU V
result
áá 
.
áá 
RedirectUri
áá "
=
áá# $
model
áá% *
.
áá* +
	ReturnUrl
áá+ 4
;
áá4 5
result
àà 
.
àà 
ClientId
àà 
=
àà  !
request
àà" )
.
àà) *
Client
àà* 0
.
àà0 1
ClientId
àà1 9
;
àà9 :
}
ââ 
else
ää 
{
ãã 
result
çç 
.
çç 
	ViewModel
çç  
=
çç! "
await
çç# (!
BuildViewModelAsync
çç) <
(
çç< =
model
çç= B
.
ççB C
UserCode
ççC K
,
ççK L
model
ççM R
)
ççR S
;
ççS T
}
éé 
return
êê 
result
êê 
;
êê 
}
ëë 	
private
ìì 
async
ìì 
Task
ìì 
<
ìì *
DeviceAuthorizationViewModel
ìì 7
>
ìì7 8!
BuildViewModelAsync
ìì9 L
(
ììL M
string
ììM S
userCode
ììT \
,
ìì\ ]+
DeviceAuthorizationInputModel
ìì^ {
modelìì| Å
=ììÇ É
nullììÑ à
)ììà â
{
îî 	
var
ïï 
request
ïï 
=
ïï 
await
ïï 
_interaction
ïï  ,
.
ïï, -*
GetAuthorizationContextAsync
ïï- I
(
ïïI J
userCode
ïïJ R
)
ïïR S
;
ïïS T
if
ññ 
(
ññ 
request
ññ 
!=
ññ 
null
ññ 
)
ññ  
{
óó 
return
òò $
CreateConsentViewModel
òò -
(
òò- .
userCode
òò. 6
,
òò6 7
model
òò8 =
,
òò= >
request
òò? F
)
òòF G
;
òòG H
}
ôô 
return
õõ 
null
õõ 
;
õõ 
}
úú 	
private
ûû *
DeviceAuthorizationViewModel
ûû ,$
CreateConsentViewModel
ûû- C
(
ûûC D
string
ûûD J
userCode
ûûK S
,
ûûS T+
DeviceAuthorizationInputModel
ûûU r
model
ûûs x
,
ûûx y-
DeviceFlowAuthorizationRequestûûz ò
requestûûô †
)ûû† °
{
üü 	
var
†† 
vm
†† 
=
†† 
new
†† *
DeviceAuthorizationViewModel
†† 5
{
°° 
UserCode
¢¢ 
=
¢¢ 
userCode
¢¢ #
,
¢¢# $
Description
££ 
=
££ 
model
££ #
?
££# $
.
££$ %
Description
££% 0
,
££0 1
RememberConsent
•• 
=
••  !
model
••" '
?
••' (
.
••( )
RememberConsent
••) 8
??
••9 ;
true
••< @
,
••@ A
ScopesConsented
¶¶ 
=
¶¶  !
model
¶¶" '
?
¶¶' (
.
¶¶( )
ScopesConsented
¶¶) 8
??
¶¶9 ;

Enumerable
¶¶< F
.
¶¶F G
Empty
¶¶G L
<
¶¶L M
string
¶¶M S
>
¶¶S T
(
¶¶T U
)
¶¶U V
,
¶¶V W

ClientName
®® 
=
®® 
request
®® $
.
®®$ %
Client
®®% +
.
®®+ ,

ClientName
®®, 6
??
®®7 9
request
®®: A
.
®®A B
Client
®®B H
.
®®H I
ClientId
®®I Q
,
®®Q R
	ClientUrl
©© 
=
©© 
request
©© #
.
©©# $
Client
©©$ *
.
©©* +
	ClientUri
©©+ 4
,
©©4 5
ClientLogoUrl
™™ 
=
™™ 
request
™™  '
.
™™' (
Client
™™( .
.
™™. /
LogoUri
™™/ 6
,
™™6 7"
AllowRememberConsent
´´ $
=
´´% &
request
´´' .
.
´´. /
Client
´´/ 5
.
´´5 6"
AllowRememberConsent
´´6 J
}
¨¨ 
;
¨¨ 
vm
ÆÆ 
.
ÆÆ 
IdentityScopes
ÆÆ 
=
ÆÆ 
request
ÆÆ  '
.
ÆÆ' ( 
ValidatedResources
ÆÆ( :
.
ÆÆ: ;
	Resources
ÆÆ; D
.
ÆÆD E
IdentityResources
ÆÆE V
.
ÆÆV W
Select
ÆÆW ]
(
ÆÆ] ^
x
ÆÆ^ _
=>
ÆÆ` b"
CreateScopeViewModel
ÆÆc w
(
ÆÆw x
x
ÆÆx y
,
ÆÆy z
vm
ÆÆ{ }
.
ÆÆ} ~
ScopesConsentedÆÆ~ ç
.ÆÆç é
ContainsÆÆé ñ
(ÆÆñ ó
xÆÆó ò
.ÆÆò ô
NameÆÆô ù
)ÆÆù û
||ÆÆü °
modelÆÆ¢ ß
==ÆÆ® ™
nullÆÆ´ Ø
)ÆÆØ ∞
)ÆÆ∞ ±
.ÆÆ± ≤
ToArrayÆÆ≤ π
(ÆÆπ ∫
)ÆÆ∫ ª
;ÆÆª º
var
∞∞ 
	apiScopes
∞∞ 
=
∞∞ 
new
∞∞ 
List
∞∞  $
<
∞∞$ %
ScopeViewModel
∞∞% 3
>
∞∞3 4
(
∞∞4 5
)
∞∞5 6
;
∞∞6 7
foreach
±± 
(
±± 
var
±± 
parsedScope
±± $
in
±±% '
request
±±( /
.
±±/ 0 
ValidatedResources
±±0 B
.
±±B C
ParsedScopes
±±C O
)
±±O P
{
≤≤ 
var
≥≥ 
apiScope
≥≥ 
=
≥≥ 
request
≥≥ &
.
≥≥& ' 
ValidatedResources
≥≥' 9
.
≥≥9 :
	Resources
≥≥: C
.
≥≥C D
FindApiScope
≥≥D P
(
≥≥P Q
parsedScope
≥≥Q \
.
≥≥\ ]

ParsedName
≥≥] g
)
≥≥g h
;
≥≥h i
if
¥¥ 
(
¥¥ 
apiScope
¥¥ 
!=
¥¥ 
null
¥¥  $
)
¥¥$ %
{
µµ 
var
∂∂ 
scopeVm
∂∂ 
=
∂∂  !"
CreateScopeViewModel
∂∂" 6
(
∂∂6 7
parsedScope
∂∂7 B
,
∂∂B C
apiScope
∂∂D L
,
∂∂L M
vm
∂∂N P
.
∂∂P Q
ScopesConsented
∂∂Q `
.
∂∂` a
Contains
∂∂a i
(
∂∂i j
parsedScope
∂∂j u
.
∂∂u v
RawValue
∂∂v ~
)
∂∂~ 
||∂∂Ä Ç
model∂∂É à
==∂∂â ã
null∂∂å ê
)∂∂ê ë
;∂∂ë í
	apiScopes
∑∑ 
.
∑∑ 
Add
∑∑ !
(
∑∑! "
scopeVm
∑∑" )
)
∑∑) *
;
∑∑* +
}
∏∏ 
}
ππ 
if
∫∫ 
(
∫∫ 
ConsentOptions
∫∫ 
.
∫∫ !
EnableOfflineAccess
∫∫ 2
&&
∫∫3 5
request
∫∫6 =
.
∫∫= > 
ValidatedResources
∫∫> P
.
∫∫P Q
	Resources
∫∫Q Z
.
∫∫Z [
OfflineAccess
∫∫[ h
)
∫∫h i
{
ªª 
	apiScopes
ºº 
.
ºº 
Add
ºº 
(
ºº #
GetOfflineAccessScope
ºº 3
(
ºº3 4
vm
ºº4 6
.
ºº6 7
ScopesConsented
ºº7 F
.
ººF G
Contains
ººG O
(
ººO P
IdentityServer4
ººP _
.
ºº_ `%
IdentityServerConstants
ºº` w
.
ººw x
StandardScopesººx Ü
.ººÜ á
OfflineAccessººá î
)ººî ï
||ººñ ò
modelººô û
==ººü °
nullºº¢ ¶
)ºº¶ ß
)ººß ®
;ºº® ©
}
ΩΩ 
vm
ææ 
.
ææ 
	ApiScopes
ææ 
=
ææ 
	apiScopes
ææ $
;
ææ$ %
return
¿¿ 
vm
¿¿ 
;
¿¿ 
}
¡¡ 	
private
√√ 
ScopeViewModel
√√ "
CreateScopeViewModel
√√ 3
(
√√3 4
IdentityResource
√√4 D
identity
√√E M
,
√√M N
bool
√√O S
check
√√T Y
)
√√Y Z
{
ƒƒ 	
return
≈≈ 
new
≈≈ 
ScopeViewModel
≈≈ %
{
∆∆ 
Value
«« 
=
«« 
identity
««  
.
««  !
Name
««! %
,
««% &
DisplayName
»» 
=
»» 
identity
»» &
.
»»& '
DisplayName
»»' 2
??
»»3 5
identity
»»6 >
.
»»> ?
Name
»»? C
,
»»C D
Description
…… 
=
…… 
identity
…… &
.
……& '
Description
……' 2
,
……2 3
	Emphasize
   
=
   
identity
   $
.
  $ %
	Emphasize
  % .
,
  . /
Required
ÀÀ 
=
ÀÀ 
identity
ÀÀ #
.
ÀÀ# $
Required
ÀÀ$ ,
,
ÀÀ, -
Checked
ÃÃ 
=
ÃÃ 
check
ÃÃ 
||
ÃÃ  "
identity
ÃÃ# +
.
ÃÃ+ ,
Required
ÃÃ, 4
}
ÕÕ 
;
ÕÕ 
}
ŒŒ 	
public
–– 
ScopeViewModel
–– "
CreateScopeViewModel
–– 2
(
––2 3
ParsedScopeValue
––3 C
parsedScopeValue
––D T
,
––T U
ApiScope
––V ^
apiScope
––_ g
,
––g h
bool
––i m
check
––n s
)
––s t
{
—— 	
return
““ 
new
““ 
ScopeViewModel
““ %
{
”” 
Value
‘‘ 
=
‘‘ 
parsedScopeValue
‘‘ (
.
‘‘( )
RawValue
‘‘) 1
,
‘‘1 2
DisplayName
÷÷ 
=
÷÷ 
apiScope
÷÷ &
.
÷÷& '
DisplayName
÷÷' 2
??
÷÷3 5
apiScope
÷÷6 >
.
÷÷> ?
Name
÷÷? C
,
÷÷C D
Description
◊◊ 
=
◊◊ 
apiScope
◊◊ &
.
◊◊& '
Description
◊◊' 2
,
◊◊2 3
	Emphasize
ÿÿ 
=
ÿÿ 
apiScope
ÿÿ $
.
ÿÿ$ %
	Emphasize
ÿÿ% .
,
ÿÿ. /
Required
ŸŸ 
=
ŸŸ 
apiScope
ŸŸ #
.
ŸŸ# $
Required
ŸŸ$ ,
,
ŸŸ, -
Checked
⁄⁄ 
=
⁄⁄ 
check
⁄⁄ 
||
⁄⁄  "
apiScope
⁄⁄# +
.
⁄⁄+ ,
Required
⁄⁄, 4
}
€€ 
;
€€ 
}
‹‹ 	
private
›› 
ScopeViewModel
›› #
GetOfflineAccessScope
›› 4
(
››4 5
bool
››5 9
check
››: ?
)
››? @
{
ﬁﬁ 	
return
ﬂﬂ 
new
ﬂﬂ 
ScopeViewModel
ﬂﬂ %
{
‡‡ 
Value
·· 
=
·· 
IdentityServer4
·· '
.
··' (%
IdentityServerConstants
··( ?
.
··? @
StandardScopes
··@ N
.
··N O
OfflineAccess
··O \
,
··\ ]
DisplayName
‚‚ 
=
‚‚ 
ConsentOptions
‚‚ ,
.
‚‚, -&
OfflineAccessDisplayName
‚‚- E
,
‚‚E F
Description
„„ 
=
„„ 
ConsentOptions
„„ ,
.
„„, -&
OfflineAccessDescription
„„- E
,
„„E F
	Emphasize
‰‰ 
=
‰‰ 
true
‰‰  
,
‰‰  !
Checked
ÂÂ 
=
ÂÂ 
check
ÂÂ 
}
ÊÊ 
;
ÊÊ 
}
ÁÁ 	
}
ËË 
}ÈÈ Å
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
} Û
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
}   ç

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
} ›1
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
}`` ˚
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
} Ê
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
} ◊
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
HomeController	v Ñ
>
Ñ Ö
logger
Ü å
)
å ç
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
}AA “
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
$str	 å
;
å ç
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
}99 ı%
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
ClaimValueTypes	++x á
.
++á à
Json
++à å
)
++å ç
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
ClaimValueTypes	;;x á
.
;;á à
Json
;;à å
)
;;å ç
}<< 
}== 
}>> 
;>> 
}?? 
}@@ 	
}AA 
}BB ‘.
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
AgreementListDetailsMapper	##o â
,
##â ä
sql
##ã é
,
##é è

parameters
##ê ö
)
##ö õ
;
##õ ú
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
GetAgreementDetailDetailsMapper	))t ì
,
))ì î
sql
))ï ò
,
))ò ô
	parameter
))ö £
)
))£ §
;
))§ •
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
$UserSignUpAgreementListDetailsMapper	//y ù
,
//ù û
sql
//ü ¢
,
//¢ £

parameters
//§ Æ
)
//Æ Ø
;
//Ø ∞
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

parameters	33z Ñ
)
33Ñ Ö
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
'ArchieveVersionDetailsListDetailsMapper	55| £
,
55£ §
sql
55• ®
,
55® ©

parameters
55™ ¥
)
55¥ µ
;
55µ ∂
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
 GetAgreedUserListVMDetailsMapper	;;u ï
,
;;ï ñ
sql
;;ó ö
,
;;ö õ

parameters
;;ú ¶
)
;;¶ ß
;
;;ß ®
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

parameters	??x Ç
)
??Ç É
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
'DownloadAgreementDetailsVMDetailsMapper	AA| £
,
AA£ §
sql
AA• ®
,
AA® ©

parameters
AA™ ¥
)
AA¥ µ
;
AAµ ∂
returnBB 
resultsBB 
;BB 
}CC 	
}EE 
}FF —
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
DynamicMessage	!!~ å
{
!!ç é
messageType
!!è ö
=
!!õ ú
$str
!!ù §
,
!!§ •
message
!!¶ ≠
=
!!Æ Ø
Constant
!!∞ ∏
.
!!∏ π&
MONGODB_CONNECTION_ERROR
!!π —
}
!!“ ”
;
!!” ‘
}"" 
}## •
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
},, å0
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
)	 Ä
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
messageType	((v Å
,
((Å Ç
messageCode
((É é
=
((è ê
somethingWrongMSG
((ë ¢
.
((¢ £
messageCode
((£ Æ
,
((Æ Ø
message
((∞ ∑
=
((∏ π
somethingWrongMSG
((∫ À
.
((À Ã
message
((Ã ”
,
((” ‘
err
((’ ÿ
=
((Ÿ ⁄
new
((€ ﬁ
ErrorVM
((ﬂ Ê
{
((Á Ë
message
((È 
=
((Ò Ú
e
((Û Ù
.
((Ù ı
Message
((ı ¸
,
((¸ ˝
stack
((˛ É
=
((Ñ Ö
e
((Ü á
.
((á à

StackTrace
((à í
}
((ì î
}
((ï ñ
}
((ó ò
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
}II è
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
} Õ
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
} ä
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
} ë
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
} Ï
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
} À
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
} ™
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
} ∆

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
} å&
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
false	} Ç
)
Ç É
.
É Ñ
Select
Ñ ä
(
ä ã
x
ã å
=>
ç è
x
ê ë
.
ë í
values
í ò
)
ò ô
.
ô ö
FirstOrDefault
ö ®
(
® ©
)
© ™
;
™ ´
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
}66 ¬_
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
ClientId	@@y Å
==
@@Ç Ñ
objCientUsersMap
@@Ö ï
.
@@ï ñ
ClientId
@@ñ û
)
@@û ü
.
@@ü †!
FirstOrDefaultAsync
@@† ≥
(
@@≥ ¥
)
@@¥ µ
;
@@µ ∂
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
ClientId	]]y Å
==
]]Ç Ñ
objCientUsersMap
]]Ö ï
.
]]ï ñ
ClientId
]]ñ û
&&
]]ü °
x
]]¢ £
.
]]£ §
	isDeleted
]]§ ≠
==
]]Æ ∞
false
]]± ∂
)
]]∂ ∑
.
]]∑ ∏!
FirstOrDefaultAsync
]]∏ À
(
]]À Ã
)
]]Ã Õ
;
]]Õ Œ
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
ÇÇ 
userAgreements
ÇÇ &
=
ÇÇ' (
await
ÇÇ) .
_context
ÇÇ/ 7
.
ÇÇ7 8
UserAgreement
ÇÇ8 E
.
ÇÇE F
Where
ÇÇF K
(
ÇÇK L
x
ÇÇL M
=>
ÇÇN P
x
ÇÇQ R
.
ÇÇR S
userID
ÇÇS Y
==
ÇÇZ \
userId
ÇÇ] c
)
ÇÇc d
.
ÇÇd e
ToListAsync
ÇÇe p
(
ÇÇp q
)
ÇÇq r
;
ÇÇr s
foreach
ÉÉ 
(
ÉÉ 
var
ÉÉ  
item
ÉÉ! %
in
ÉÉ& (
userAgreements
ÉÉ) 7
)
ÉÉ7 8
{
ÑÑ 
item
ÖÖ 
.
ÖÖ 
	isDeleted
ÖÖ &
=
ÖÖ' (
true
ÖÖ) -
;
ÖÖ- .
_context
ÜÜ  
.
ÜÜ  !
UserAgreement
ÜÜ! .
.
ÜÜ. /
Update
ÜÜ/ 5
(
ÜÜ5 6
item
ÜÜ6 :
)
ÜÜ: ;
;
ÜÜ; <
}
áá 
}
àà 
await
ââ 
_context
ââ 
.
ââ 
SaveChangesAsync
ââ /
(
ââ/ 0
)
ââ0 1
;
ââ1 2
return
ää 
true
ää 
;
ää 
}
ãã 
catch
åå 
(
åå 
	Exception
åå 
e
åå 
)
åå 
{
çç 
return
éé 
false
éé 
;
éé 
}
èè 
}
êê 	
public
íí 
async
íí 
Task
íí 
<
íí 
bool
íí 
>
íí 0
"ClientUserMappingAvailabilityStaus
íí  B
(
ííB C
string
ííC I
UserId
ííJ P
,
ííP Q
string
ííR X
clientId
ííY a
)
íía b
{
ìì 	
try
îî 
{
ïï 
var
ññ 
objCUMapping
ññ  
=
ññ! "
await
ññ# (
_context
ññ) 1
.
ññ1 2 
ClientUsersMapping
ññ2 D
.
ññD E!
FirstOrDefaultAsync
ññE X
(
ññX Y
x
ññY Z
=>
ññ[ ]
x
ññ^ _
.
ññ_ `
UserId
ññ` f
==
ññg i
UserId
ññj p
&&
ññq s
x
ññt u
.
ññu v
	isDeleted
ññv 
==ññÄ Ç
falseññÉ à
&&ññâ ã
xññå ç
.ññç é
ClientIdññé ñ
==ññó ô
clientIdññö ¢
)ññ¢ £
;ññ£ §
if
òò 
(
òò 
objCUMapping
òò  
==
òò! #
null
òò$ (
)
òò( )
{
ôô 
return
öö 
false
öö  
;
öö  !
}
õõ 
else
úú 
{
ùù 
return
ûû 
true
ûû 
;
ûû  
}
üü 
}
†† 
catch
°° 
(
°° 
	Exception
°° 
e
°° 
)
°° 
{
¢¢ 
return
££ 
false
££ 
;
££ 
}
§§ 
}
•• 	
}
ßß 
}®® ¢'
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
claimsFactory	u Ç
)
Ç É
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
}77 ’¨
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
delegate	iiy Å
{
iiÇ É
return
iiÑ ä
true
iiã è
;
iiè ê
}
iië í
}
iiì î
;
iiî ï
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
ÄÄ +
=
ÄÄ, -
true
ÄÄ. 2
,
ÄÄ2 3$
CheckSessionCookieName
ÅÅ *
=
ÅÅ+ ,
(
ÅÅ- .
string
ÅÅ. 4
)
ÅÅ4 5
Configuration
ÅÅ5 B
.
ÅÅB C
GetValue
ÅÅC K
(
ÅÅK L
typeof
ÅÅL R
(
ÅÅR S
string
ÅÅS Y
)
ÅÅY Z
,
ÅÅZ [
$str
ÅÅ\ o
)
ÅÅo p
}
ÇÇ 
;
ÇÇ 
}
ÑÑ 
)
ÑÑ 
.
ÑÑ #
AddConfigurationStore
ÑÑ $
(
ÑÑ$ %
options
ÑÑ% ,
=>
ÑÑ- /
{
ÖÖ 
options
ÜÜ 
.
ÜÜ  
ConfigureDbContext
ÜÜ *
=
ÜÜ+ ,
b
ÜÜ- .
=>
ÜÜ/ 1
b
ÜÜ2 3
.
ÜÜ3 4
UseMySql
ÜÜ4 <
(
ÜÜ< =
connectionString
ÜÜ= M
,
ÜÜM N
sql
ÜÜO R
=>
ÜÜS U
sql
ÜÜV Y
.
ÜÜY Z 
MigrationsAssembly
ÜÜZ l
(
ÜÜl m 
migrationsAssembly
ÜÜm 
)ÜÜ Ä
)ÜÜÄ Å
;ÜÜÅ Ç
}
áá 
)
áá 
.
àà !
AddOperationalStore
àà $
(
àà$ %
options
àà% ,
=>
àà- /
{
ââ 
options
ää 
.
ää  
ConfigureDbContext
ää .
=
ää/ 0
b
ää1 2
=>
ää3 5
b
ää6 7
.
ää7 8
UseMySql
ää8 @
(
ää@ A
connectionString
ääA Q
,
ääQ R
sql
ääS V
=>
ääW Y
sql
ääZ ]
.
ää] ^ 
MigrationsAssembly
ää^ p
(
ääp q!
migrationsAssemblyääq É
)ääÉ Ñ
)ääÑ Ö
;ääÖ Ü
options
ãã 
.
ãã  
EnableTokenCleanup
ãã .
=
ãã/ 0
true
ãã1 5
;
ãã5 6
}
åå 
)
åå 
.
çç 
AddAspNetIdentity
çç "
<
çç" #
ApplicationUser
çç# 2
>
çç2 3
(
çç3 4
)
çç4 5
.
éé 
AddProfileService
éé "
<
éé" #
ProfileService
éé# 1
>
éé1 2
(
éé2 3
)
éé3 4
;
éé4 5
builder
èè 
.
èè 
Services
èè 
.
èè (
ConfigureApplicationCookie
èè 7
(
èè7 8
options
èè8 ?
=>
èè@ B
{
êê 
options
ëë 
.
ëë 
Cookie
ëë 
.
ëë 
Name
ëë #
=
ëë$ %
(
ëë& '
string
ëë' -
)
ëë- .
Configuration
ëë. ;
.
ëë; <
GetValue
ëë< D
(
ëëD E
typeof
ëëE K
(
ëëK L
string
ëëL R
)
ëëR S
,
ëëS T
$str
ëëU o
)
ëëo p
;
ëëp q
}
íí 
)
íí 
;
íí 
if
ïï 
(
ïï 
Environment
ïï 
.
ïï 
IsDevelopment
ïï )
(
ïï) *
)
ïï* +
)
ïï+ ,
{
ññ 
builder
óó 
.
óó +
AddDeveloperSigningCredential
óó 5
(
óó5 6
)
óó6 7
;
óó7 8
}
òò 
else
ôô 
{
öö 
string
õõ #
certificateThumbPrint
õõ ,
=
õõ- .
Configuration
õõ/ <
.
õõ< =
GetValue
õõ= E
(
õõE F
typeof
õõF L
(
õõL M
string
õõM S
)
õõS T
,
õõT U
$str
õõV m
)
õõm n
.
õõn o
ToString
õõo w
(
õõw x
)
õõx y
;
õõy z
builder
úú 
.
úú "
AddSigningCredential
úú ,
(
úú, -
CertificateHelper
úú- >
.
úú> ?)
LoadCertificateByThumbPrint
úú? Z
(
úúZ [#
certificateThumbPrint
úú[ p
)
úúp q
)
úúq r
;
úúr s
}
ùù &
IdentityModelEventSource
ûû $
.
ûû$ %
ShowPII
ûû% ,
=
ûû- .
true
ûû/ 3
;
ûû3 4
}
üü 	
public
°° 
void
°° 
	Configure
°° 
(
°° !
IApplicationBuilder
°° 1
app
°°2 5
)
°°5 6
{
¢¢ 	
bool
§§ 
seed
§§ 
=
§§ 
Configuration
§§ %
.
§§% &

GetSection
§§& 0
(
§§0 1
$str
§§1 7
)
§§7 8
.
§§8 9
GetValue
§§9 A
<
§§A B
bool
§§B F
>
§§F G
(
§§G H
$str
§§H N
)
§§N O
;
§§O P
if
•• 
(
•• 
seed
•• 
)
•• 
{
¶¶  
InitializeDatabase
ßß "
(
ßß" #
app
ßß# &
)
ßß& '
;
ßß' (
throw
®® 
new
®® 
	Exception
®® #
(
®®# $
$str
®®$ ]
)
®®] ^
;
®®^ _
}
©© 
if
´´ 
(
´´ 
Environment
´´ 
.
´´ 
IsDevelopment
´´ )
(
´´) *
)
´´* +
)
´´+ ,
{
¨¨ 
app
≠≠ 
.
≠≠ '
UseDeveloperExceptionPage
≠≠ -
(
≠≠- .
)
≠≠. /
;
≠≠/ 0
}
ÆÆ 
app
∞∞ 
.
∞∞ 
UseCookiePolicy
∞∞ 
(
∞∞  
)
∞∞  !
;
∞∞! "
app
≥≥ 
.
≥≥ 
UseStaticFiles
≥≥ 
(
≥≥ 
)
≥≥  
;
≥≥  !
app
¥¥ 
.
¥¥ 

UseRouting
¥¥ 
(
¥¥ 
)
¥¥ 
;
¥¥ 
app
∂∂ 
.
∂∂ 
UseIdentityServer
∂∂ !
(
∂∂! "
)
∂∂" #
;
∂∂# $
app
∑∑ 
.
∑∑ 
UseCors
∑∑ 
(
∑∑ $
MyAllowSpecificOrigins
∑∑ .
)
∑∑. /
;
∑∑/ 0
app
ªª 
.
ªª 
UseAuthentication
ªª !
(
ªª! "
)
ªª" #
;
ªª# $
app
ºº 
.
ºº 
UseAuthorization
ºº  
(
ºº  !
)
ºº! "
;
ºº" #
app
ææ 
.
ææ 
UseEndpoints
ææ 
(
ææ 
	endpoints
ææ &
=>
ææ' )
{
øø 
	endpoints
¿¿ 
.
¿¿ '
MapDefaultControllerRoute
¿¿ 3
(
¿¿3 4
)
¿¿4 5
;
¿¿5 6
}
¡¡ 
)
¡¡ 
;
¡¡ 
}
¬¬ 	
private
ƒƒ 
void
ƒƒ  
InitializeDatabase
ƒƒ '
(
ƒƒ' (!
IApplicationBuilder
ƒƒ( ;
app
ƒƒ< ?
)
ƒƒ? @
{
≈≈ 	
using
∆∆ 
(
∆∆ 
var
∆∆ 
serviceScope
∆∆ #
=
∆∆$ %
app
∆∆& )
.
∆∆) *!
ApplicationServices
∆∆* =
.
∆∆= >

GetService
∆∆> H
<
∆∆H I"
IServiceScopeFactory
∆∆I ]
>
∆∆] ^
(
∆∆^ _
)
∆∆_ `
.
∆∆` a
CreateScope
∆∆a l
(
∆∆l m
)
∆∆m n
)
∆∆n o
{
«« 
serviceScope
»» 
.
»» 
ServiceProvider
»» ,
.
»», - 
GetRequiredService
»»- ?
<
»»? @%
PersistedGrantDbContext
»»@ W
>
»»W X
(
»»X Y
)
»»Y Z
.
»»Z [
Database
»»[ c
.
»»c d
Migrate
»»d k
(
»»k l
)
»»l m
;
»»m n
var
   
context
   
=
   
serviceScope
   *
.
  * +
ServiceProvider
  + :
.
  : ; 
GetRequiredService
  ; M
<
  M N$
ConfigurationDbContext
  N d
>
  d e
(
  e f
)
  f g
;
  g h
context
ÀÀ 
.
ÀÀ 
Database
ÀÀ  
.
ÀÀ  !
Migrate
ÀÀ! (
(
ÀÀ( )
)
ÀÀ) *
;
ÀÀ* +
if
ÃÃ 
(
ÃÃ 
!
ÃÃ 
context
ÃÃ 
.
ÃÃ 
Clients
ÃÃ $
.
ÃÃ$ %
Any
ÃÃ% (
(
ÃÃ( )
)
ÃÃ) *
)
ÃÃ* +
{
ÕÕ 
foreach
ŒŒ 
(
ŒŒ 
var
ŒŒ  
client
ŒŒ! '
in
ŒŒ( *
Config
ŒŒ+ 1
.
ŒŒ1 2

GetClients
ŒŒ2 <
(
ŒŒ< =
)
ŒŒ= >
)
ŒŒ> ?
{
œœ 
context
–– 
.
––  
Clients
––  '
.
––' (
Add
––( +
(
––+ ,
client
––, 2
.
––2 3
ToEntity
––3 ;
(
––; <
)
––< =
)
––= >
;
––> ?
}
—— 
context
““ 
.
““ 
SaveChanges
““ '
(
““' (
)
““( )
;
““) *
}
”” 
if
’’ 
(
’’ 
!
’’ 
context
’’ 
.
’’ 
IdentityResources
’’ .
.
’’. /
Any
’’/ 2
(
’’2 3
)
’’3 4
)
’’4 5
{
÷÷ 
foreach
◊◊ 
(
◊◊ 
var
◊◊  
resource
◊◊! )
in
◊◊* ,
Config
◊◊- 3
.
◊◊3 4"
GetIdentityResources
◊◊4 H
(
◊◊H I
)
◊◊I J
)
◊◊J K
{
ÿÿ 
context
ŸŸ 
.
ŸŸ  
IdentityResources
ŸŸ  1
.
ŸŸ1 2
Add
ŸŸ2 5
(
ŸŸ5 6
resource
ŸŸ6 >
.
ŸŸ> ?
ToEntity
ŸŸ? G
(
ŸŸG H
)
ŸŸH I
)
ŸŸI J
;
ŸŸJ K
}
⁄⁄ 
context
€€ 
.
€€ 
SaveChanges
€€ '
(
€€' (
)
€€( )
;
€€) *
}
‹‹ 
if
ﬁﬁ 
(
ﬁﬁ 
!
ﬁﬁ 
context
ﬁﬁ 
.
ﬁﬁ 
	ApiScopes
ﬁﬁ &
.
ﬁﬁ& '
Any
ﬁﬁ' *
(
ﬁﬁ* +
)
ﬁﬁ+ ,
)
ﬁﬁ, -
{
ﬂﬂ 
foreach
‡‡ 
(
‡‡ 
var
‡‡  
scope
‡‡! &
in
‡‡' )
Config
‡‡* 0
.
‡‡0 1
GetApiScopes
‡‡1 =
(
‡‡= >
)
‡‡> ?
)
‡‡? @
{
·· 
context
‚‚ 
.
‚‚  
	ApiScopes
‚‚  )
.
‚‚) *
Add
‚‚* -
(
‚‚- .
scope
‚‚. 3
.
‚‚3 4
ToEntity
‚‚4 <
(
‚‚< =
)
‚‚= >
)
‚‚> ?
;
‚‚? @
}
„„ 
context
‰‰ 
.
‰‰ 
SaveChanges
‰‰ '
(
‰‰' (
)
‰‰( )
;
‰‰) *
}
ÂÂ 
if
ÁÁ 
(
ÁÁ 
!
ÁÁ 
context
ÁÁ 
.
ÁÁ 
ApiResources
ÁÁ )
.
ÁÁ) *
Any
ÁÁ* -
(
ÁÁ- .
)
ÁÁ. /
)
ÁÁ/ 0
{
ËË 
foreach
ÈÈ 
(
ÈÈ 
var
ÈÈ  
resource
ÈÈ! )
in
ÈÈ* ,
Config
ÈÈ- 3
.
ÈÈ3 4
GetApis
ÈÈ4 ;
(
ÈÈ; <
)
ÈÈ< =
)
ÈÈ= >
{
ÍÍ 
context
ÎÎ 
.
ÎÎ  
ApiResources
ÎÎ  ,
.
ÎÎ, -
Add
ÎÎ- 0
(
ÎÎ0 1
resource
ÎÎ1 9
.
ÎÎ9 :
ToEntity
ÎÎ: B
(
ÎÎB C
)
ÎÎC D
)
ÎÎD E
;
ÎÎE F
}
ÏÏ 
context
ÌÌ 
.
ÌÌ 
SaveChanges
ÌÌ '
(
ÌÌ' (
)
ÌÌ( )
;
ÌÌ) *
}
ÓÓ 
}
ÔÔ 
}
 	
}
ÚÚ 
}ÛÛ 