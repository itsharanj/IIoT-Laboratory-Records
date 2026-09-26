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
    procedure: `1. Open Cisco Packet Tracer and place a Wireless Home Gateway on the logical workspace.
2. Add smart IoT end devices: Smart Light, Smart Door, Smart Fan, and Window onto the canvas.
3. Configure the wireless adapter on each IoT device to associate with the Home Gateway SSID ("HomeGateway").
4. Add a Tablet or PC, configure its wireless network to associate with the Home Gateway, and verify DHCP IP allocation.
5. In the IoT devices' settings, set the IoT Server option to "Home Gateway".
6. Open the Web Browser on the Tablet, enter the Home Gateway IP address (192.168.25.1), and log in to the IoT Monitor dashboard.
7. Click the control widgets on the dashboard to remotely toggle the Smart Light, Door, and Fan, verifying bidirectional automated actuation.`,
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
    procedure: `1. Launch Cisco Packet Tracer and drag a Smoke Detector, Fire Sprinkler, Siren, and Home Gateway into the workspace.
2. Connect all IoT devices to the Home Gateway wirelessly or via IoT custom cables.
3. In each device's configuration panel, set the IoT Server to "Home Gateway".
4. On the Home Gateway, create an IoT monitoring condition: IF Smoke Detector particulate level > 150 THEN Siren = ON and Sprinkler = ON.
5. Alt-click the Smoke Detector or drag a smoke particle source near the detector to increase the smoke density.
6. Verify that the Siren triggers an audible alert and the Fire Sprinkler actuates automatically to disperse water.`,
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
    procedure: `1. Open Cisco Packet Tracer and assemble a network topology consisting of a 2901 Router, 2960 Switch, and a dedicated IoT Registration Server.
2. Connect the IoT Server and smart devices (Motion Sensor, Siren, Smart Lamp) to switch FastEthernet ports using Cat6 straight-through cables.
3. Configure static IP addresses or enable DHCP on the router for the IoT subnet (e.g. 192.168.1.0/24).
4. On the IoT Server, navigate to Services > IoT and turn the service ON.
5. On each IoT end device, access the Config tab, select Remote Server, and enter the server IP (192.168.1.1) along with user credentials.
6. Open a PC on the network, navigate to the IoT Server IP via the web browser, and log in to the registration portal.
7. Verify that all distributed IoT devices are listed and can be monitored and actuated across the network.`,
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
