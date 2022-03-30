#C:\Windows\System32\inetsrv\appcmd start apppool /apppool.name:FJT_UI
#C:\Windows\System32\inetsrv\appcmd start apppool /apppool.name:FJT_API
#C:\Windows\System32\inetsrv\appcmd start apppool /apppool.name:FJT_Reporting
#C:\Windows\System32\inetsrv\appcmd start apppool /apppool.name:FJT_Search_Engine
#C:\Windows\System32\inetsrv\appcmd start apppool /apppool.name:FJT_Identity
#C:\Windows\System32\inetsrv\appcmd start apppool /apppool.name:FJT_Report_Designer
#C:\Windows\System32\inetsrv\appcmd start apppool /apppool.name:FJT_Report_Viewer
#Start-Sleep -s 10
#NET START "FJTEmailService"
#NET START "FJTPricingService"
#NET START "FJTElasticService"
C:\Windows\System32\inetsrv\appcmd start site /site.name:FJT_Main_UI
C:\Windows\System32\inetsrv\appcmd start site /site.name:FJT_Main_API
C:\Windows\System32\inetsrv\appcmd start site /site.name:FJT.Reporting.Main
C:\Windows\System32\inetsrv\appcmd start site /site.name:FJT.SearchEngine.Main
C:\Windows\System32\inetsrv\appcmd start site /site.name:FJT_Main_Identity
C:\Windows\System32\inetsrv\appcmd start site /site.name:FJT.ReportDesigner.Main
C:\Windows\System32\inetsrv\appcmd start site /site.name:FJT.ReportViewer.Main
Start-Sleep -s 10
NET START "FJTEmailService_Empty"
NET START "FJTPricingService_Empty"
NET START "FJTElasticService_Empty"
