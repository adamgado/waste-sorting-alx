# Autonomous Robotic Waste Sorting

The **Autonomous Robotic Waste Sorting System** automates waste identification and sorting using real-time recognition, drastically improving on manual waste sorting’s speed, accuracy, and cost efficiency. The system comprises three main modules:

1. **Administration Module**: Manages and monitors waste-sorting machines.
2. **Waste-Sorting Machine Module**: Executes the identification and sorting of materials autonomously.
3. **User Module**: Allows users to interact with and manage machine functions, assign materials, and initiate maintenance.

This system categorizes waste into **Recycled** and **Non-Recycled** materials and is highly adaptable, handling multiple material types such as plastic, cardboard, aluminium, and steel.

## **System Components and Key Functionalities**

### **Administration Module**

The Administration Module provides complete management of waste-sorting machines, including real-time monitoring and operational control.

- **Machine Management**:
    - **Add/Remove Machines**: Admins can add new waste-sorting machines or remove ones that are no longer needed.
    - **Machine Details**: Each machine has configurable settings like name, power status, maintenance status, and a list of materials it can identify and sort.
- **Real-Time Monitoring**:
    - **Sorting Statistics**: Admins can monitor the number of recycled and non-recycled materials sorted by each machine.
    - **Machine Status**: Real-time status updates display whether a machine is powered on or off and if it is in maintenance mode.

### **Waste-Sorting Machine Module**

This module represents the autonomous sorting machine's hardware and software, responsible for identifying materials and sorting them into categories based on predefined criteria.

- **Identification and Sorting**:
    - **Autonomous Sorting**: Machines identify each material in the input list, sorting it into recycled or non-recycled categories autonomously.
    - **Real-Time Processing**: The machine can identify and sort a material every 2 seconds, ensuring a high throughput rate.
- **Operational Controls**:
    - **Power Control**: The machine can be turned on or off. When off, it cannot identify or sort materials.
    - **~~Maintenance Mode**: In maintenance mode, the machine halts all sorting operations to allow for repairs or updates.~~
    - Maintenance Mode(**EDITED**):
        1. Halts receiving list of materials from users
        2. Begins the autonomous identification and sorting

### **User Module**

The User Module allows authenticated users to interact with the system by assigning materials, managing machine operations, and initiating maintenance.

- **User Authentication**:
    - **Sign-In/Sign-Up**: Users must authenticate to access the system. This ensures secure access to machine operations and material assignments.
- **Assign Materials**:
    - **Material List Assignment**: Users can choose a machine and assign a list of materials for it to identify and sort. There is no fixed limit on the number of materials assigned, enhancing the system's flexibility.
- **~~Maintenance Control**:~~
    - **~~Maintenance Mode Activation**: Users can place machines in maintenance mode when needed, halting all sorting activity to facilitate repairs or adjustments.~~

---

### **System Workflow**

1. **Machine Setup and Management (Admin)**:
    - Admins add and configure machines in the system, including assigning materials each machine can identify and monitor.
    - Admins can view real-time stats, like the number of recycled and non-recycled materials sorted, and check the machine's operational status.
2. **User Material Assignment and Machine Control**:
    - Users authenticate, select a specific machine, and assign a list of materials to it for sorting.
    - Users can toggle the machine into maintenance mode if repairs are needed.
3. **Autonomous Sorting Process**:
    - **Identification and Sorting**: The machine processes each assigned material one-by-one, categorizing it as recycled or non-recycled every 2 seconds.
    - **Sorting Display**: Sorted materials appear in two categories (Recycled and Non-Recycled) on the machine’s interface, allowing for visual confirmation.

# View

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
