// Function to show "new message received" pattern
function showReceivedPattern () {
    basic.showLeds(`
        # # # # #
        # . . . #
        # . # . #
        # . . . #
        # # # # #
        `)
}
// Press A to toggle message selection (1-5)
input.onButtonPressed(Button.A, function () {
    selectedMessage += 1
    if (selectedMessage > 5) {
        // Reset back to message 1
        selectedMessage = 1
    }
    // Display the selected message
    showMessagePattern(selectedMessage)
})
// Function to display predefined LED patterns for messages
function showMessagePattern (msg: number) {
    if (msg == 1) {
        basic.showLeds(`
            # . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    } else if (msg == 2) {
        basic.showLeds(`
            # . . . .
            # # . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    } else if (msg == 3) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            . . . . .
            . . . . .
            `)
    } else if (msg == 4) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            # # # # .
            . . . . .
            `)
    } else if (msg == 5) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            # # # # .
            # # # # #
            `)
    } else {
        // Show "No" if invalid message
        basic.showIcon(IconNames.No)
    }
}
// Press A+B to clear selection
input.onButtonPressed(Button.AB, function () {
    selectedMessage = 0
    // Show "No" icon to indicate cleared selection
    basic.showIcon(IconNames.No)
})
// Press B to send the selected message
input.onButtonPressed(Button.B, function () {
    if (selectedMessage == 0) {
        // Show sad face if no message selected
        basic.showIcon(IconNames.Sad)
        basic.pause(3000)
        // Return to "No" icon
        basic.showIcon(IconNames.No)
    } else {
        // Broadcast the selected message
        radio.sendValue("msg", selectedMessage)
        // Send sender's ID to prevent self-reception
        radio.sendValue("id", deviceID)
        // Indicate message sent
        basic.showIcon(IconNames.Happy)
        basic.pause(3000)
        // Restore the last selected message
        showMessagePattern(selectedMessage)
    }
})
/**
 * Tracks current message selection (1-5)
 */
// Receive and process incoming messages
radio.onReceivedValue(function (name, value) {
    if (name == "id" && value == deviceID) {
        // Ignore own messages
        return
    }
    if (name == "msg") {
        lastReceivedMessage = value
        // Show that a new message was received
        showReceivedPattern()
        basic.pause(3000)
        // Display received message or "No" icon
        showMessagePattern(lastReceivedMessage)
    }
})
let lastReceivedMessage = 0
let selectedMessage = 0
let deviceID = 0
// Set group for communication
radio.setGroup(1)
// Allow time for radio setup
basic.pause(500)
// Stores last received message
// Unique ID for each Micro:bit
deviceID = control.deviceSerialNumber()
// Show a tick icon to indicate successful initialization
basic.showIcon(IconNames.Yes)
