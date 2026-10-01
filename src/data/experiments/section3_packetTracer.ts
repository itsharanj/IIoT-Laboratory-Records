import { Experiment } from '../../types/experiment';

export const SECTION_3_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-17',
    expNo: 17,
    title: 'IoT Home Automation',
    category: 'Section 3: Cisco Packet Tracer IoT Simulations',
    categoryShort: 'Packet Tracer',
    aim: 'To simulate and configure a complete Smart Home IoT network in Cisco Packet Tracer incorporating a Home Gateway, Smart Doors, Smart Lights, Ceiling Fan, and a Tablet/Smartphone controller.',
    apparatus: [
      { slNo: 1, name: 'Cisco Packet Tracer Software', specs: 'Version 8.0 or higher with IoT simulation engine', quantity: '1 Unit' },
      { slNo: 2, name: 'Home Gateway', specs: 'Cisco Wireless IoT Home Gateway (2.4GHz Wi-Fi, DHCP, Web Server)', quantity: '1 No.' },
      { slNo: 3, name: 'Smart IoT End Devices', specs: 'Smart Light, Smart Door, Smart Fan, Window', quantity: '4 Nos.' },
      { slNo: 4, name: 'User Management Device', specs: 'Tablet / Smartphone with IoT Monitor browser', quantity: '1 Unit' },
    ],
    procedure: `1. Open Cisco Packet Tracer

2. Add required components
Network Device → Wireless Device → Home Gateway
End Device → Smart Device ( Smart Phone )
End Device → Home → light, ceiling fan, Window

3. Configuration
Click Home Gateway → Config → Wireless → Copy the SSID ( Home Gateway )
Click on Smart Phone → Config → Wireless → Add SSID

Click on other End Devices → Advanced
i ) Config
* Change Display if needed
* IOT Server → Home Gateway

ii ) I/O config → Network Adapter → PT-IOT-NM-1W

4. Connections are made as per the requirement.

5. To control the connected devices
Click on Smartphone → Desktop → IOT Monitor`,
    images: [],
    code: '',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Smart Home devices connected to Home Gateway with automated state management verified in Cisco Packet Tracer.',
    },
    conclusion: 'A multi-device smart home network topology with centralized gateway control was successfully simulated and verified in Cisco Packet Tracer.',
    softwareComponents: ['Wireless Router', 'IoT Device', 'PC / Laptop', 'DHCP Server'],
    tutorialVideoUrl: '',
  },
  {
    id: 'exp-18',
    expNo: 18,
    title: 'IoT Smoke Detector',
    category: 'Section 3: Cisco Packet Tracer IoT Simulations',
    categoryShort: 'Packet Tracer',
    aim: 'To model an industrial fire safety emergency management system in Cisco Packet Tracer using Smoke Detectors, sirens, and automated fire sprinklers.',
    apparatus: [
      { slNo: 1, name: 'Cisco Packet Tracer Software', specs: 'IoT simulation suite', quantity: '1 Unit' },
      { slNo: 2, name: 'IoT Microcontroller / MCU-PT', specs: 'Programmable safety controller', quantity: '1 No.' },
      { slNo: 3, name: 'Smoke Detector Sensor', specs: 'Environmental gas/smoke sensor element', quantity: '1 No.' },
      { slNo: 4, name: 'Fire Sprinkler & Alarm Siren', specs: 'Emergency suppression and audible warning actuators', quantity: '1 Set' },
      { slNo: 5, name: 'IoT Home Gateway', specs: 'Network coordinator and registration server', quantity: '1 No.' },
    ],
    procedure: `1. Open Cisco Packet Tracer

2. Add required components
Network Device → Wireless Device → Home Gateway
End Device → Smart Device ( Smart Phone )
End Device → Home → Smoke Detector , Siren
End Device → Smart City → Old Car( To produce smoke )

3. Configuration
Click Home Gateway → Config → Wireless → Copy the SSID ( Home Gateway )
Click on Smart Phone → Config → Wireless → Add SSID

Click on other End Devices → Advanced
i ) Config
* Change Display if needed
* IOT Server → Home Gateway

ii ) I/O config → Network Adapter → PT-IOT-NM-1W

4. Connections are made as per the requirement.

5. Add a condition to turn ON the Siren using threshold smoke value .
Click on Smartphone → Desktop → IOT Monitor → Conditions

6. To get smoke , press Alt and click on the old car.`,
    images: [],
    code: '',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Smoke threshold breach triggers audible alarm siren and fire suppression sprinkler in Cisco Packet Tracer.',
    },
    conclusion: 'Automated fire and smoke emergency response workflow was successfully modeled in Cisco Packet Tracer.',
    softwareComponents: ['IoT Device', 'Wireless Router', 'Ethernet Cable'],
    tutorialVideoUrl: '',
  },
  {
    id: 'exp-19',
    expNo: 19,
    title: 'Pushbutton Controlled LED',
    category: 'Section 3: Cisco Packet Tracer IoT Simulations',
    categoryShort: 'Packet Tracer',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To design and simulate a Pushbutton Controlled LED circuit in Cisco Packet Tracer using an IoT Microcontroller (MCU-PT) with digital input and output routing.',
    apparatus: [
      { slNo: 1, name: 'Cisco Packet Tracer Software', specs: 'Version 8.0 or higher', quantity: '1 Unit' },
      { slNo: 2, name: 'IoT Microcontroller (MCU-PT)', specs: 'Programmable MCU with digital/analog slots', quantity: '1 No.' },
      { slNo: 3, name: 'Pushbutton Component', specs: 'Digital momentary tactile switch', quantity: '1 No.' },
      { slNo: 4, name: 'LED Actuator Component', specs: 'Visual indicator element', quantity: '1 No.' },
      { slNo: 5, name: 'IoT Custom Cables', specs: 'Direct digital I/O connection leads', quantity: '2 Nos.' },
    ],
    procedure: `1. In Cisco Packet Tracer, place an MCU-PT (IoT Microcontroller), a Pushbutton, and an LED on the workspace.
2. Using IoT Custom Cables, connect the Pushbutton to MCU-PT digital slot D0.
3. Connect the LED component to MCU-PT digital slot D1.
4. Click on the MCU-PT, navigate to the Programming tab, and open or create a script.
5. Configure digital pin D0 as INPUT and pin D1 as OUTPUT with polling logic.
6. Click the Run button to start script execution on the virtual controller.
7. Alt-click the Pushbutton to simulate a press and confirm that the LED illuminates, then release the button to verify the LED turns OFF.`,
    images: [],
    code: '',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'LED illumination toggles conditionally in response to pushbutton clicks in Cisco Packet Tracer.',
    },
    conclusion: 'Digital logic interfacing and direct GPIO state propagation was simulated in Cisco Packet Tracer.',
    softwareComponents: ['IoT Device', 'Ethernet Cable'],
    tutorialVideoUrl: '',
  },
  {
    id: 'exp-20',
    expNo: 20,
    title: 'IoT Devices Networking',
    category: 'Section 3: Cisco Packet Tracer IoT Simulations',
    categoryShort: 'Packet Tracer',
    aim: 'To design and configure an end-to-end IoT Network in Cisco Packet Tracer connecting various IoT sensors and actuators across routers, switches, and an IoT Registration Server.',
    apparatus: [
      { slNo: 1, name: 'Cisco Packet Tracer Software', specs: 'Version 8.0+', quantity: '1 Unit' },
      { slNo: 2, name: 'Cisco 2901 Router & 2960 Switch', specs: 'IP routing and switching infrastructure', quantity: '1 Set' },
      { slNo: 3, name: 'IoT Registration Server', specs: 'Dedicated server with IoT service running', quantity: '1 Server' },
      { slNo: 4, name: 'IoT End Devices', specs: 'Motion sensor, Siren, Light, Door', quantity: '4 Nos.' },
      { slNo: 5, name: 'Cat6 Ethernet Cables', specs: 'Copper straight-through cabling', quantity: '1 Set' },
    ],
    procedure: `Please refer to this video : https://youtu.be/EdYOZbX3r7s?si=R3rZG5glQYLxb8ZS

1 ) Open Cisco Packet Tracer

2) Add required component
Network device → Switches → 2950 - 24
Network device → Switches → 2950 - 24
Network device → Wireless device → WRT300N
Network device → Wireless device → Cell Tower → Central - Office - Server
End devices → Home → Ceiling Fan, light, Garage Door
End devices → Server - PT, Laptop - PT, Smartphone - PT

3 ) Configuration
 a) Click on Server → Config → Fast Ethernet → IP Configuration → Static
      Type → IP Address : 192.168.1.2
 b) Click on Server → Services
   i) IoT → Registration Service → Service → ON
   ii) AAA → Service → ON
        → Network Configuration (to router)
        → User setup for garage door, mobile, light and ceiling fan

c) Click on WRT300N → Config → Internet → IP configuration → Static
     Type → IP Address : 192.168.1.3

d) Click on Switch 0 → CLI → Assign the IP Address 192.168.1.1 (Default GW)

e) Click on WRT300N → Internet →IP Config →Static → Default Gateway : 192.168.1.1

f) Click on WRT300N → GUI
   i) Setup → Internet Connection Type : Automatic Configuration - DHCP
  ii) Wireless → SSID: Dome
      wireless security
    Save settings

g) Click on Other End Devices → Advanced → Config → Wireless0
  SSID : home
  Authentication user ID and password
  → I/O Config → Network Adapter → PT-IoT-NM-4-W
  → Config → Settings → Server Address : 192.168.1.2
  Click on Connect

h) Click on Laptop - PT → Config → FastEthernet
 → IP Config → static
  Username : 192.168.1.4

Ping the server using Command Prompt

i ) Click on Laptop - PT → Desktop IoT Monitor → Sign up now
Username : home
Password : home 123
Click on create

j ) Click on End Devices → Config → Settings → IoT server
Username : home
Password : home 123
Connect

K ) Now, you can control and devices using Laptop

l ) Click on smartphone - PT → Config → Wireless0 → Authentication → WPA2
Username : mobile
Password : mobile123

→ Desktop → IOT Monitor
IoT Server Address : 192.168.1.2
Username : home
Password : home 123
Click on login

m ) Now, you can control End devices

4 ) Automatic connections are made using IoT custom cable as per the requirement.`,
    images: [],
    code: '',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'All IoT smart devices successfully register on the centralized Cisco IoT Server dashboard.',
    },
    conclusion: 'Heterogeneous IoT network topology with IP addressing and centralized server monitoring was verified in Cisco Packet Tracer.',
    softwareComponents: ['Router', 'Switch', 'Server', 'IoT Device', 'PC / Laptop', 'Ethernet Cable', 'DHCP Server'],
    tutorialVideoUrl: '',
  },
];
