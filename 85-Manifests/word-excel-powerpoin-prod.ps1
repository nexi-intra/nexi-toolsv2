<#---
title: Multi Manifest (Word, Excel, PowerPoint)
output: word-excel-powerpoint-nexi.xml
tag: multi-prod

---#>

param (
  $magicboxWeb = "infocast.home.nexi-intra.com"
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
<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
  xmlns:ov="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="TaskPaneApp">

  <!-- Begin Basic Settings: Add-in metadata, used for all versions of Office unless override provided. -->

  <!-- IMPORTANT! Id must be unique for your add-in, if you reuse this manifest ensure that you change this id to a new GUID. -->
  <Id>e0494499-90e7-4cf1-8242-eec815fb1fae</Id>

  <!--Version. Updates from the store only get triggered if there is a version change. -->
  <Version>1.0.0.0</Version>
  <ProviderName>[Provider name]</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <!-- The display name of your add-in. Used on the store and various places of the Office UI such as the add-ins dialog. -->
  <DisplayName DefaultValue="Magic Button" />
  <Description DefaultValue="[Document Add-in description]"/>

  <!-- Icon for your add-in. Used on installation screens and the add-ins dialog. -->
  <IconUrl DefaultValue="https://$magicboxWeb/logo32.png" />
  <HighResolutionIconUrl DefaultValue="https://$magicboxWeb/logo64.png"/>

  <!--If you plan to submit this add-in to the Office Store, uncomment the SupportUrl element below-->
  <SupportUrl DefaultValue="https://nexigroup.com" />

  <!-- Domains that will be allowed when navigating. For example, if you use ShowTaskpane and then have an href link, navigation will only be allowed if the domain is on this list. -->
  <AppDomains>
    <AppDomain>https://$magicboxWeb</AppDomain>
  </AppDomains>
  <!--End Basic Settings. -->

  <!--Begin TaskPane Mode integration. This section is used if there are no VersionOverrides or if the Office client version does not support add-in commands. -->
  <Hosts>
    <Host Name="Document" />
    <Host Name="Workbook" />
    <Host Name="Presentation" />
  </Hosts>
  <DefaultSettings>
    <SourceLocation DefaultValue="https://$magicboxWeb/officeaddin" />
  </DefaultSettings>
  <!-- End TaskPane Mode integration.  -->

  <Permissions>ReadWriteDocument</Permissions>

  <!-- Begin Add-in Commands Mode integration. -->
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="VersionOverridesV1_0">

    <!-- The Hosts node is required. -->
    <Hosts>
      <!-- Each host can have a different set of commands. -->
      <!-- Excel host is Workbook, Word host is Document, and PowerPoint host is Presentation. -->
      <!-- Make sure the hosts you override match the hosts declared in the top section of the manifest. -->

      <Host xsi:type="Document">
        <!-- Form factor. Currently only DesktopFormFactor is supported. -->
        <DesktopFormFactor>
          <!--"This code enables a customizable message to be displayed when the add-in is loaded successfully upon individual install."-->
          <GetStarted>
            <!-- Title of the Getting Started callout. resid points to a ShortString resource -->
            <Title resid="GetStarted.Title"/>

            <!-- Description of the Getting Started callout. resid points to a LongString resource -->
            <Description resid="GetStarted.Description"/>

            <!-- Point to a url resource which details how the add-in should be used. -->
            <LearnMoreUrl resid="GetStarted.LearnMoreUrl"/>
          </GetStarted>
          <!-- Function file is a HTML page that includes the JavaScript where functions for ExecuteAction will be called.
            Think of the FunctionFile as the code behind ExecuteFunction. -->
          <FunctionFile resid="Commands.Url" />

          <!-- PrimaryCommandSurface is the main Office Ribbon. -->
          <ExtensionPoint xsi:type="PrimaryCommandSurface">
            <!-- Use OfficeTab to extend an existing Tab. Use CustomTab to create a new tab. -->
            <OfficeTab id="TabHome">
              <!-- Ensure you provide a unique id for the group. Recommendation for any IDs is to namespace using your company name. -->
              <Group id="CommandsGroup">
                <!-- Label for your group. resid must point to a ShortString resource. -->
                <Label resid="CommandsGroup.Label" />
                <!-- Icons. Required sizes 16,32,80, optional 20, 24, 40, 48, 64. Strongly recommended to provide all sizes for great UX. -->
                <!-- Use PNG icons. All URLs on the resources section must use HTTPS. -->
                <Icon>
                  <bt:Image size="16" resid="Icon.16x16" />
                  <bt:Image size="32" resid="Icon.32x32" />
                  <bt:Image size="80" resid="Icon.80x80" />
                </Icon>

                <!-- Control. It can be of type "Button" or "Menu". -->
                <Control xsi:type="Button" id="TaskpaneButton">
                  <Label resid="TaskpaneButton.Label" />
                  <Supertip>
                    <!-- ToolTip title. resid must point to a ShortString resource. -->
                    <Title resid="TaskpaneButton.Label" />
                    <!-- ToolTip description. resid must point to a LongString resource. -->
                    <Description resid="TaskpaneButton.Tooltip" />
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon.16x16" />
                    <bt:Image size="32" resid="Icon.32x32" />
                    <bt:Image size="80" resid="Icon.80x80" />
                  </Icon>

                  <!-- This is what happens when the command is triggered (E.g. click on the Ribbon). Supported actions are ExecuteFunction or ShowTaskpane. -->
                  <Action xsi:type="ShowTaskpane">
                    <TaskpaneId>ButtonId1</TaskpaneId>
                    <!-- Provide a url resource id for the location that will be displayed on the task pane. -->
                    <SourceLocation resid="Taskpane.Url" />
                  </Action>
                </Control>
              </Group>
            </OfficeTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
      <Host xsi:type="Workbook">
        <!-- Form factor. Currently only DesktopFormFactor is supported. -->
        <DesktopFormFactor>
          <!--"This code enables a customizable message to be displayed when the add-in is loaded successfully upon individual install."-->
          <GetStarted>
            <!-- Title of the Getting Started callout. resid points to a ShortString resource -->
            <Title resid="GetStarted.Title"/>

            <!-- Description of the Getting Started callout. resid points to a LongString resource -->
            <Description resid="GetStarted.Description"/>

            <!-- Point to a url resource which details how the add-in should be used. -->
            <LearnMoreUrl resid="GetStarted.LearnMoreUrl"/>
          </GetStarted>
          <!-- Function file is a HTML page that includes the JavaScript where functions for ExecuteAction will be called.
            Think of the FunctionFile as the code behind ExecuteFunction. -->
          <FunctionFile resid="Commands.Url" />

          <!-- PrimaryCommandSurface is the main Office Ribbon. -->
          <ExtensionPoint xsi:type="PrimaryCommandSurface">
            <!-- Use OfficeTab to extend an existing Tab. Use CustomTab to create a new tab. -->
            <OfficeTab id="TabHome">
              <!-- Ensure you provide a unique id for the group. Recommendation for any IDs is to namespace using your company name. -->
              <Group id="CommandsGroup">
                <!-- Label for your group. resid must point to a ShortString resource. -->
                <Label resid="CommandsGroup.Label" />
                <!-- Icons. Required sizes 16,32,80, optional 20, 24, 40, 48, 64. Strongly recommended to provide all sizes for great UX. -->
                <!-- Use PNG icons. All URLs on the resources section must use HTTPS. -->
                <Icon>
                  <bt:Image size="16" resid="Icon.16x16" />
                  <bt:Image size="32" resid="Icon.32x32" />
                  <bt:Image size="80" resid="Icon.80x80" />
                </Icon>

                <!-- Control. It can be of type "Button" or "Menu". -->
                <Control xsi:type="Button" id="TaskpaneButton">
                  <Label resid="TaskpaneButton.Label" />
                  <Supertip>
                    <!-- ToolTip title. resid must point to a ShortString resource. -->
                    <Title resid="TaskpaneButton.Label" />
                    <!-- ToolTip description. resid must point to a LongString resource. -->
                    <Description resid="TaskpaneButton.Tooltip" />
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon.16x16" />
                    <bt:Image size="32" resid="Icon.32x32" />
                    <bt:Image size="80" resid="Icon.80x80" />
                  </Icon>

                  <!-- This is what happens when the command is triggered (E.g. click on the Ribbon). Supported actions are ExecuteFunction or ShowTaskpane. -->
                  <Action xsi:type="ShowTaskpane">
                    <TaskpaneId>ButtonId1</TaskpaneId>
                    <!-- Provide a url resource id for the location that will be displayed on the task pane. -->
                    <SourceLocation resid="Taskpane.Url" />
                  </Action>
                </Control>
              </Group>
            </OfficeTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
      <Host xsi:type="Presentation">
        <!-- Form factor. Currently only DesktopFormFactor is supported. -->
        <DesktopFormFactor>
          <!--"This code enables a customizable message to be displayed when the add-in is loaded successfully upon individual install."-->
          <GetStarted>
            <!-- Title of the Getting Started callout. resid points to a ShortString resource -->
            <Title resid="GetStarted.Title"/>

            <!-- Description of the Getting Started callout. resid points to a LongString resource -->
            <Description resid="GetStarted.Description"/>

            <!-- Point to a url resource which details how the add-in should be used. -->
            <LearnMoreUrl resid="GetStarted.LearnMoreUrl"/>
          </GetStarted>
          <!-- Function file is a HTML page that includes the JavaScript where functions for ExecuteAction will be called.
            Think of the FunctionFile as the code behind ExecuteFunction. -->
          <FunctionFile resid="Commands.Url" />

          <!-- PrimaryCommandSurface is the main Office Ribbon. -->
          <ExtensionPoint xsi:type="PrimaryCommandSurface">
            <!-- Use OfficeTab to extend an existing Tab. Use CustomTab to create a new tab. -->
            <OfficeTab id="TabHome">
              <!-- Ensure you provide a unique id for the group. Recommendation for any IDs is to namespace using your company name. -->
              <Group id="CommandsGroup">
                <!-- Label for your group. resid must point to a ShortString resource. -->
                <Label resid="CommandsGroup.Label" />
                <!-- Icons. Required sizes 16,32,80, optional 20, 24, 40, 48, 64. Strongly recommended to provide all sizes for great UX. -->
                <!-- Use PNG icons. All URLs on the resources section must use HTTPS. -->
                <Icon>
                  <bt:Image size="16" resid="Icon.16x16" />
                  <bt:Image size="32" resid="Icon.32x32" />
                  <bt:Image size="80" resid="Icon.80x80" />
                </Icon>

                <!-- Control. It can be of type "Button" or "Menu". -->
                <Control xsi:type="Button" id="TaskpaneButton">
                  <Label resid="TaskpaneButton.Label" />
                  <Supertip>
                    <!-- ToolTip title. resid must point to a ShortString resource. -->
                    <Title resid="TaskpaneButton.Label" />
                    <!-- ToolTip description. resid must point to a LongString resource. -->
                    <Description resid="TaskpaneButton.Tooltip" />
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon.16x16" />
                    <bt:Image size="32" resid="Icon.32x32" />
                    <bt:Image size="80" resid="Icon.80x80" />
                  </Icon>

                  <!-- This is what happens when the command is triggered (E.g. click on the Ribbon). Supported actions are ExecuteFunction or ShowTaskpane. -->
                  <Action xsi:type="ShowTaskpane">
                    <TaskpaneId>ButtonId1</TaskpaneId>
                    <!-- Provide a url resource id for the location that will be displayed on the task pane. -->
                    <SourceLocation resid="Taskpane.Url" />
                  </Action>
                </Control>
              </Group>
            </OfficeTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
    </Hosts>

    <!-- You can use resources across hosts and form factors. -->
    <Resources>
      <bt:Images>
        <bt:Image id="Icon.16x16" DefaultValue="https://$magicboxWeb/logo16.png"/>
        <bt:Image id="Icon.32x32" DefaultValue="https://$magicboxWeb/logo32.png"/>
        <bt:Image id="Icon.80x80" DefaultValue="https://$magicboxWeb/logo80.png"/>
      </bt:Images>
      <bt:Urls>
        <bt:Url id="GetStarted.LearnMoreUrl" DefaultValue="https://go.microsoft.com/fwlink/?LinkId=276812" />
        <bt:Url id="Commands.Url" DefaultValue="https://$magicboxWeb/officeaddin" />
        <bt:Url id="Taskpane.Url" DefaultValue="https://$magicboxWeb/officeaddin" />
      </bt:Urls>
      <!-- ShortStrings max characters==125. -->
      <bt:ShortStrings>
        <bt:String id="GetStarted.Title" DefaultValue="Magic Button " />
        <bt:String id="CommandsGroup.Label" DefaultValue="Nexi Group" />
        <bt:String id="TaskpaneButton.Label" DefaultValue="Magic Button" />
      </bt:ShortStrings>
      <!-- LongStrings max characters==250. -->
      <bt:LongStrings>
        <bt:String id="GetStarted.Description" DefaultValue="Your Nexi Group add-in loaded successfully. Go to the HOME tab and click the 'Magic Button' button to get started." />
        <bt:String id="TaskpaneButton.Tooltip" DefaultValue="Click to Show a Taskpane" />
      </bt:LongStrings>
    </Resources>
  </VersionOverrides>
  <!-- End Add-in Commands Mode integration. -->

</OfficeApp>

"@


Out-File -FilePath (join-path  $workdir "word-excel-powerpoint-nexi.xml") -InputObject $manifest -Encoding utf8BOM