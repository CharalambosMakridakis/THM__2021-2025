package de.thm.mni.compilerbau.phases._05_varalloc;

import de.thm.mni.compilerbau.utils.NotImplemented;

/**
 * This class describes the stack frame layout of a procedure.
 * It contains the sizes of the various subareas and provides methods to retrieve information about the stack frame required to generate code for the procedure.
 */
public class StackLayout {
    // The following values have to be set in phase 5
    public Integer argumentAreaSize = null;
    public Integer localVarAreaSize = null;
    public Integer outgoingAreaSize = null;

    public boolean isLeafProc = false;
    public boolean isOptimizedLeafProcedure = false;  // Only relevant for --leafProc

    public static final int RETURN_ADR_BYTESIZE = 4;
    public static final int OLD_FRAMEPOINTER_BYTESIZE = 4;

    /**
     * @return The total size of the stack frame described by this object.
     */
    public int frameSize() {
        //TODO (assignment 5): Calculate the size of the stack frame
        //return localVarAreaSize + OLD_FRAMEPOINTER_BYTESIZE + (isLeafProc ? 0 : OLD_FRAMEPOINTER_BYTESIZE) + outgoingAreaSize; // womöglich immer +4 wegen oldreturn
        return localVarAreaSize + OLD_FRAMEPOINTER_BYTESIZE + OLD_FRAMEPOINTER_BYTESIZE + outgoingAreaSize; // womöglich immer +4 wegen oldreturn
    }

    /**
     * @return The offset (starting from the new stack pointer) where the old frame pointer is stored in this stack frame.
     */
    public int oldFramePointerOffset() {
        return outgoingAreaSize + RETURN_ADR_BYTESIZE;
    }

    /**
     * @return The offset (starting from the new frame pointer) where the old return address is stored in this stack frame.
     */
    public int oldReturnAddressOffset() {
        //TODO (assignment 5): Calculate the offset of the old return address
        return -(localVarAreaSize + OLD_FRAMEPOINTER_BYTESIZE + RETURN_ADR_BYTESIZE);
    }
}
