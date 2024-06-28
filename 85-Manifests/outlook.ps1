<#---
title: Outlook Manifest
output: outlook.xml
tag: outlook

---#>
param (
  $magicboxWeb = "localhost:1234"
)
if ($env:WORKDIR -eq $null) {
  $env:WORKDIR = join-path $psscriptroot ".." ".koksmat" "workdir"
}
$workdir = $env:WORKDIR

if (-not (Test-Path $workdir)) {
  $x = New-Item -Path $workdir -ItemType Directory 
}

$workdir = Resolve-Path $workdir


$manifest = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0" xmlns:mailappor="http://schemas.microsoft.com/office/mailappversionoverrides/1.0" xsi:type="MailApp">
  <Id>5e60ac88-e111-11ea-87d0-0242ac130003</Id>
   <Version>1.0.0.0</Version>
  <ProviderName>Nexi Group</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Magic Button"/>
  <Description DefaultValue="A template to get started."/>
  <IconUrl DefaultValue="https://$magicboxWeb/logo32.png"/>
  <HighResolutionIconUrl DefaultValue="https://$magicboxWeb/logo64.png"/>
 <SupportUrl DefaultValue="https://nexigroup.com" />

  <AppDomains>
    <AppDomain>https://apps.powerapps.com</AppDomain>
    <AppDomain>https://localhost:3000</AppDomain>

  </AppDomains>
  <Hosts>
    <Host Name="Mailbox"/>
  </Hosts>
  <Requirements>
    <Sets>
      <Set Name="Mailbox" MinVersion="1.1"/>
    </Sets>
  </Requirements>
  <FormSettings>
    <Form xsi:type="ItemRead">
      <DesktopSettings>
        <SourceLocation DefaultValue="https://$magicboxWeb"/>
        <RequestedHeight>250</RequestedHeight>
      </DesktopSettings>
    </Form>
  </FormSettings>
  <Permissions>ReadWriteItem</Permissions>
  <Rule xsi:type="RuleCollection" Mode="Or">
    <Rule xsi:type="ItemIs" ItemType="Appointment" FormType="Edit"/>
    <Rule xsi:type="ItemIs" ItemType="Message" FormType="Read"/>

    <Rule xsi:type="ItemIs" ItemType="Appointment" FormType="Read"/>

   

  </Rule>
  <DisableEntityHighlighting>false</DisableEntityHighlighting>
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides" xsi:type="VersionOverridesV1_0">
<VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides/1.1" xsi:type="VersionOverridesV1_1">
    <Requirements>
      <bt:Sets DefaultMinVersion="1.3">
        <bt:Set Name="Mailbox"/>
      </bt:Sets>
    </Requirements>
    <Hosts>
      <Host xsi:type="MailHost"> 
     
        <DesktopFormFactor>
          <FunctionFile resid="Commands.Url"/>
                      <ExtensionPoint xsi:type="MessageComposeCommandSurface">
              <OfficeTab id="TabDefault">
                <Group id="msgReadGroup">
                  <Label resid="GroupLabel"/>
                  <Control xsi:type="Button" id="msgReadOpenPaneButton">
                    <Label resid="TaskpaneButton.Label"/>
                    <Supertip>
                      <Title resid="TaskpaneButton.Label"/>
                      <Description resid="TaskpaneButton.Tooltip"/>
                    </Supertip>
                    <Icon>
                      <bt:Image size="16" resid="Icon.16x16"/>
                      <bt:Image size="32" resid="Icon.32x32"/>
                      <bt:Image size="80" resid="Icon.80x80"/>
                    </Icon>
                    <Action xsi:type="ShowTaskpane">
                      <SourceLocation resid="Taskpane.Url"/>
                    </Action>
                  </Control>
                 
                </Group>
              </OfficeTab>
            </ExtensionPoint>
          <ExtensionPoint xsi:type="AppointmentOrganizerCommandSurface">
            <OfficeTab id="TabDefault">
              <Group id="msgReadGroup2">
                <Label resid="GroupLabel"/>
                <Control xsi:type="Button" id="msgReadOpenPaneButton2">
                  <Label resid="TaskpaneButton.Label"/>
                  <Supertip>
                    <Title resid="TaskpaneButton.Label"/>
                    <Description resid="TaskpaneButton.Tooltip"/>
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon.16x16"/>
                    <bt:Image size="32" resid="Icon.32x32"/>
                    <bt:Image size="80" resid="Icon.80x80"/>
                  </Icon>
                  <Action xsi:type="ShowTaskpane">
                    <SourceLocation resid="Taskpane.Url"/>
                  </Action>
                </Control>
        
              </Group>
            </OfficeTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
    </Hosts>
      <Resources>
        <bt:Images>
        <bt:Image id="Icon.16x16" DefaultValue="https://$magicboxWeb/logo16.png"/>
        <bt:Image id="Icon.32x32" DefaultValue="https://$magicboxWeb/logo32.png"/>
        <bt:Image id="Icon.80x80" DefaultValue="https://$magicboxWeb/logo80.png"/>
        </bt:Images>
        <bt:Urls>
          <bt:Url id="Commands.Url" DefaultValue="https://$magicboxWeb/officeaddin"/>
          <bt:Url id="Taskpane.Url" DefaultValue="https://$magicboxWeb/officeaddin"/>
        </bt:Urls>
        <bt:ShortStrings>
          <bt:String id="GroupLabel" DefaultValue="Magic Button "/>
          <bt:String id="TaskpaneButton.Label" DefaultValue="Magic Button "/>
        </bt:ShortStrings>
        <bt:LongStrings>
          <bt:String id="TaskpaneButton.Tooltip" DefaultValue="Your Nexi Group add-in loaded successfully. Go to the HOME tab and click the 'Magic Button' button to get started."/>
          <bt:String id="ActionButton.Tooltip" DefaultValue="Click to Show a Taskpane"/>
        </bt:LongStrings>
      </Resources>
            <WebApplicationInfo>
        <Id>64599827-012f-4b98-a7ed-52c92947df32</Id>
        <Resource>api://$magicboxWeb/64599827-012f-4b98-a7ed-52c92947df32</Resource>
        <Scopes>
          <Scope>User.Read</Scope>
          <Scope>profile</Scope>
        </Scopes>
      </WebApplicationInfo>
  </VersionOverrides>
    </VersionOverrides>
</OfficeApp>
"@


Out-File -FilePath (join-path  $workdir "outlook.xml") -InputObject $manifest -Encoding utf8BOM